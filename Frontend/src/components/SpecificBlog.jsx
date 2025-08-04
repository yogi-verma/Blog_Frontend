import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FiBookOpen,
  FiUser,
  FiCalendar,
  FiArrowLeft,
  FiMoon,
  FiSun,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { getPostById } from "../utils/blog_api";
import { FiCopy, FiShare2, FiZap, FiMessageSquare } from "react-icons/fi";
import AskAIModal from "./AskAIModal";
import VoiceAssistant from "./VoiceAssistant";
import CommentModal from "./CommentModal";
import CommentsSection from "./CommentsSection";
import RelatedBlogs from "./RelatedBlogs";

const SpecificBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  const [showGreeting, setShowGreeting] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGreeting(false);
    }, 4000); // 3 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleSummarize = async () => {
    if (!post?.content) return;

    setSummaryLoading(true);
    setShowSummaryModal(true);
    setSummary(null);

    const plainText = new DOMParser().parseFromString(post.content, "text/html")
      .body.innerText;
    const huggingFaceAPI =
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";

    try {
      const response = await fetch(huggingFaceAPI, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_HUGGING_FACE}`, // paste your token here for testing
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: plainText.slice(0, 4000), // truncate to fit model limit
        }),
      });

      const data = await response.json();

      if (data.error) throw new Error(data.error);

      setSummary(data[0]?.summary_text || "No summary generated.");
    } catch (err) {
      console.error("HuggingFace summarization error:", err);
      setSummary("❌ Failed to summarize. Try again later.");
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleCopySummary = () => {
    if (summary) {
      navigator.clipboard.writeText(summary).then(() => {
        setToast("Summary copied!");
        setTimeout(() => setToast(null), 3000);
      });
    }
  };

  const handleCopy = () => {
    if (post?.content) {
      const tempElement = document.createElement("div");
      tempElement.innerHTML = post.content;
      const text = tempElement.innerText;

      navigator.clipboard.writeText(text).then(() => {
        setToast("Blog content copied!");
        setTimeout(() => setToast(null), 3000);
      });
    }
  };

  const handleShare = () => {
    const url = window.location.href;

    if (navigator.share) {
      navigator
        .share({
          title: post.title,
          text: "Check out this blog!",
          url,
        })
        .catch((err) => {
          console.error("Share failed:", err);
        });
    } else {
      navigator.clipboard.writeText(url).then(() => {
        setToast("URL copied to clipboard!");
        setTimeout(() => setToast(null), 3000);
      });
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postData = await getPostById(id);

        if (!postData) {
          throw new Error("Post not found");
        }

        setPost(postData);
      } catch (err) {
        console.error("Error fetching post:", err);
        setError(err.message || "Failed to fetch post");
        if (err.message.includes("404")) {
          navigate("/404", { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, navigate]);

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          darkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className={`mt-4 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            Loading post...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          darkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="text-center">
          <p
            className={`text-red-500 text-lg ${
              darkMode ? "text-red-400" : "text-red-600"
            }`}
          >
            {error}
          </p>
          <Link
            to="/"
            className={`mt-4 inline-flex items-center ${
              darkMode ? "text-blue-400" : "text-blue-600"
            } hover:underline`}
          >
            <FiArrowLeft className="mr-2" /> Back to all posts
          </Link>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          darkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="text-center">
          <p
            className={`text-lg ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Post not found
          </p>
          <Link
            to="/"
            className={`mt-4 inline-flex items-center ${
              darkMode ? "text-blue-400" : "text-blue-600"
            } hover:underline`}
          >
            <FiArrowLeft className="mr-2" /> Back to all posts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Navigation Bar */}
      <nav
        className={`sticky top-0 z-50 shadow-sm ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <FiBookOpen
                className={`text-2xl ${
                  darkMode ? "text-blue-400" : "text-blue-600"
                }`}
              />
              <span
                className={`text-2xl font-bold ${
                  darkMode ? "text-white" : "text-gray-700"
                }`}
              >
                Daily Blogs
              </span>
            </Link>

            <div className="flex items-center gap-6">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-full ${
                  darkMode
                    ? "text-yellow-300 hover:bg-gray-700"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
              </button>
              <Link
                to="/"
                className={`inline-flex items-center ${
                  darkMode ? "text-blue-400" : "text-blue-600"
                } hover:underline`}
              >
                <FiArrowLeft className="mr-2" /> Back to posts
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex flex-col lg:flex-row max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
        {/* Blog Post Section (Left) */}
        <div className="lg:w-2/3">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`rounded-xl overflow-hidden shadow-lg ${
              darkMode ? "bg-gray-800" : "bg-white"
            } p-6 sm:p-8`}
          >
            {/* Existing blog post content */}
            <div className="flex flex-wrap gap-2">
              <span
                className={`text-md mb-3 font-semibold p-3 rounded-xl ${
                  darkMode
                    ? "bg-gradient-to-r from-blue-800 via-green-800 to-red-800 text-gray-100"
                    : "bg-gradient-to-r from-blue-500 via-green-400 to-red-500 text-white"
                }`}
              >
                ✨Enhance your blogs with an AI touch.
              </span>
            </div>

            <span
              className={`text-xs font-semibold px-2 py-1 rounded-full ${
                darkMode
                  ? "bg-blue-900 text-blue-300"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {post.category}
            </span>

            <h1 className="mt-4 text-2xl sm:text-3xl font-bold leading-tight">
              {post.title}
            </h1>

            <div
              className={`mt-4 flex flex-wrap gap-4 text-sm ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              <div className="flex items-center gap-2">
                <FiUser size={14} />
                <span>{post.author || "Admin"}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCalendar size={14} />
                <span>
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span>•</span>
                <span>{post.readTime} min read</span>
              </div>
            </div>

            <div
              className={`mt-6 prose max-w-none ${
                darkMode ? "prose-invert" : ""
              }`}
            >
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2 items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`text-xs px-2 py-1 rounded-full ${
                        darkMode
                          ? "bg-gray-700 text-blue-300"
                          : "bg-gray-100 text-blue-600"
                      }`}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 mt-6 items-center">
                  {/* Copy Button */}
                  <button
                    onClick={handleCopy}
                    className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition hover:cursor-pointer ${
                      darkMode
                        ? "bg-blue-700 text-white hover:bg-blue-600"
                        : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    }`}
                  >
                    <FiCopy size={18} />
                    Copy
                  </button>

                  {/* Share Button */}
                  <button
                    onClick={handleShare}
                    className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition hover:cursor-pointer  ${
                      darkMode
                        ? "bg-green-700 text-white hover:bg-green-600"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                  >
                    <FiShare2 size={18} />
                    Share
                  </button>

                  {/* Summarize Button */}
                  <button
                    onClick={handleSummarize}
                    className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition hover:cursor-pointer ${
                      darkMode
                        ? "bg-purple-700 text-white hover:bg-purple-600"
                        : "bg-purple-100 text-purple-800 hover:bg-purple-200"
                    }`}
                  >
                    <FiZap size={18} />
                    Summarize
                  </button>
                </div>
              </div>
            )}
          </motion.article>
        </div>

        {/* Comments Section (Right) */}
        <div className="lg:w-1/3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`rounded-xl overflow-hidden shadow-lg sticky top-8 ${
              darkMode ? "bg-gray-800" : "bg-white"
            } p-6 sm:p-8 h-fit`}
          >
            {/* Heading and Button aligned horizontally */}
            <div className="flex justify-between items-center mb-6">
              <h2
                className={`text-xl font-semibold ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Comments
              </h2>

              <button
                onClick={() => setModalOpen(true)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  darkMode
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                    : "bg-indigo-100 hover:bg-indigo-200 text-indigo-700"
                }`}
              >
                Leave a Comment
              </button>
            </div>

            {/* Comments List */}
            <div className="space-y-4 mb-4">
              <CommentsSection postId={post?._id} darkMode={darkMode} />
            </div>

            {/* Related Blogs Section */}
            <div className="border-t pt-2">
              <RelatedBlogs blogId={id} />
            </div>
          </motion.div>
        </div>

        {/* Comment Modal */}
        <CommentModal
          postId={post._id}
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          darkMode={darkMode}
        />
      </main>

      {showSummaryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className={`relative w-[90%] max-w-2xl p-6 rounded-2xl shadow-xl border ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowSummaryModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-xl font-bold"
            >
              &times;
            </button>

            {/* Title */}
            <h2 className="text-2xl font-semibold mb-4 text-center">
              ✨ Blog Summary
            </h2>

            {/* Loading Spinner */}
            {summaryLoading ? (
              <div className="flex flex-col items-center justify-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500 border-solid"></div>
                <p className="mt-4 text-gray-500 text-sm">
                  Summarizing blog...
                </p>
              </div>
            ) : (
              <>
                {/* Summary Text */}
                <div
                  className={`rounded-md px-4 py-3 text-sm leading-relaxed whitespace-pre-line max-h-64 overflow-y-auto ${
                    darkMode
                      ? "bg-gray-700 text-gray-100"
                      : "bg-gray-50 text-gray-800"
                  }`}
                >
                  {summary}
                </div>

                {/* Copy Button */}
                <div className="flex justify-end mt-4">
                  <button
                    onClick={handleCopySummary}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                      darkMode
                        ? "bg-blue-600 hover:bg-blue-500 text-white"
                        : "bg-blue-100 hover:bg-blue-200 text-blue-800"
                    }`}
                  >
                    📋 Copy Summary
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}

      {toast && (
        <>
          <div className="toast-notification">
            <span
              style={{
                marginRight: "0.5rem",
                display: "flex",
                alignItems: "center",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                width="18"
                height="18"
                style={{ marginRight: "0.5rem", color: "#f9fafb" }} // Tailwind's green-500
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>{toast}</span>
            </span>
          </div>

          <style>{`
      @keyframes fade-in-out {
        0%, 100% { opacity: 0; transform: translateY(10px); }
        10%, 90% { opacity: 1; transform: translateY(0); }
      }

      .toast-notification {
        position: fixed;
        bottom: 1.5rem;
        right: 1.5rem;
        background: #10B981; /* Tailwind's gray-900 */
        color: #f9fafb;       /* Tailwind's gray-50 */
        padding: 0.75rem 1.25rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px rgba(0,0,0,0.1);
        font-size: 0.875rem;
        z-index: 50;
        display: flex;
        align-items: center;
        animation: fade-in-out 3s ease-in-out;
        transition: all 0.3s ease-in-out;
      }
    `}</style>
        </>
      )}

      {/* 🤖 Chatbot Floating Button */}
      {/* <AskAIModal blogContent={post.content}/> */}

      <div className="relative">
        {/* 👋 Greeting message */}
        {showGreeting && (
          <div className="fixed bottom-34 left-6 z-40 bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-4 py-2 rounded-lg shadow-lg animate-fadeInOut border dark:border-gray-600">
            How may I help you?
          </div>
        )}

        {/* AI Feature */}
        <AskAIModal blogContent={post.content} />

        <VoiceAssistant blogContent={post.content} />
      </div>
    </div>
  );
};

export default SpecificBlog;
