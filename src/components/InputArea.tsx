import React, { useRef, useEffect } from "react";
import { toast } from "sonner";

type InputAreaProps = {
  message: string;
  setMessage: (message: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  isInCooldown: boolean;
  cooldownRemaining: number;
  isLoading: boolean;
};

// Character limit constant
const MAX_CHARACTERS = 1000;

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

    // Only allow changes if under character limit
    if (newValue.length <= MAX_CHARACTERS) {
      setMessage(newValue);
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height =
          textareaRef.current.scrollHeight + "px";
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedText = e.clipboardData.getData("text");
    const currentLength = message.length;
    const totalLength = currentLength + pastedText.length;

    // If the paste would exceed the character limit, show an alert
    if (totalLength > MAX_CHARACTERS) {
      e.preventDefault();
      const excessChars = totalLength - MAX_CHARACTERS;
      toast.error(
        `Text too long! The pasted content exceeds the character limit by ${excessChars} characters. Please shorten your text or paste it in smaller chunks.`,
        {
          duration: 5000,
          style: {
            background: "#ef4444",
            color: "white",
            border: "1px solid #dc2626",
          },
        }
      );
      return;
    }
  };

  const handleKeyDownLocal = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Prevent typing if at character limit (except for backspace, delete, etc.)
    if (
      message.length >= MAX_CHARACTERS &&
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

  const isAtLimit = message.length >= MAX_CHARACTERS;
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
          placeholder="Type your message..."
          rows={1}
          className={`flex-1 resize-none rounded-md p-2 bg-slate-800 text-white border focus:outline-none max-h-40 min-h-[2.5rem] ${
            isAtLimit
              ? "border-red-500 focus:border-red-500"
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
        </div>
        <div
          className={`text-sm ${
            isAtLimit ? "text-red-500 font-medium" : "text-slate-400"
          }`}
        >
          {characterCount}/{MAX_CHARACTERS}
        </div>
      </div>
    </form>
  );
};

export default InputArea;
