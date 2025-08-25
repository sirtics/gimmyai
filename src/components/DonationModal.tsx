import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DonationModal: React.FC<DonationModalProps> = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleDonate = async () => {
    if (!amount || parseFloat(amount) < 5) {
      toast.error("Minimum donation amount is $5 USD");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/donate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Math.round(parseFloat(amount) * 100), // Convert to cents
          userId: user?.uid || "anonymous",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create donation session");
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      console.error("Donation error:", error);
      toast.error("Failed to process donation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and decimal points
    if (/^\d*\.?\d{0,2}$/.test(value) || value === "") {
      setAmount(value);
    }
  };

  const isAmountValid = parseFloat(amount) >= 5;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Support GimmyAI</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <div className="mb-6">
          <p className="text-slate-300 mb-4">
            Your donation helps keep GimmyAI free for students. Every
            contribution makes a difference in making AI-powered homework help
            accessible to everyone.
          </p>

          <div className="mb-4">
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Donation Amount (USD)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                $
              </span>
              <input
                type="text"
                id="amount"
                value={amount}
                onChange={handleAmountChange}
                placeholder="5.00"
                className="w-full pl-8 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>
            {amount && !isAmountValid && (
              <p className="text-red-400 text-sm mt-1">
                Minimum donation amount is $5 USD
              </p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            {[5, 10, 25, 50, 100, 250].map((presetAmount) => (
              <button
                key={presetAmount}
                onClick={() => setAmount(presetAmount.toString())}
                className="py-2 px-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-white text-sm transition-colors"
              >
                ${presetAmount}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDonate}
            disabled={!isAmountValid || isLoading}
            className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-lg text-white transition-colors"
          >
            {isLoading ? "Processing..." : "Donate"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonationModal;

