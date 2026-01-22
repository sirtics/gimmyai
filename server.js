const express = require("express");
const {
  createUploadthing,
  createRouteHandler,
} = require("uploadthing/express");
const cors = require("cors");
const stripe = require("stripe");
const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} = require("firebase/firestore");
const path = require("path");
require("dotenv").config();

const app = express();

// Rate limiting storage (in production, use Redis or similar)
const rateLimitStore = new Map();

// Simple rate limiting middleware
function rateLimitMiddleware(maxRequests, windowMs) {
  return (req, res, next) => {
    const key = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const entry = rateLimitStore.get(key);

    if (!entry || now > entry.resetTime) {
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });
      return next();
    }

    if (entry.count >= maxRequests) {
      const secondsUntilReset = Math.ceil((entry.resetTime - now) / 1000);
      return res.status(429).json({
        error: "Too many requests",
        message: `Rate limit exceeded. Please try again in ${secondsUntilReset} seconds.`,
        retryAfter: secondsUntilReset,
      });
    }

    entry.count++;
    rateLimitStore.set(key, entry);
    next();
  };
}

// Security headers middleware
function securityHeaders(req, res, next) {
  // Prevent XSS attacks
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  
  // Content Security Policy
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.openai.com https://*.firebaseio.com https://*.googleapis.com;"
  );
  
  // Strict Transport Security (only in production with HTTPS)
  if (process.env.NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
  
  next();
}

// Input validation middleware
function validateDonationInput(req, res, next) {
  const { amount, userId } = req.body;

  // Validate amount
  if (typeof amount !== "number" || isNaN(amount)) {
    return res.status(400).json({ error: "Amount must be a valid number" });
  }

  if (amount < 500) {
    return res.status(400).json({ error: "Minimum donation amount is $5 USD" });
  }

  if (amount > 1000000) {
    return res.status(400).json({ error: "Maximum donation amount is $10,000 USD" });
  }

  // Validate userId if provided
  if (userId && (typeof userId !== "string" || userId.length > 128)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  // Sanitize userId
  if (userId) {
    req.body.userId = userId.replace(/[^a-zA-Z0-9_-]/g, "").substring(0, 128);
  }

  next();
}

// Initialize Stripe
const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// Apply security headers to all routes
app.use(securityHeaders);

// Enable CORS for your Vite app
const allowedOrigins = process.env.NODE_ENV === "production"
  ? [process.env.FRONTEND_URL || "https://gimmyai.com"]
  : ["http://localhost:5173", "http://localhost:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// Body parsing with size limits
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Serve static files from the dist directory (for production)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "dist")));
}

const f = createUploadthing();

// Define the file router
const uploadRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async () => {
      // This code runs on your server before upload
      return { userId: "user" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);

      // Return the file URL in the expected format
      return { url: file.url };
    }),
};

// Create the uploadthing route handler
const uploadthingHandler = createRouteHandler({
  router: uploadRouter,
  config: {
    uploadthingId: process.env.UPLOADTHING_APP_ID,
    uploadthingSecret: process.env.UPLOADTHING_TOKEN,
  },
});

// Mount the uploadthing handler
app.use("/api/uploadthing", uploadthingHandler);

