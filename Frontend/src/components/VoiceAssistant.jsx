import { useEffect, useState, useRef } from "react";
import { FaMicrophone, FaStop, FaTimes, FaLanguage } from "react-icons/fa";

const VoiceAssistant = ({ blogContent }) => {
  const [showAssistant, setShowAssistant] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [language, setLanguage] = useState("en-US"); // 'hi-IN' for Hindi
  const recognitionRef = useRef(null);

  // Init Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setTranscript(speechToText);
      fetchAIResponse(speechToText);
    };

    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
  }, [language]);

  // Fetch Answer from Cohere
  const fetchAIResponse = async (userInput) => {
    if (!userInput.trim()) return;
    setAiResponse("Thinking...");

    try {
      const prompt = `Answer concisely and clearly: ${userInput}. Use this blog content:\n${blogContent}`;
      const res = await fetch("https://api.cohere.ai/v1/chat", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_COHERE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: prompt,
          model: "command-r-plus",
          temperature: 0.4,
        }),
      });

      const data = await res.json();
      const response = data.text?.trim() || "Sorry, I couldn't understand.";
      setAiResponse(response);
      speakText(response);
    } catch (err) {
      setAiResponse("Failed to get response.");
    }
  };

  const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    if (recognitionRef.current) {
      setTranscript("");
      setAiResponse("");
      setListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en-US" ? "hi-IN" : "en-US"));
  };

  return (
    <>
      {!showAssistant && (
        <button
          onClick={() => setShowAssistant(true)}
          className="fixed bottom-6 left-6 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg cursor-pointer transition duration-300"
          title="Open Voice Assistant"
        >
          <FaMicrophone className="text-xl" />
        </button>
      )}

      {showAssistant && (
        <div className="fixed bottom-6 right-6 z-50 w-[90%] max-w-md bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl shadow-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              Voice Assistant ({language === "en-US" ? "English" : "Hindi"})
            </span>
            <div className="flex gap-2">
              <button
                onClick={toggleLanguage}
                className="text-gray-600 hover:text-blue-600 text-lg"
                title="Switch Language"
              >
                <FaLanguage />
              </button>
              <button
                onClick={() => {
                  window.speechSynthesis.cancel(); // 👈 stops any ongoing speech
                  setShowAssistant(false);
                }}
                className="text-gray-600 hover:text-red-500 text-lg"
                title="Close"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-3">
            {listening ? (
              <button
                onClick={stopListening}
                className="text-red-600 hover:text-red-800 text-2xl"
                title="Stop Listening"
              >
                <FaStop />
              </button>
            ) : (
              <button
                onClick={startListening}
                className="text-blue-600 hover:text-blue-800 text-2xl"
                title="Start Listening"
              >
                <FaMicrophone />
              </button>
            )}
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {listening ? "Listening..." : "Click mic to speak"}
            </p>
          </div>

          {transcript && (
            <p className="text-sm mb-2 text-blue-700 dark:text-blue-300">
              <strong>You:</strong> {transcript}
            </p>
          )}

          {aiResponse && (
            <div className="text-sm text-gray-800 dark:text-white bg-blue-50 dark:bg-gray-800 p-3 rounded-lg">
              <strong>AI:</strong> {aiResponse}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default VoiceAssistant;
