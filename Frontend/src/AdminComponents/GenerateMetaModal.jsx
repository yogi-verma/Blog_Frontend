import GenerateMetaButton from "./GenerateMetaButton";
import { motion } from "framer-motion";

const GenerateMetaModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-white dark:bg-[#1f2937] rounded-2xl shadow-2xl w-full max-w-2xl p-6 relative border border-gray-200 dark:border-gray-700 max-h-[85vh] overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-4 text-gray-600 dark:text-gray-300 hover:text-red-500 text-xl transition-all"
        >
          ✖
        </button>

        {/* Heading */}
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 text-center">
          🧠 Generate SEO Blog Meta with AI
        </h2>

        {/* Scrollable Container for Content */}
        <div className="overflow-y-auto max-h-[70vh] pr-2 custom-scrollbar">
          <GenerateMetaButton />
        </div>
      </motion.div>
    </div>
  );
};

export default GenerateMetaModal;
