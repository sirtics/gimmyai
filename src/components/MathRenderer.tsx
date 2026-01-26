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
  // Function to convert common math expressions to LaTeX
  const convertMathExpressions = (text: string): string => {
    return (
      text
        // Only convert expressions that are clearly mathematical
        // Basic math operations (only when they look like math)
        .replace(/\b([a-zA-Z])\^(\d+)\b/g, "$$1^{$2}") // x^2 -> x^{2} (variables with exponents)
        .replace(/\b([a-zA-Z])\^([a-zA-Z])\b/g, "$$1^{$2}") // x^y -> x^{y} (variables with variable exponents)

        // Square roots (only when they look like function calls)
        .replace(/\bsqrt\(([^)]+)\)/g, "$\\sqrt{$1}") // sqrt(16) -> \sqrt{16}

        // Fractions (only simple numeric fractions)
        .replace(/\b(\d+)\/(\d+)\b/g, "$\\frac{$1}{$2}") // 1/2 -> \frac{1}{2}

        // Greek letters (only in mathematical contexts)
        .replace(/\bpi\b/g, "$\\pi") // pi -> \pi
        .replace(/\btheta\b/g, "$\\theta") // theta -> \theta
        .replace(/\balpha\b/g, "$\\alpha") // alpha -> \alpha
        .replace(/\bbeta\b/g, "$\\beta") // beta -> \beta
        .replace(/\bgamma\b/g, "$\\gamma") // gamma -> \gamma
        .replace(/\bdelta\b/g, "$\\delta") // delta -> \delta
        .replace(/\bepsilon\b/g, "$\\epsilon") // epsilon -> \epsilon
        .replace(/\bzeta\b/g, "$\\zeta") // zeta -> \zeta
        .replace(/\beta\b/g, "$\\eta") // eta -> \eta
        .replace(/\biota\b/g, "$\\iota") // iota -> \iota
        .replace(/\bkappa\b/g, "$\\kappa") // kappa -> \kappa
        .replace(/\blambda\b/g, "$\\lambda") // lambda -> \lambda
        .replace(/\bmu\b/g, "$\\mu") // mu -> \mu
        .replace(/\bnu\b/g, "$\\nu") // nu -> \nu
        .replace(/\bxi\b/g, "$\\xi") // xi -> \xi
        .replace(/\bomicron\b/g, "$\\omicron") // omicron -> \omicron
        .replace(/\brho\b/g, "$\\rho") // rho -> \rho
        .replace(/\bsigma\b/g, "$\\sigma") // sigma -> \sigma
        .replace(/\btau\b/g, "$\\tau") // tau -> \tau
        .replace(/\bupsilon\b/g, "$\\upsilon") // upsilon -> \upsilon
        .replace(/\bphi\b/g, "$\\phi") // phi -> \phi
        .replace(/\bchi\b/g, "$\\chi") // chi -> \chi
        .replace(/\bpsi\b/g, "$\\psi") // psi -> \psi
        .replace(/\bomega\b/g, "$\\omega") // omega -> \omega

        // Mathematical symbols (only when they appear as operators)
        .replace(/\b<=/g, "$\\leq") // <= -> \leq
        .replace(/\b>=/g, "$\\geq") // >= -> \geq
        .replace(/\b!=/g, "$\\neq") // != -> \neq
        .replace(/\b≈/g, "$\\approx") // ≈ -> \approx
        .replace(/\b±/g, "$\\pm") // ± -> \pm
        .replace(/\b∫/g, "$\\int") // ∫ -> \int
        .replace(/\b∑/g, "$\\sum") // ∑ -> \sum
        .replace(/\b∏/g, "$\\prod") // ∏ -> \prod
        .replace(/\binfinity\b/g, "$\\infty") // infinity -> \infty

        // Trigonometric functions (only when they look like function calls)
        .replace(/\bsin\(/g, "$\\sin(") // sin( -> \sin(
        .replace(/\bcos\(/g, "$\\cos(") // cos( -> \cos(
        .replace(/\btan\(/g, "$\\tan(") // tan( -> \tan(
        .replace(/\bcsc\(/g, "$\\csc(") // csc( -> \csc(
        .replace(/\bsec\(/g, "$\\sec(") // sec( -> \sec(
        .replace(/\bcot\(/g, "$\\cot(") // cot( -> \cot(

        // Logarithms (only when they look like function calls)
        .replace(/\blog\(/g, "$\\log(") // log( -> \log(
        .replace(/\bln\(/g, "$\\ln(") // ln( -> \ln(

        // Subscripts (only when they look like mathematical notation)
        .replace(/\b([a-zA-Z])_(\d+)\b/g, "$$1_{$2}") // x_1 -> x_{1}
        .replace(/\b([a-zA-Z])_([a-zA-Z])\b/g, "$$1_{$2}") // x_y -> x_{y}

        // Degrees (only when they appear with numbers)
        .replace(/(\d+)°/g, "$$1^{\\circ}") // 90° -> 90^{\circ}

        // Fix double LaTeX delimiters that might be created
        .replace(/\$\$\//g, "$\\") // Fix double $ before LaTeX commands
        .replace(/\\\$\$/g, "\\$") // Fix double $ after LaTeX commands

        // Clean up any remaining issues
        .replace(/\$\s*\$/g, "") // Remove empty LaTeX delimiters
        .trim()
    );
  };

  // Function to preprocess content to fix formatting issues
  const preprocessContent = (text: string): string => {
    return text.trim();
  };

  // Function to safely render LaTeX math
  const renderMath = (
    mathContent: string,
    isBlock: boolean = false
  ): React.ReactNode => {
    try {
      if (isBlock) {
        return (
          <div className="my-4 overflow-x-auto">
            <div className="text-center">
              <BlockMath math={mathContent} />
            </div>
          </div>
        );
      } else {
        // Inline math - make it seamless with text
        return (
          <span className="inline-block align-middle">
            <InlineMath math={mathContent} />
          </span>
        );
      }
    } catch (error) {
      // If LaTeX parsing fails, return the original text with styling
      console.warn("LaTeX parsing error:", error);
      if (isBlock) {
        return (
          <div className="my-4 p-3 bg-slate-800 rounded border border-slate-700">
            <div className="font-mono text-center text-red-300">
              {mathContent}
            </div>
          </div>
        );
      } else {
        return (
          <span className="font-mono text-red-300 bg-slate-700 px-1 rounded">
            {mathContent}
          </span>
        );
      }
    }
  };

  // Function to split content into text and math parts
  const parseContent = (text: string): React.ReactNode[] => {
    // Preprocess the content first
    const processedText = preprocessContent(text);

    // Split by math delimiters - handle both inline ($...$) and block ($$...$$)
    // Use a regex that properly captures math expressions
    const parts = processedText.split(/(\$\$[^$]+\$\$|\$[^$\n]+\$)/);

    return parts
      .map((part, index) => {
        // Block math: $$...$$
        if (part.startsWith("$$") && part.endsWith("$$") && part.length > 4) {
          const mathContent = part.slice(2, -2).trim();
          return <div key={index}>{renderMath(mathContent, true)}</div>;
        }

        // Inline math: $...$ (but not block math)
        if (
          part.startsWith("$") &&
          part.endsWith("$") &&
          part.length > 2 &&
          !part.startsWith("$$")
        ) {
          const mathContent = part.slice(1, -1).trim();
          return <span key={index}>{renderMath(mathContent, false)}</span>;
        }

        // Regular text - render with markdown
        if (part.trim()) {
          return (
            <span key={index} className="inline">
              <ReactMarkdown
                components={{
                  // Customize markdown components for seamless rendering
                  p: ({ children }) => (
                    <span className="block mb-2 leading-relaxed">{children}</span>
                  ),
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
                    <pre className="bg-slate-800 p-2 rounded text-sm font-mono overflow-x-auto block my-2">
                      {children}
                    </pre>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside space-y-1 ml-4 mb-3 block">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside space-y-1 ml-4 mb-3 block">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-slate-300 leading-relaxed mb-1">
                      {children}
                    </li>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-blue-500 pl-4 italic text-slate-300 mb-2 block">
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {part}
              </ReactMarkdown>
            </span>
          );
        }

        // Return null for empty parts
        return null;
      })
      .filter(Boolean); // Remove null values
  };

  return (
    <div className={`${className} break-words overflow-wrap-anywhere`}>
      {parseContent(content)}
    </div>
  );
};

export default MathRenderer;
