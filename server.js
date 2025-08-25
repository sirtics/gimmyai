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

// Enable CORS for your Vite app
app.use(
  cors({
    origin: "http://localhost:5173", // Your Vite app's URL
    credentials: true,
  })
);

app.use(express.json());

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

// Donation API Routes
app.post("/api/donate", async (req, res) => {
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

// Webhook handler for Stripe events
app.post(
  "/api/webhook",
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
