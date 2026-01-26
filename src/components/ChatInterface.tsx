import { useState, useRef, useEffect, useCallback } from "react";
import { toast } from "sonner";

import { db } from "../firebase/config";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
  where,
  getDoc,
  getDocs,
} from "firebase/firestore";
import OpenAI from "openai";
import InputArea from "./InputArea";
import MathRenderer from "./MathRenderer";

import Navbar from "./Navbar";
import { aicontent } from "../aicontent";
import ConfirmationDialog from "./ConfirmationDialog";
import { useAuth } from "../contexts/AuthContext";
import {
  showErrorToast,
  showSuccessToast,
  handleOpenAIError,
} from "../utils/errorHandler";
import { validateAndSanitizeMessage } from "../utils/inputValidation";
import { canSendMessage, startRateLimitCleanup } from "../utils/rateLimiter";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

// Conversation limit constant
const MAX_CONVERSATIONS = 10;

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  imageUrl?: string;
  timestamp?: any;
};

type Conversation = {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
};

const Message = ({ msg }: { msg: Message }) => (
  <div
    className={`flex ${
      msg.role === "user" ? "justify-end" : "justify-start"
    } items-start gap-2`}
  >
    {msg.role === "assistant" && (
      <img
        src="/logo/gimmyai-transparentbg.png"
        alt="GimmyAI Logo"
        className="w-7 h-8 self-center"
      />
    )}
    <div
      className={`max-w-[80%] rounded-lg p-4 ${
        msg.role === "user"
          ? "bg-blue-600 text-white"
          : "bg-slate-800 text-slate-200"
      }`}
    >
      {msg.imageUrl && (
        <div className="mb-2">
          {msg.imageUrl.match(/\.(jpg|jpeg|png|gif)$/i) ? (
            <img
              src={msg.imageUrl}
              alt="Uploaded"
              className="max-w-[200px] max-h-32 object-contain rounded-lg"
            />
          ) : (
            <a
              href={msg.imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full max-w-[200px] h-32 bg-slate-600 rounded-lg items-center justify-center hover:bg-slate-500"
            >
              <span className="text-slate-300 flex items-center gap-2">
                {msg.imageUrl.includes("pdf") ? (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                        clipRule="evenodd"
                      />
                    </svg>
                    View PDF
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                        clipRule="evenodd"
                      />
                    </svg>
                    View Document
                  </>
                )}
              </span>
            </a>
          )}
        </div>
      )}
      {msg.role === "assistant" ? (
        <MathRenderer content={msg.content} />
      ) : (
        <div className="whitespace-pre-wrap break-words">{msg.content}</div>
      )}
    </div>
  </div>
);

const TypingIndicator = () => (
  <div className="flex items-center space-x-2 animate-pulse text-slate-400 px-4">
    <span className="w-2 h-2 bg-slate-400 rounded-full" />
    <span className="w-2 h-2 bg-slate-400 rounded-full" />
    <span className="w-2 h-2 bg-slate-400 rounded-full" />
    <span>GimmyAI is typing...</span>
  </div>
);

export default function ChatInterface() {
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showSidebar, setShowSidebar] = useState(window.innerWidth >= 768);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showTyping, setShowTyping] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [showLimitDialog, setShowLimitDialog] = useState(false);

  // Confirmation dialog state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<
    string | null
  >(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const { user, loading } = useAuth();

  // Load conversations when component mounts or user changes
  useEffect(() => {
    if (!user) {
      setConversations([]);
      return;
    }

    const conversationsRef = collection(db, "conversations");
    const q = query(
      conversationsRef,
      where("userId", "==", user.uid),
      orderBy("updatedAt", "desc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newConversations = snapshot.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title || "New Chat",
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      }));
      setConversations(newConversations);

      // Set current conversation to the most recent one if none is selected
      if (!currentConversationId && newConversations.length > 0) {
        setCurrentConversationId(newConversations[0].id);
      }
    });

    return () => unsubscribe();
  }, [user, currentConversationId]);

  // Start rate limit cleanup on mount
  useEffect(() => {
    const cleanup = startRateLimitCleanup(60000); // Cleanup every minute
    return cleanup;
  }, []);

  // Load messages for current conversation
  useEffect(() => {
    if (!currentConversationId) {
      // Only show welcome message if user has no conversations
      if (conversations.length === 0) {
        setMessages([
          {
            id: "initial",
            role: "assistant",
            content: "How may I help you today?",
          },
        ]);
      } else {
        setMessages([]);
      }
      return;
    }

    const messagesRef = collection(
      db,
      `conversations/${currentConversationId}/messages`,
    );
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const newMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          role: doc.data().role,
          content: doc.data().content,
          imageUrl: doc.data().imageUrl || undefined,
          timestamp: doc.data().timestamp,
        }));

        console.log(
          `Loading messages for conversation ${currentConversationId}:`,
          newMessages.length,
          "messages",
        );

        // Only show welcome message if there are no other messages
        if (newMessages.length === 0) {
          console.log("No messages found, showing welcome message");
          setMessages([
            {
              id: "initial",
              role: "assistant",
              content: "How may I help you today?",
            },
          ]);
        } else {
          console.log("Setting messages from Firestore:", newMessages);
          setMessages(newMessages);
        }
      },
      (error) => {
        showErrorToast(error, "firebase");
      },
    );

    return () => unsubscribe();
  }, [currentConversationId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, showTyping]);

  // Update conversation title after AI responds (not after user message)
  const updateConversationTitle = useCallback(
    async (conversationId: string, aiResponse: string) => {
      try {
        const conversationRef = doc(db, "conversations", conversationId);
        const title =
          aiResponse.slice(0, 22) + (aiResponse.length > 22 ? "..." : "");
        await updateDoc(conversationRef, {
          title,
          updatedAt: serverTimestamp(),
        });
      } catch (error) {
        console.error("Error updating conversation title:", error);
      }
    },
    [],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!user) return;
      if (!message.trim()) return;
      if (isLoading || isSubmitting) return;

      // Validate and sanitize message
      const validation = validateAndSanitizeMessage(message);
      if (!validation.valid || !validation.sanitized) {
        if (validation.error) {
          toast.error(validation.error);
        }
        return;
      }

      // Check rate limiting
      const rateLimitCheck = canSendMessage(user.uid);
      if (!rateLimitCheck.allowed) {
        const secondsUntilReset = Math.ceil(
          (rateLimitCheck.resetTime - Date.now()) / 1000,
        );
        toast.error(
          rateLimitCheck.error ||
            `Rate limit exceeded. Please wait ${secondsUntilReset} seconds before sending another message.`,
          {
            duration: 6000,
          },
        );
        return;
      }

      try {
        setIsLoading(true);
        setIsSubmitting(true);

        // Use sanitized message
        const sanitizedMessage = validation.sanitized;

        let conversationId = currentConversationId;
        if (!conversationId) {
          // Check conversation limit before creating new one
          if (conversations.length >= MAX_CONVERSATIONS) {
            setIsLoading(false);
            setIsSubmitting(false);
            setShowLimitDialog(true);
            return;
          }

          const newConversationRef = await addDoc(
            collection(db, "conversations"),
            {
              userId: user.uid,
              title: "New Chat",
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            },
          );
          conversationId = newConversationRef.id;
          setCurrentConversationId(conversationId);
        } else {
          // Verify the conversation belongs to the current user
          try {
            const conversationDoc = await getDoc(
              doc(db, "conversations", conversationId),
            );
            if (
              !conversationDoc.exists() ||
              conversationDoc.data().userId !== user.uid
            ) {
              // Check conversation limit before creating new one
              if (conversations.length >= MAX_CONVERSATIONS) {
                setIsLoading(false);
                setIsSubmitting(false);
                setShowLimitDialog(true);
                return;
              }

              const newConversationRef = await addDoc(
                collection(db, "conversations"),
                {
                  userId: user.uid,
                  title: "New Chat",
                  createdAt: serverTimestamp(),
                  updatedAt: serverTimestamp(),
                },
              );
              conversationId = newConversationRef.id;
              setCurrentConversationId(conversationId);
            }
          } catch (error) {
            showErrorToast(error, "firebase");
            // Check conversation limit before creating new one
            if (conversations.length >= MAX_CONVERSATIONS) {
              setIsLoading(false);
              setIsSubmitting(false);
              setShowLimitDialog(true);
              return;
            }

            const newConversationRef = await addDoc(
              collection(db, "conversations"),
              {
                userId: user.uid,
                title: "New Chat",
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
              },
            );
            conversationId = newConversationRef.id;
            setCurrentConversationId(conversationId);
          }
        }

        const newMessage: Message = {
          id: Date.now().toString(),
          role: "user",
          content: sanitizedMessage,
        };

        await addDoc(
          collection(db, `conversations/${conversationId}/messages`),
          {
            ...newMessage,
            timestamp: serverTimestamp(),
          },
        );

        setMessage("");

        // Wait a moment for the conversation to be set and messages to load
        await new Promise((resolve) => setTimeout(resolve, 100));

        setShowTyping(true);

        // Get the current messages from the conversation (including the one we just added)
        const messagesRef = collection(
          db,
          `conversations/${conversationId}/messages`,
        );
        const messagesQuery = query(messagesRef, orderBy("timestamp", "asc"));
        const messagesSnapshot = await getDocs(messagesQuery);
        const currentMessages = messagesSnapshot.docs.map((doc) => ({
          role: doc.data().role,
          content: doc.data().content,
        }));

        console.log(
          `Sending ${currentMessages.length} messages to AI for conversation ${conversationId}`,
        );
        console.log("Messages:", currentMessages);

        const response = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: aicontent,
            },
            ...currentMessages,
          ],
        });

        console.log("OpenAI response:", response);

        const aiResponse =
          response.choices?.[0]?.message?.content ||
          "Sorry, I couldn't generate a response.";
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: aiResponse,
        };

        await addDoc(
          collection(db, `conversations/${conversationId}/messages`),
          {
            ...aiMessage,
            timestamp: serverTimestamp(),
          },
        );

        // Update conversation title after AI responds
        await updateConversationTitle(conversationId, aiResponse);

        setShowTyping(false);
      } catch (error: any) {
        setShowTyping(false);

        // Get the error message and display it in chat
        const errorMessage = handleOpenAIError(error);

        // Add error message as a system message in the chat
        const errorChatMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `Error: ${errorMessage}`,
        };

        try {
          if (currentConversationId) {
            await addDoc(
              collection(db, `conversations/${currentConversationId}/messages`),
              {
                ...errorChatMessage,
                timestamp: serverTimestamp(),
              },
            );
          } else {
            // If no conversation ID, just add to local messages
            setMessages((prev) => [...prev, errorChatMessage]);
          }
        } catch (dbError) {
          // If database save fails, just add to local messages
          setMessages((prev) => [...prev, errorChatMessage]);
        }

        // Still show toast as backup (but less noisy)
        showErrorToast(error, "openai");
      } finally {
        setIsLoading(false);
        setIsSubmitting(false);
      }
    },
    [
      user,
      message,
      isLoading,
      isSubmitting,
      currentConversationId,
      messages,
      conversations.length,
      updateConversationTitle,
    ],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        void handleSubmit(e);
      }
    },
    [handleSubmit],
  );

  const handleFormSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!message.trim()) return;
      if (isLoading || isSubmitting) return;
      void handleSubmit(e);
    },
    [message, isLoading, isSubmitting, handleSubmit],
  );

  const handleNewChat = async () => {
    if (!user) return;

    // Check conversation limit
    if (conversations.length >= MAX_CONVERSATIONS) {
      setShowLimitDialog(true);
      return;
    }

    try {
      const newConversationRef = await addDoc(collection(db, "conversations"), {
        userId: user.uid,
        title: "New Chat",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setCurrentConversationId(newConversationRef.id);
      setMessages([
        {
          id: "initial",
          role: "assistant",
          content: "How may I help you today?",
        },
      ]);
      if (window.innerWidth < 768) {
        setShowSidebar(false);
      }
    } catch (error) {
      showErrorToast(error, "firebase");
    }
  };

  const handleDeleteConversation = async (
    conversationId: string,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation(); // Prevent triggering the conversation selection

    // Set the conversation to delete and show the dialog
    setConversationToDelete(conversationId);
    setShowDeleteDialog(true);
  };

  const confirmDeleteConversation = async () => {
    if (!conversationToDelete) return;

    try {
      // Delete the conversation from Firebase
      await deleteDoc(doc(db, "conversations", conversationToDelete));

      // If the deleted conversation was the current one, switch to the most recent conversation
      if (conversationToDelete === currentConversationId) {
        const remainingConversations = conversations.filter(
          (c) => c.id !== conversationToDelete,
        );
        if (remainingConversations.length > 0) {
          setCurrentConversationId(remainingConversations[0].id);
        } else {
          setCurrentConversationId(null);
          setMessages([
            {
              id: "initial",
              role: "assistant",
              content: "How may I help you today?",
            },
          ]);
        }
      }
    } catch (error) {
      showErrorToast(error, "firebase");
    } finally {
      // Reset dialog state
      setShowDeleteDialog(false);
      setConversationToDelete(null);
    }
  };

  // Handle window resize to auto-show sidebar on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowSidebar(true);
      } else {
        setShowSidebar(false);
      }
    };
    window.addEventListener("resize", handleResize);
    // Run once on mount
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Navbar with sidebar toggle */}
      <div className="fixed top-0 left-0 right-0 z-40">
        <Navbar onSidebarToggle={() => setShowSidebar((s) => !s)} />
      </div>

      {/* Sidebar - Fixed position */}
      {/* Mobile sidebar overlay and backdrop */}
      {showSidebar && window.innerWidth < 768 && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-40"
          onClick={() => setShowSidebar(false)}
        />
      )}

      <div
        ref={sidebarRef}
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] z-50 w-64 bg-slate-800 border-r border-slate-700 transition-transform duration-200 ease-in-out flex flex-col
          ${
            showSidebar || window.innerWidth >= 768
              ? "translate-x-0"
              : "-translate-x-full"
          }
          md:translate-x-0`}
      >
        {/* New Chat Button */}
        <div className="p-4 border-b border-slate-700 flex-shrink-0">
          <button
            onClick={handleNewChat}
            disabled={conversations.length >= MAX_CONVERSATIONS}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              conversations.length >= MAX_CONVERSATIONS
                ? "bg-slate-600 text-slate-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Chat
          </button>
        </div>

        {/* Conversations List - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-slate-400">
              <svg
                className="w-12 h-12 mx-auto mb-2 text-slate-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              <p className="text-sm">No conversations yet</p>
              <p className="text-xs mt-1 text-slate-500">
                Start a new chat to begin!
              </p>
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                className={`group relative border-b border-slate-700 ${
                  currentConversationId === conv.id ? "bg-slate-700" : ""
                }`}
              >
                <button
                  onClick={() => setCurrentConversationId(conv.id)}
                  className="w-full text-left p-4 hover:bg-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{conv.title}</div>
                      <div className="text-sm text-slate-400 truncate">
                        {new Date(conv.updatedAt).toLocaleString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                </button>
                <button
                  onClick={(e) => handleDeleteConversation(conv.id, e)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete conversation"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Conversation Counter - Fixed at bottom */}
        <div className="p-4 border-t border-slate-700 flex-shrink-0">
          <div
            className={`text-sm text-center ${
              conversations.length >= MAX_CONVERSATIONS
                ? "text-red-400 font-medium"
                : "text-slate-400"
            }`}
          >
            {conversations.length}/{MAX_CONVERSATIONS} conversations
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 ml-0 md:ml-64 h-full pt-16 relative">
        <div
          ref={chatContainerRef}
          className="overflow-y-auto px-4 py-6 space-y-4"
          style={{
            height: "calc(100vh - 4rem - 5.5rem)", // viewport height minus navbar (4rem) minus input area (5.5rem for spacing)
          }}
        >
          {messages.length === 0 && !showTyping && !currentConversationId ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <img
                src="/logo/gimmyai-transparentbg.png"
                alt="GimmyAI Logo"
                className="w-24 h-24 mb-4 opacity-50"
              />
              <h2 className="text-2xl font-bold text-slate-300 mb-2">
                Welcome to GimmyAI!
              </h2>
              <p className="text-slate-400 max-w-md">
                I'm here to help you learn using the Socratic Method. Instead of
                giving you direct answers, I'll ask guiding questions to help
                you discover solutions yourself.
              </p>
              <p className="text-slate-500 text-sm mt-4">
                Start by typing a question or uploading an image of your
                problem.
              </p>
            </div>
          ) : (
            messages.map((msg) => <Message key={msg.id} msg={msg} />)
          )}
          {showTyping && (
            <div className="flex items-center space-x-2 text-slate-400 px-4">
              <div className="flex space-x-1">
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
              <span>GimmyAI is thinking...</span>
            </div>
          )}
        </div>

        {/* InputArea fixed at the bottom */}
        <div
          className={`fixed bottom-0 left-0 right-0 z-30 bg-slate-900 border-t border-slate-700 md:left-64`}
        >
          <div className="p-3">
            <InputArea
              message={message}
              setMessage={setMessage}
              handleSubmit={handleFormSubmit}
              handleKeyDown={handleKeyDown}
              isInCooldown={false}
              cooldownRemaining={0}
              isLoading={isLoading || isSubmitting}
            />
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setConversationToDelete(null);
        }}
        onConfirm={confirmDeleteConversation}
        title="Delete Conversation"
        message="Are you sure you want to delete this conversation? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />

      {/* Conversation Limit Dialog */}
      <ConfirmationDialog
        isOpen={showLimitDialog}
        onClose={() => setShowLimitDialog(false)}
        onConfirm={() => setShowLimitDialog(false)}
        title="Conversation Limit Reached"
        message={`You've reached the maximum limit of ${MAX_CONVERSATIONS} conversations. Please delete an existing conversation to create a new one.`}
        confirmText="OK"
        cancelText=""
      />
    </div>
  );
}
