import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const DonationCancelled: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-slate-800 rounded-lg p-8 max-w-md w-full text-center"
      >
        <div className="mb-6">
          <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
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
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Donation Cancelled
          </h1>
          <p className="text-slate-300">
            No worries! Your donation was cancelled. You can still use GimmyAI
            completely free. If you change your mind, you can always donate
            later to help support the service.
          </p>
        </div>

        <div className="mb-6 p-4 bg-slate-700 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-2">
            GimmyAI Remains Free:
          </h3>
          <ul className="text-slate-300 text-sm space-y-1">
            <li>• All features are still available</li>
            <li>• No limitations on usage</li>
            <li>• Continue getting AI homework help</li>
            <li>• Donate anytime you want to support</li>
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

export default DonationCancelled;

