import { useState } from "react";
import { submitComment } from "../utils/commentApi";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CommentModal = ({ postId, isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !text.trim()) {
      toast.warning("Both name and comment are required.");
      return;
    }

    setLoading(true);
    try {
      await submitComment(postId, { name, text });
      toast.success("Comment sent to admin for approval.");
      setName("");
      setText("");
      onClose();
    } catch (err) {
      toast.error("Failed to submit comment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <ToastContainer
            position="top-right"
            autoClose={3000} // 3 seconds
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light" // or "dark"
          />
          {/* Blur & dark overlay */}
          <div className="absolute inset-0 backdrop-blur-sm bg-black/40"></div>

          {/* Modal content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 bg-white w-full max-w-md mx-4 rounded-2xl shadow-xl p-6 sm:p-8"
          >
            <h2 className="text-2xl font-semibold mb-5 text-gray-800">
              Leave a Comment
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              />

              <textarea
                placeholder="Your Comment"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 h-32 resize-none focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 rounded-lg border border-gray-300 hover-cursor-pointer text-gray-700 hover:bg-gray-100 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-5 py-2.5 rounded-lg hover:cursor-pointer bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CommentModal;
