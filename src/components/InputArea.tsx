import React, { useRef, useEffect } from "react";
import { toast } from "sonner";
import { validateAndSanitizeMessage, MAX_MESSAGE_LENGTH } from "../utils/inputValidation";
import { canSendMessage } from "../utils/rateLimiter";

type InputAreaProps = {
  message: string;
  setMessage: (message: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  isInCooldown: boolean;
  cooldownRemaining: number;
  isLoading: boolean;
};

// Character limit constant (imported from validation utils)

const InputArea: React.FC<InputAreaProps> = ({
  message,
  setMessage,
  handleSubmit,
  handleKeyDown,
  isInCooldown,
  cooldownRemaining,
  isLoading,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [message]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;

    // Validate and sanitize input
    const validation = validateAndSanitizeMessage(newValue);
    
    if (validation.valid && validation.sanitized) {
      // Only allow changes if under character limit
      if (validation.sanitized.length <= MAX_MESSAGE_LENGTH) {
        setMessage(validation.sanitized);
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
          textareaRef.current.style.height =
            textareaRef.current.scrollHeight + "px";
        }
      } else {
        // Show error if exceeds limit
        toast.error(`Message cannot exceed ${MAX_MESSAGE_LENGTH} characters`);
      }
    } else if (validation.error) {
      // Show validation error
      toast.error(validation.error);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedText = e.clipboardData.getData("text");
    if (!textareaRef.current) return;

    // Validate and sanitize pasted text
    const validation = validateAndSanitizeMessage(pastedText);
    if (!validation.valid || !validation.sanitized) {
      e.preventDefault();
      if (validation.error) {
        toast.error(validation.error);
      }
      return;
    }

    const sanitizedPastedText = validation.sanitized;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const textBeforeSelection = message.substring(0, start);
    const textAfterSelection = message.substring(end);

    // Calculate new length after paste (replacing selection)
    const newLength = textBeforeSelection.length + sanitizedPastedText.length + textAfterSelection.length;

    // If the paste would exceed the character limit, paste only what fits
    if (newLength > MAX_MESSAGE_LENGTH) {
      e.preventDefault();
      const availableSpace = MAX_MESSAGE_LENGTH - (textBeforeSelection.length + textAfterSelection.length);
      
      if (availableSpace > 0) {
        // Paste as much as possible
        const partialText = sanitizedPastedText.substring(0, availableSpace);
        const newValue = textBeforeSelection + partialText + textAfterSelection;
        setMessage(newValue);
        
        // Set cursor position after pasted text and maintain focus
        setTimeout(() => {
          if (textareaRef.current) {
            const newCursorPos = textBeforeSelection.length + partialText.length;
            textareaRef.current.focus();
            textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height =
              textareaRef.current.scrollHeight + "px";
          }
        }, 0);
        
        const trimmedChars = sanitizedPastedText.length - availableSpace;
        toast.warning(
          `Pasted ${availableSpace} characters. ${trimmedChars} characters were trimmed to fit the ${MAX_MESSAGE_LENGTH} character limit.`,
          {
            duration: 4000,
          }
        );
      } else {
        // No space available
        toast.error(
          `Cannot paste: you've reached the ${MAX_MESSAGE_LENGTH} character limit. Please delete some text first.`,
          {
            duration: 4000,
          }
        );
      }
      return;
    }
    // If within limit, allow default paste behavior to proceed
    // The browser will handle the paste, then handleChange will update the state
  };

  const handleKeyDownLocal = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Prevent typing if at character limit (except for backspace, delete, etc.)
    if (
      message.length >= MAX_MESSAGE_LENGTH &&
      ![
        "Backspace",
        "Delete",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End",
      ].includes(e.key)
    ) {
      e.preventDefault();
      return;
    }

    // Call the original handleKeyDown
    handleKeyDown(e);
  };

  const isAtLimit = message.length >= MAX_MESSAGE_LENGTH;
  const characterCount = message.length;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDownLocal}
          onPaste={handlePaste}
          placeholder="Type your message... (Paste works here!)"
          rows={1}
          disabled={isLoading}
          className={`flex-1 resize-none rounded-md p-2 bg-slate-800 text-white border focus:outline-none max-h-40 min-h-[2.5rem] transition-colors ${
            isAtLimit
              ? "border-red-500 focus:border-red-500"
              : isLoading
              ? "border-slate-600 opacity-50 cursor-not-allowed"
              : "border-slate-600 focus:border-blue-500"
          }`}
          style={{ overflow: "auto" }}
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={isLoading || !message.trim()}
          className={`p-2 rounded-lg transition-colors ${
            isLoading || !message.trim()
              ? "bg-slate-700 text-slate-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Character Counter */}
      <div className="flex justify-between items-center text-sm">
        <div className="text-slate-400">
          {isInCooldown && (
            <span>Cooldown: {cooldownRemaining}s remaining</span>
          )}
          {isLoading && (
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              AI is thinking...
            </span>
          )}
        </div>
        <div
          className={`text-sm transition-colors ${
            isAtLimit
              ? "text-red-500 font-medium"
              : characterCount > MAX_MESSAGE_LENGTH * 0.9
              ? "text-yellow-400"
              : "text-slate-400"
          }`}
        >
          {characterCount}/{MAX_MESSAGE_LENGTH}
          {isAtLimit && (
            <span className="ml-2 text-xs">(Limit reached)</span>
          )}
        </div>
      </div>
    </form>
  );
};

export default InputArea;