// OpenAI API endpoint (server-side to protect API key)
app.post(
  "/api/chat",
  rateLimitMiddleware(20, 60 * 1000), // 20 requests per minute
  express.json({ limit: "10mb" }),
  async (req, res) => {
    try {
      const { messages, userId } = req.body;

      // Validate input
      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: "Messages array is required" });
      }

      // Validate userId if provided
      if (userId && (typeof userId !== "string" || userId.length > 128)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      // Sanitize userId
      const sanitizedUserId = userId
        ? userId.replace(/[^a-zA-Z0-9_-]/g, "").substring(0, 128)
        : "anonymous";

      // Validate each message
      for (const msg of messages) {
        if (!msg.role || !msg.content) {
          return res.status(400).json({ error: "Invalid message format" });
        }
        if (typeof msg.content !== "string" || msg.content.length > 10000) {
          return res.status(400).json({ error: "Invalid message content" });
        }
      }

      // Import OpenAI dynamically (only on server)
      const { default: OpenAI } = await import("openai");
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY,
      });

      // Get AI content
      const aicontent = `You are GimmyAI, an AI learning companion designed to guide students toward understanding rather than providing direct answers, primarily using the Socratic Method.
Your mission is to foster academic persistence and critical thinking by helping students discover solutions through guided questioning and conceptual understanding.

# LEARNING-FOCUSED APPROACH (Socratic Method):
Your primary goal is to GUIDE students toward learning, not to give them quick answers. You should:
• ALWAYS use the Socratic Method. This means you will ask guiding questions to help students think through problems themselves.
• NEVER give direct answers without first asking guiding questions.
• Encourage students to attempt solutions before providing hints.
• Focus on understanding concepts rather than just getting the right answer.
• Praise effort and persistence over quick solutions.
• Help students break down complex problems into manageable steps.
• Suggest resources and study strategies.
• Celebrate learning milestones and progress.

# TOKEN OPTIMIZATION - CRITICAL FOR FREE SERVICE:
You MUST be concise and efficient with your responses to save tokens. This is a free service for students.

RESPONSE GUIDELINES:
• Keep responses under 300 words unless specifically asked for more detail.
• Focus on guiding questions and conceptual understanding.
• Use bullet points and lists when possible.
• ALWAYS start your response with 2-3 guiding questions. For example, "What do you think is the first step here?" or "What have you tried so far?"
• Encourage students to try solving problems themselves first.
• Provide hints and guidance rather than complete solutions.
• Celebrate effort and learning progress.
• Avoid giving direct answers without first asking guiding questions.

# MATH FORMATTING RULES:
When you need to display mathematical expressions, use LaTeX format:
• For inline math: wrap expressions in single dollar signs like $x^2 + 5 = 11$
• For block math: wrap expressions in double dollar signs like $$\\frac{a}{b} = c$$
• Always use proper LaTeX syntax for fractions, exponents, roots, etc.

IMPORTANT: Only wrap actual mathematical expressions in $...$ delimiters. Regular text should remain as plain text without any delimiters.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: aicontent,
          },
          ...messages,
        ],
        max_tokens: 1000,
        temperature: 0.7,
      });

      const aiResponse =
        response.choices?.[0]?.message?.content ||
        "Sorry, I couldn't generate a response.";

      res.json({ content: aiResponse });
    } catch (error) {
      console.error("OpenAI API error:", error);
      
      // Handle different error types
      let errorMessage = "An error occurred while processing your request.";
      let statusCode = 500;

      if (error.status === 401) {
        errorMessage = "Service authentication issue. Please try again later.";
        statusCode = 503;
      } else if (error.status === 429) {
        errorMessage = "Service is busy. Please wait a moment and try again.";
        statusCode = 429;
      } else if (error.status === 500 || error.status === 502 || error.status === 503) {
        errorMessage = "Service temporarily unavailable. Please try again in a few moments.";
        statusCode = 503;
      }

      res.status(statusCode).json({ error: errorMessage });
    }
  }
);

// Donation API Routes with rate limiting and validation
app.post(
  "/api/donate",
  rateLimitMiddleware(10, 60 * 1000), // 10 requests per minute
  validateDonationInput,
  async (req, res) => {
  try {
    const { amount, userId } = req.body;

    // Validate amount (minimum $5 USD = 500 cents)
    if (!amount || amount < 500) {
      return res.status(400).json({
        error: "Minimum donation amount is $5 USD",
      });
    }

    // Create Stripe Checkout session
    const session = await stripeInstance.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "GimmyAI Donation",
              description:
                "Thank you for supporting GimmyAI! Your donation helps keep this service free for students.",
            },
            unit_amount: amount, // amount in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.origin}/donation-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/donation-cancelled`,
      metadata: {
        userId: userId || "anonymous",
      },
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Donation error:", error);
    res.status(500).json({ error: "Failed to create donation session" });
  }
});

// Webhook handler for Stripe events with rate limiting
app.post(
  "/api/webhook",
  rateLimitMiddleware(100, 60 * 1000), // 100 requests per minute (webhooks can be bursty)
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripeInstance.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      try {
        // Store donation record in Firestore
        await addDoc(collection(db, "donations"), {
          uid: session.metadata.userId,
          donationAmount: session.amount_total / 100, // Convert cents to dollars
          currency: session.currency,
          stripeSessionId: session.id,
          timestamp: serverTimestamp(),
        });

        console.log("Donation recorded successfully:", session.id);
      } catch (error) {
        console.error("Error recording donation:", error);
      }
    }

    res.json({ received: true });
  }
);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// SPA Routing - Handle all non-API routes by serving index.html
// This ensures client-side routing works and prevents 404s for Google crawling
app.get("*", (req, res, next) => {
  // Skip API routes
  if (req.path.startsWith("/api")) {
    return next();
  }

  // Skip static files
  if (req.path.includes(".")) {
    return next();
  }

  // For production, serve the index.html file
  if (process.env.NODE_ENV === "production") {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  } else {
    // For development, let Vite handle it
    next();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`UploadThing endpoint: http://localhost:${PORT}/api/uploadthing`);
});
