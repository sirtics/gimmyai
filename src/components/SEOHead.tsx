import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "product";
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = "GimmyAI - AI Homework Helper | Get Instant Help with Math, Science & More",
  description = "GimmyAI (Gimmy AI) is your intelligent homework helper. Upload images of math problems, get step-by-step solutions, and instant help with science, english, and all subjects. Try GimmyAI today!",
  keywords = "gimmy ai, gimmyai, jimmyai, AI homework helper, artificial intelligence homework help, math solver, science tutor, homework assistance, AI tutor, step-by-step solutions, image upload homework help, online homework help, AI education, smart homework app",
  image = "https://gimmyai.com/favicon/android-chrome-512x512.png",
  url = "https://gimmyai.com",
  type = "website",
  author = "GimmyAI",
  publishedTime,
  modifiedTime,
  section,
  tags = [],
}) => {
  const fullUrl = url.startsWith("http") ? url : `https://gimmyai.com${url}`;
  const fullImageUrl = image.startsWith("http")
    ? image
    : `https://gimmyai.com${image}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />

      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:width" content="512" />
      <meta property="og:image:height" content="512" />
      <meta property="og:image:alt" content="GimmyAI - AI Homework Helper" />
      <meta property="og:site_name" content="GimmyAI" />
      <meta property="og:locale" content="en_US" />

      {publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {section && <meta property="article:section" content={section} />}
      {tags.length > 0 &&
        tags.map((tag, index) => (
          <meta key={index} property="article:tag" content={tag} />
        ))}

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullImageUrl} />
      <meta
        property="twitter:image:alt"
        content="GimmyAI - AI Homework Helper"
      />
      <meta property="twitter:creator" content="@gimmyai" />
      <meta property="twitter:site" content="@gimmyai" />

      {/* Additional SEO Meta Tags */}
      <meta
        name="robots"
        content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
      />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />

      {/* Structured Data for the specific page */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": type === "article" ? "Article" : "WebPage",
          name: title,
          description: description,
          url: fullUrl,
          image: fullImageUrl,
          author: {
            "@type": "Organization",
            name: "GimmyAI",
            url: "https://gimmyai.com",
          },
          publisher: {
            "@type": "Organization",
            name: "GimmyAI",
            logo: {
              "@type": "ImageObject",
              url: "https://gimmyai.com/favicon/android-chrome-512x512.png",
            },
          },
          mainEntity: {
            "@type": "WebApplication",
            name: "GimmyAI",
            alternateName: ["Gimmy AI", "JimmyAI"],
            description:
              "AI-powered homework helper that provides instant assistance with math, science, english, and other subjects.",
            applicationCategory: "EducationalApplication",
            operatingSystem: "Web Browser",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
          },
          ...(publishedTime && { datePublished: publishedTime }),
          ...(modifiedTime && { dateModified: modifiedTime }),
          ...(tags.length > 0 && { keywords: tags.join(", ") }),
        })}
      </script>
    </Helmet>
  );
};

export default SEOHead;
