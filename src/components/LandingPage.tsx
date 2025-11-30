import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import SEOHead from "./SEOHead";
import Navbar from "./Navbar";

export default function LandingPage() {
  const { user } = useAuth();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <SEOHead
        title="GimmyAI - AI Learning Companion | Guided Help with Math, Science & More"
        description="GimmyAI uses the Socratic Method to help you learn. Instead of giving answers, it asks thoughtful questions that guide you to discover solutions yourself. Build deeper understanding through guided inquiry. Try GimmyAI today!"
        keywords="gimmy ai, gimmyai, jimmyai, AI learning companion, guided learning, academic persistence, critical thinking, learning guidance, concept building, AI tutor, educational support, learning strategies, study guidance, AI education"
        url="https://gimmyai.com"
        tags={[
          "gimmy ai",
          "gimmyai",
          "jimmyai",
          "AI learning companion",
          "guided learning",
          "academic persistence",
          "learning guidance",
        ]}
      />
      <div className="min-h-screen bg-slate-900 text-white">
        <Navbar />
        {/* Hero Section */}
        <div className="relative min-h-[90vh] flex flex-col items-center justify-center p-8">
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-purple-500/10" />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
          </motion.div>

          {/* Floating elements */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center relative z-10"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-8"
            >
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-5xl md:text-7xl font-bold text-center mb-6 leading-tight"
              >
                <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-blue-400 bg-clip-text text-transparent bg-size-200 animate-gradient pb-2">
                  GimmyAI
                </span>
              </motion.h1>
              <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              Your AI learning companion that uses the Socratic Method. Instead of giving you answers, 
              GimmyAI asks thoughtful questions to help you discover solutions yourself.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-lg md:text-xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Get guided help with math, science, english, and more. Upload images of your problems 
              and learn through discovery, not shortcuts.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="relative"
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
            >
              {user ? (
                <Link
                  to="/chat"
                  className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg text-lg font-medium shadow-lg shadow-blue-500/20 transition-all duration-300 hover:scale-105"
                >
                  Start Chatting
                </Link>
              ) : (
                <div className="space-y-4">
                  <Link
                    to="/signup"
                    className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg text-lg font-medium shadow-lg shadow-blue-500/20 transition-all duration-300 hover:scale-105"
                  >
                    Get Started
                  </Link>
                  <p className="text-slate-400">
                    Already have an account?{" "}
                    <Link
                      to="/signin"
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Sign In
                    </Link>
                  </p>
                </div>
              )}
            </motion.div>

            {/* Feature highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-400"
            >
              <div className="flex items-center justify-center space-x-2">
                <span className="text-blue-400">✓</span>
                <span>Socratic Method</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-blue-400">✓</span>
                <span>24/7 Available</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-blue-400">✓</span>
                <span>Learn by Discovery</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-blue-400">✓</span>
                <span>File Upload</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Why Choose GimmyAI Section */}
        <section className="py-20 px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-800/50" />
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-400 bg-clip-text text-transparent bg-size-200 animate-gradient leading-tight pb-2 -mt-4">
              Why Choose GimmyAI
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="p-8 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300"
              >
                <div className="text-5xl mb-6 transform hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-12 h-12 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Socratic Method
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  GimmyAI asks thoughtful questions instead of giving direct answers, 
                  helping you discover solutions yourself through guided inquiry
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="p-8 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300"
              >
                <div className="text-5xl mb-6 transform hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-12 h-12 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  File Uploads
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  Upload images, PDFs, and documents for comprehensive analysis
                  and detailed explanations
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="p-8 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300"
              >
                <div className="text-5xl mb-6 transform hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-12 h-12 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Real-time Chat
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  Interactive conversations where GimmyAI asks questions to guide 
                  your thinking, helping you discover answers through dialogue
                </p>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* See it in Action Section */}
        <section className="py-20 px-8 bg-slate-800/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-800/30 to-slate-900/30" />
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-400 bg-clip-text text-transparent bg-size-200 animate-gradient">
              See it in Action
            </h2>
            <div className="max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-8 shadow-xl"
              >
                <div className="flex items-start space-x-4">
                  <img
                    src="/logo/gimmyai-transparentbg.png"
                    alt="GimmyAI Logo"
                    className="w-10 h-10"
                  />
                  <div className="flex-1">
                    <p className="text-slate-300 leading-relaxed">
                      Let me help you solve this quadratic equation step by
                      step:
                      <br />
                      <br />
                      <span className="text-blue-400">1.</span> First, let's
                      identify the coefficients: a=2, b=-5, c=3
                      <br />
                      <span className="text-blue-400">2.</span> Using the
                      quadratic formula: x = (-b ± √(b² - 4ac)) / 2a
                      <br />
                      <span className="text-blue-400">3.</span> Plugging in the
                      values: x = (5 ± √(25 - 24)) / 4
                      <br />
                      <span className="text-blue-400">4.</span> Simplifying: x =
                      (5 ± 1) / 4
                      <br />
                      <span className="text-blue-400">5.</span> Therefore, x =
                      1.5 or x = 1
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* How the Socratic Method Works Section */}
        <section className="py-20 px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-800/50 to-slate-900/50" />
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative z-10 max-w-5xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-400 bg-clip-text text-transparent bg-size-200 animate-gradient leading-tight pb-2">
              How the Socratic Method Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6"
              >
                <div className="flex items-start space-x-4 mb-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                    <span className="text-red-400 font-bold">✗</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-red-400">Traditional AI Tutors</h3>
                    <p className="text-slate-300">
                      Give you direct answers immediately. You copy the solution without understanding the process.
                    </p>
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-blue-500/50 p-6"
              >
                <div className="flex items-start space-x-4 mb-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                    <span className="text-green-400 font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-green-400">GimmyAI's Approach</h3>
                    <p className="text-slate-300">
                      Asks questions to guide your thinking. You discover the solution yourself and truly understand it.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-slate-800/70 backdrop-blur-sm rounded-xl border border-slate-700/50 p-8"
            >
              <h3 className="text-2xl font-semibold mb-6 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Example Conversation
              </h3>
              <div className="space-y-4">
                <div className="bg-slate-700/50 rounded-lg p-4 border-l-4 border-blue-500">
                  <p className="text-slate-300 mb-2"><strong className="text-blue-400">You:</strong> "How do I solve x² + 5x + 6 = 0?"</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4 border-l-4 border-purple-500">
                  <p className="text-slate-300 mb-2"><strong className="text-purple-400">GimmyAI:</strong> "What type of equation is this? And what methods do you know for solving quadratic equations?"</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4 border-l-4 border-blue-500">
                  <p className="text-slate-300 mb-2"><strong className="text-blue-400">You:</strong> "It's a quadratic. I know factoring and the quadratic formula."</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4 border-l-4 border-purple-500">
                  <p className="text-slate-300 mb-2"><strong className="text-purple-400">GimmyAI:</strong> "Great! For factoring, what two numbers multiply to 6 and add to 5?"</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4 border-l-4 border-blue-500">
                  <p className="text-slate-300 mb-2"><strong className="text-blue-400">You:</strong> "2 and 3!"</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4 border-l-4 border-purple-500">
                  <p className="text-slate-300 mb-2"><strong className="text-purple-400">GimmyAI:</strong> "Perfect! So how would you write this as a factored equation?"</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4 border-l-4 border-green-500">
                  <p className="text-slate-300"><strong className="text-green-400">Result:</strong> You discover the solution yourself: (x + 2)(x + 3) = 0, so x = -2 or x = -3</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Humanized Learning Support Section */}
        <section className="py-20 px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-800/50" />
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-400 bg-clip-text text-transparent bg-size-200 animate-gradient leading-tight pb-2">
              The Socratic Method: Learn by Discovery
            </h2>
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-8 shadow-xl"
              >
                <div className="text-6xl mb-6">
                  <svg
                    className="w-16 h-16 mx-auto text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Questions, Not Answers
                </h3>
                <p className="text-slate-300 leading-relaxed text-lg mb-6">
                  GimmyAI uses the Socratic Method: instead of giving you answers, 
                  it asks thoughtful questions that guide you to discover solutions yourself. 
                  This approach builds deeper understanding, critical thinking skills, and 
                  confidence in your problem-solving abilities. You learn by thinking, not by copying.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-400">
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-blue-400">✓</span>
                    <span>Asks Questions</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-blue-400">✓</span>
                    <span>No Direct Answers</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-blue-400">✓</span>
                    <span>Guides Discovery</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-blue-400">✓</span>
                    <span>Supportive</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Privacy & Integrity Section */}
        <section className="py-20 px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-800/50" />
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-400 bg-clip-text text-transparent bg-size-200 animate-gradient leading-tight pb-2">
              Privacy & Integrity
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="p-8 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300"
              >
                <div className="text-5xl mb-6 transform hover:scale-110 transition-transform duration-300">
                  🔒
                </div>
                <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Your Privacy Matters
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  We take your privacy seriously. Your data is encrypted and
                  never shared with third parties. Your learning journey stays
                  private and secure.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="p-8 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300"
              >
                <div className="text-5xl mb-6 transform hover:scale-110 transition-transform duration-300">
                  🎯
                </div>
                <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Academic Integrity
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  Our goal is to help you learn, not to do your work for you. We
                  provide explanations and guidance to help you understand
                  concepts better.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-8 border-t border-slate-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-800/50" />
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="flex justify-center space-x-8">
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="mailto:gimmys943@gmail.com"
                className="text-slate-400 hover:text-blue-400 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="https://github.com/girmmy"
                className="text-slate-400 hover:text-blue-400 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="https://linkedin.com/in/girmachew-samson"
                className="text-slate-400 hover:text-blue-400 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </motion.a>
            </div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center text-slate-400 mt-6 max-w-2xl mx-auto"
            >
              Your AI-powered homework helper. Get instant help with math,
              science, english, and more. Upload images of your problems for
              detailed explanations.
            </motion.p>
          </div>
        </footer>
      </div>
    </>
  );
}
