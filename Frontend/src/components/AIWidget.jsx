import { useState, useEffect } from "react";
import { FaRobot, FaMicrophone, FaComments } from "react-icons/fa";
import AskAIModal from "./AskAIModal";
import VoiceAssistant from "./VoiceAssistant";

const AIWidget = ({ blogContent }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [showAskAI, setShowAskAI] = useState(false);
  const [showVoice, setShowVoice] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);

  // Show greeting message for 3 seconds on mount
  useEffect(() => {
    setShowGreeting(true);
    const timeout = setTimeout(() => setShowGreeting(false), 3000);
    return () => clearTimeout(timeout);
  }, []);

  const toggleOptions = () => {
    setShowOptions(prev => !prev);
    // Keep current modals open. Just toggling the option list.
  };

  const handleAskAI = () => {
    setShowAskAI(true);
    setShowOptions(false);
  };

  const handleVoiceAssistant = () => {
    setShowVoice(true);
    setShowOptions(false);
  };

  return (
    <div className="relative z-50">
      {/* 👋 Greeting */}
      {showGreeting && (
        <div className="fixed bottom-24 left-6 bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-4 py-2 rounded-lg shadow-lg animate-fadeInOut border dark:border-gray-600">
          How may I help you?
        </div>
      )}

      {/* 🤖 Floating AI Button */}
      <button
        onClick={toggleOptions}
        className="fixed bottom-6 left-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-xl transition"
        title="AI Tools"
      >
        <FaRobot size={22} />
      </button>

      {/* 📦 AI Feature Options */}
      {showOptions && (
        <div className="fixed bottom-24 left-6 flex flex-col gap-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg p-3 w-[200px]">
          <button
            onClick={handleAskAI}
            className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-sm text-gray-700 dark:text-gray-200"
          >
            <FaComments /> Ask AI
          </button>
          <button
            onClick={handleVoiceAssistant}
            className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-sm text-gray-700 dark:text-gray-200"
          >
            <FaMicrophone /> Voice Assistant
          </button>
        </div>
      )}

      {/* 🧠 AI Modals */}
      {showAskAI && (
        <AskAIModal
          blogContent={blogContent}
          onClose={() => setShowAskAI(false)}
        />
      )}
      {showVoice && (
        <VoiceAssistant
          blogContent={blogContent}
          onClose={() => {
            setShowVoice(false);
            window.speechSynthesis.cancel(); // stop any speaking
          }}
        />
      )}
    </div>
  );
};

export default AIWidget;
