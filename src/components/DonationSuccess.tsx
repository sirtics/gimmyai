import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const DonationSuccess: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-slate-800 rounded-lg p-8 max-w-md w-full text-center"
      >
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Thank You for Your Donation!
          </h1>
          <p className="text-slate-300">
            Your generous contribution helps keep GimmyAI free for students
            everywhere. Your support makes a real difference in making
            AI-powered homework help accessible to everyone.
          </p>
        </div>

        <div className="mb-6 p-4 bg-slate-700 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-2">
            What Your Donation Supports:
          </h3>
          <ul className="text-slate-300 text-sm space-y-1">
            <li>• Keeping GimmyAI free for students</li>
            <li>• Server costs and infrastructure</li>
            <li>• AI model improvements</li>
            <li>• New features and updates</li>
          </ul>
        </div>

        <div className="space-y-3">
          <Link
            to="/"
            className="block w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
          >
            Continue Using GimmyAI
          </Link>
          <Link
            to="/"
            className="block w-full py-3 px-4 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-medium transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default DonationSuccess;

