import React from "react";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

interface MathRendererProps {
  content: string;
  className?: string;
}

const MathRenderer: React.FC<MathRendererProps> = ({
  content,
  className = "",
}) => {
  // Test function to verify MathRenderer is working
  const testMathRendering = () => {
    console.log("MathRenderer test:");
    console.log("Input:", "$x^2$");
    console.log("Should render as superscript");

    // Test various LaTeX expressions
    const testExpressions = [
      "$x^2$",
      "$\\int x^2 + 2x - 1 \\, dx$",
      "$\\frac{1}{2}$",
      "$\\sqrt{16}$",
      "$\\pi$",
    ];

    console.log("Testing LaTeX expressions:", testExpressions);
  };

  // Function to detect and convert common math expressions to LaTeX
  const convertMathExpressions = (text: string): string => {
    // DISABLED: Let the AI handle all math formatting
    // The AI should provide properly formatted LaTeX
    return text;
  };

  // Function to identify and wrap mathematical expressions inline
  const wrapMathExpressions = (text: string): string => {
    // DISABLED: No automatic math detection
    // The AI should format its responses with proper LaTeX delimiters
    return text;
  };

  // Function to split content into text and math parts
  const parseContent = (text: string): React.ReactNode[] => {
    // First, identify and wrap mathematical expressions
    const wrappedText = wrapMathExpressions(text);

    // Convert common math expressions to LaTeX
    const convertedText = convertMathExpressions(wrappedText);

    // Split by math delimiters
    const parts = convertedText.split(/(\$[^$]+\$|\$\$[^$]+\$\$)/);

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

      // Regular text
      return (
        <span key={index} className="whitespace-pre-wrap">
          {part}
        </span>
      );
    });
  };

  // Test on component mount
  React.useEffect(() => {
    testMathRendering();
  }, []);

  return (
    <div className={`${className} break-words overflow-wrap-anywhere`}>
      {parseContent(content)}
    </div>
  );
};

export default MathRenderer;
