import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaRobot, FaCopy, FaCheck } from "react-icons/fa";

const AskAIModal = ({ blogContent }) => {
  const [showAskAI, setShowAskAI] = useState(false);
  const [userQuestion, setUserQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const [copied, setCopied] = useState(false);

  const handleAskAI = async () => {
    if (!userQuestion.trim()) return;
    setLoading(true);
    setAiAnswer("");

    try {
      const concisePrompt = `Answer briefly and simply: ${userQuestion}. Use this blog content as context:\n${blogContent}`;

      const res = await fetch("https://api.cohere.ai/v1/chat", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_COHERE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: concisePrompt,
          model: "command-r-plus",
          temperature: 0.7,
        }),
      });

      const data = await res.json();
      setAiAnswer(data.text || "AI couldn't respond. Try again.");
    } catch (error) {
      console.error("AI Error:", error);
      setAiAnswer("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(aiAnswer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // 2 seconds
  };

  return (
    <>
      {/* 🤖 Bot Icon */}
      <div
        onClick={() => setShowAskAI(true)}
        className="fixed bottom-20 left-6 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg cursor-pointer transition duration-300"
        title="Ask AI"
      >
        <FaRobot className="text-xl" />
      </div>

      {/* 🧠 Ask AI Modal */}
      <AnimatePresence>
        {showAskAI && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 backdrop-blur-md bg-black/10 dark:bg-white/10 flex items-center justify-center px-4"
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="relative bg-white dark:bg-gray-900 p-6 md:p-8 rounded-2xl w-full max-w-xl shadow-2xl border border-gray-200 dark:border-gray-700"
            >
              {/* ❌ Close Button */}
              <button
                onClick={() => setShowAskAI(false)}
                className="absolute top-3 right-4 text-2xl text-gray-400 dark:text-gray-500 hover:text-red-500 transition"
              >
                ×
              </button>

              {/* Heading */}
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                🧠 Ask AI About This Blog
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                Ask anything like: <em>"Explain the topic"</em> or{" "}
                <em>"Explain [term]"</em>
              </p>

              {/* 🔍 Question Input */}
              <div className="flex flex-col md:flex-row gap-3 mb-4">
                <input
                  value={userQuestion}
                  onChange={(e) => setUserQuestion(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type your question here..."
                />
                <button
                  onClick={handleAskAI}
                  disabled={loading}
                  className={`px-5 py-2 rounded-lg text-white text-sm font-semibold shadow transition ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  }`}
                >
                  {loading ? "Thinking..." : "Ask AI"}
                </button>
              </div>

              {/* 🤖 AI Answer */}
              {aiAnswer && (
                <div className="relative mt-3 bg-gradient-to-br from-green-100 to-blue-100 dark:from-gray-800 dark:to-gray-900 p-4 rounded-xl text-sm text-gray-800 dark:text-white shadow-inner border border-gray-200 dark:border-gray-700 transition-all">
                  {aiAnswer}
                  <button
                    onClick={handleCopy}
                    className="absolute top-2 right-2 text-gray-500 dark:text-gray-400 hover:text-blue-600"
                    title={copied ? "Copied!" : "Copy response"}
                  >
                    {copied ? <FaCheck /> : <FaCopy />}
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AskAIModal;
