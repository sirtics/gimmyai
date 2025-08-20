// SEO Optimization Utilities for GimmyAI

export const SEO_CONFIG = {
  // Primary keywords targeting "gimmy ai", "gimmyai", "jimmyai"
  PRIMARY_KEYWORDS: [
    "gimmy ai",
    "gimmyai",
    "jimmyai",
    "AI homework helper",
    "artificial intelligence homework help",
    "math solver",
    "science tutor",
    "homework assistance",
  ],

  // Secondary keywords for broader reach
  SECONDARY_KEYWORDS: [
    "AI tutor",
    "step-by-step solutions",
    "image upload homework help",
    "online homework help",
    "AI education",
    "smart homework app",
    "math help",
    "science help",
    "english help",
    "homework solver",
  ],

  // Long-tail keywords for specific searches
  LONG_TAIL_KEYWORDS: [
    "gimmy ai homework helper",
    "gimmyai math solver",
    "jimmyai science tutor",
    "AI homework help with image upload",
    "artificial intelligence math assistance",
    "online AI tutor for students",
    "smart homework helper app",
    "AI-powered step-by-step math solutions",
  ],

  // Meta descriptions for different pages
  META_DESCRIPTIONS: {
    home: "GimmyAI (Gimmy AI) is your intelligent homework helper. Upload images of math problems, get step-by-step solutions, and instant help with science, english, and all subjects. Try GimmyAI today!",
    signin:
      "Sign in to GimmyAI - Your AI-powered homework helper. Get instant help with math, science, english, and more.",
    signup:
      "Join GimmyAI - The smart AI homework helper. Upload images, get step-by-step solutions, and learn faster with artificial intelligence.",
    chat: "Chat with GimmyAI - Your personal AI tutor. Get instant homework help, upload images, and receive detailed explanations.",
    forgotPassword:
      "Reset your GimmyAI password. Get back to your AI homework helper quickly and securely.",
  },

  // Page titles for different routes
  PAGE_TITLES: {
    home: "GimmyAI - AI Homework Helper | Get Instant Help with Math, Science & More",
    signin: "Sign In - GimmyAI | AI Homework Helper",
    signup: "Sign Up - GimmyAI | AI Homework Helper",
    chat: "Chat with GimmyAI | AI Homework Helper",
    forgotPassword: "Reset Password - GimmyAI | AI Homework Helper",
  },
};

// Function to generate structured data for different page types
export const generateStructuredData = (
  pageType: string,
  additionalData?: any
) => {
  const baseData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "GimmyAI",
    alternateName: ["Gimmy AI", "JimmyAI"],
    description:
      "AI-powered homework helper that provides instant assistance with math, science, english, and other subjects.",
    url: "https://gimmyai.com",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Organization",
      name: "GimmyAI",
      url: "https://gimmyai.com",
    },
    creator: {
      "@type": "Person",
      name: "Girmachew Samson",
      email: "gimmys943@gmail.com",
    },
    featureList: [
      "AI-powered homework assistance",
      "Image upload for problem solving",
      "Step-by-step explanations",
      "Multi-subject support",
      "Real-time chat interface",
    ],
    screenshot: "https://gimmyai.com/favicon/android-chrome-512x512.png",
    softwareVersion: "1.0.0",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "150",
    },
  };

  switch (pageType) {
    case "home":
      return {
        ...baseData,
        mainEntity: {
          "@type": "WebPage",
          name: "GimmyAI - AI Homework Helper",
          description:
            "Get instant help with math, science, english, and more. Upload images of your problems for detailed explanations.",
          url: "https://gimmyai.com",
        },
      };
    case "chat":
      return {
        ...baseData,
        mainEntity: {
          "@type": "WebPage",
          name: "Chat with GimmyAI",
          description:
            "Interactive chat interface for AI-powered homework assistance.",
          url: "https://gimmyai.com/chat",
        },
      };
    default:
      return baseData;
  }
};

// Function to generate meta keywords string
export const generateMetaKeywords = (additionalKeywords: string[] = []) => {
  const allKeywords = [
    ...SEO_CONFIG.PRIMARY_KEYWORDS,
    ...SEO_CONFIG.SECONDARY_KEYWORDS,
    ...additionalKeywords,
  ];
  return allKeywords.join(", ");
};

// Function to generate page-specific SEO data
export const getPageSEOData = (pageType: string, customData?: any) => {
  const baseData = {
    title:
      SEO_CONFIG.PAGE_TITLES[pageType as keyof typeof SEO_CONFIG.PAGE_TITLES] ||
      SEO_CONFIG.PAGE_TITLES.home,
    description:
      SEO_CONFIG.META_DESCRIPTIONS[
        pageType as keyof typeof SEO_CONFIG.META_DESCRIPTIONS
      ] || SEO_CONFIG.META_DESCRIPTIONS.home,
    keywords: generateMetaKeywords(),
    url: `https://gimmyai.com${pageType === "home" ? "" : `/${pageType}`}`,
    image: "https://gimmyai.com/favicon/android-chrome-512x512.png",
    type: "website" as const,
    tags: [...SEO_CONFIG.PRIMARY_KEYWORDS, ...SEO_CONFIG.SECONDARY_KEYWORDS],
  };

  return { ...baseData, ...customData };
};

// Function to generate breadcrumb structured data
export const generateBreadcrumbData = (
  breadcrumbs: Array<{ name: string; url: string }>
) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
};

// Function to generate FAQ structured data
export const generateFAQData = (
  faqs: Array<{ question: string; answer: string }>
) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
};

// Common FAQ data for GimmyAI
export const GIMMYAI_FAQS = [
  {
    question: "What is GimmyAI?",
    answer:
      "GimmyAI is an AI-powered homework helper that provides instant assistance with math, science, english, and other subjects. You can upload images of problems and get detailed step-by-step solutions.",
  },
  {
    question: "How does GimmyAI work?",
    answer:
      "Simply upload an image of your homework problem or type your question. Our AI will analyze it and provide detailed explanations and step-by-step solutions to help you understand the concepts.",
  },
  {
    question: "Is GimmyAI free to use?",
    answer:
      "Yes, GimmyAI is currently free to use. You can sign up and start getting AI-powered homework help immediately.",
  },
  {
    question: "What subjects does GimmyAI support?",
    answer:
      "GimmyAI supports a wide range of subjects including mathematics, science, english, history, and more. Our AI can help with various topics and difficulty levels.",
  },
  {
    question: "Can I upload images of my homework problems?",
    answer:
      "Yes! You can upload images of your homework problems, equations, diagrams, or any other content you need help with. Our AI will analyze the image and provide detailed explanations.",
  },
];

// Performance optimization tips for SEO
export const SEO_PERFORMANCE_TIPS = {
  // Image optimization
  imageOptimization: {
    useWebP: true,
    lazyLoading: true,
    responsiveImages: true,
    altTextRequired: true,
  },

  // Content optimization
  contentOptimization: {
    minWordCount: 300,
    keywordDensity: 1.5, // percentage
    headingStructure: ["h1", "h2", "h3", "h4"],
    internalLinking: true,
  },

  // Technical SEO
  technicalSEO: {
    sitemapEnabled: true,
    robotsTxtEnabled: true,
    canonicalUrls: true,
    structuredData: true,
    mobileFriendly: true,
    fastLoading: true,
  },
};

// Export default configuration
export default SEO_CONFIG;
