import React from "react";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import ReactMarkdown from "react-markdown";

interface MathRendererProps {
  content: string;
  className?: string;
}

const MathRenderer: React.FC<MathRendererProps> = ({
  content,
  className = "",
}) => {
  // Function to preprocess content to fix list formatting issues
  const preprocessContent = (text: string): string => {
    // Debug: Log the original content to see what we're dealing with
    console.log("Original content:", JSON.stringify(text));

    // Fix common list formatting issues
    // Replace patterns like "1.\nContent" with "1. Content"
    const processed = text
      .replace(/(\d+\.)\s*\n\s*/g, "$1 ") // Fix numbered lists with line breaks
      .replace(/(\d+\.)\s*\r\s*/g, "$1 ") // Fix numbered lists with carriage returns
      .replace(/(\d+\.)\s*\r\n\s*/g, "$1 "); // Fix numbered lists with Windows line breaks

    // Debug: Log the processed content
    console.log("Processed content:", JSON.stringify(processed));

    return processed;
  };

  // Function to split content into text and math parts
  const parseContent = (text: string): React.ReactNode[] => {
    // Preprocess the content first
    const processedText = preprocessContent(text);

    // Split by math delimiters first
    const parts = processedText.split(/(\$[^$]+\$|\$\$[^$]+\$\$)/);

    return parts.map((part, index) => {
      // Inline math: $...$
      if (part.startsWith("$") && part.endsWith("$") && part.length > 2) {
        const mathContent = part.slice(1, -1);
        try {
          return <InlineMath key={index} math={mathContent} />;
        } catch (error) {
          // If LaTeX parsing fails, return the original text
          console.warn("LaTeX parsing error:", error);
          return (
            <span key={index} className="whitespace-pre-wrap">
              {part.slice(1, -1)}
            </span>
          );
        }
      }

      // Block math: $$...$$
      if (part.startsWith("$$") && part.endsWith("$$") && part.length > 4) {
        const mathContent = part.slice(2, -2);
        try {
          return (
            <div key={index} className="my-4">
              <BlockMath math={mathContent} />
            </div>
          );
        } catch (error) {
          // If LaTeX parsing fails, return the original text
          console.warn("LaTeX parsing error:", error);
          return (
            <div key={index} className="my-4 whitespace-pre-wrap">
              {part.slice(2, -2)}
            </div>
          );
        }
      }

      // Regular text - render with markdown
      return (
        <div key={index}>
          <ReactMarkdown
            components={{
              // Customize markdown components
              p: ({ children }) => <div className="mb-2">{children}</div>,
              strong: ({ children }) => (
                <strong className="font-bold text-white">{children}</strong>
              ),
              em: ({ children }) => (
                <em className="italic text-slate-300">{children}</em>
              ),
              code: ({ children }) => (
                <code className="bg-slate-700 px-1 py-0.5 rounded text-sm font-mono">
                  {children}
                </code>
              ),
              pre: ({ children }) => (
                <pre className="bg-slate-800 p-2 rounded text-sm font-mono overflow-x-auto">
                  {children}
                </pre>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside space-y-2 ml-4 mb-2">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside space-y-2 ml-4 mb-2">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="text-slate-300 leading-relaxed">{children}</li>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-blue-500 pl-4 italic text-slate-300 mb-2">
                  {children}
                </blockquote>
              ),
            }}
          >
            {part}
          </ReactMarkdown>
        </div>
      );
    });
  };

  return (
    <div className={`${className} break-words overflow-wrap-anywhere`}>
      {parseContent(content)}
    </div>
  );
};

export default MathRenderer;
