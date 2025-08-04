import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiBookOpen,
  FiUser,
  FiCalendar,
  FiArrowRight,
  FiSearch,
  FiMoon,
  FiSun,
  FiChevronLeft,
  FiChevronRight,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { getPosts } from "../utils/blog_api";
import Header from "./Header";
import { incrementBlogView } from "../utils/blog_api";
import { useNavigate } from "react-router-dom";
import AskAIModal from "./AskAIModal";
import Typewriter from "typewriter-effect";
import WhyJoinCommunity from "./WhyJoinCommunity";

const BlogPosts = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(6);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { posts } = await getPosts();
        setPosts(Array.isArray(posts) ? posts : []);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth < 640) setPostsPerPage(3);
      else if (window.innerWidth < 1024) setPostsPerPage(3);
      else setPostsPerPage(6);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (windowWidth >= 768) {
      setMobileMenuOpen(false);
    }
  }, [windowWidth]);

  const filteredPosts = posts.filter(
    (post) =>
      post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const cardVariants = {
    offscreen: { opacity: 0, y: 30 },
    onscreen: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", bounce: 0.4, duration: 0.8 },
    },
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 scroll-smooth ${
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
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <FiBookOpen
                className={`text-3xl ${
                  darkMode ? "text-blue-400" : "text-blue-600"
                }`}
              />
              <span
                className={`text-2xl font-bold tracking-tight ${
                  darkMode ? "text-white" : "text-gray-700"
                }`}
              >
                <Typewriter
                  options={{
                    strings: [
                      "Daily Blogs",
                      "Tech Insights",
                      "Coding Tips",
                      "AI Trends",
                      "Web Dev News",
                      "Startup Stories",
                    ],
                    autoStart: true,
                    loop: true,
                    delay: 70,
                    deleteSpeed: 40,
                    pauseFor: 1200,
                  }}
                />
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                to="/developer"
                className={`px-3 py-2 rounded-lg font-medium ${
                  darkMode
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-600 hover:text-blue-400"
                }`}
              >
                Developer
              </Link>
              <Link
                to="/contact"
                className={`px-3 py-2 rounded-lg font-medium ${
                  darkMode
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-600 hover:text-blue-400"
                }`}
              >
                Contact Us
              </Link>
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
              <div className="relative inline-block text-left z-50">
                {/* Profile Icon Button */}
                <button
                  onClick={() => setOpen((prev) => !prev)}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#3b82f6] hover:cursor-pointer text-white shadow-lg hover:scale-105 transition-transform"
                >
                  <FiUser className="w-5 h-5" />
                </button>

                {/* Dropdown Menu */}
                {open && (
                  <div className="absolute right-0 mt-2 w-44 origin-top-right bg-white dark:bg-slate-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-dropdown">
                    <div className="py-2 text-sm text-gray-700 dark:text-gray-200">
                      <Link
                        to="/login"
                        className="block px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 hover:text-blue-800 dark:hover:text-white transition-colors font-medium"
                        onClick={() => setOpen(false)}
                      >
                        Admin
                      </Link>
                      <Link
                        to="/request-user/login"
                        className="block px-4 py-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900 hover:text-green-800 dark:hover:text-white transition-colors font-medium"
                        onClick={() => setOpen(false)}
                      >
                        Member
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-md focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <FiX
                  className={`h-6 w-6 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                />
              ) : (
                <FiMenu
                  className={`h-6 w-6 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={`md:hidden ${darkMode ? "bg-gray-800" : "bg-white"}`}
          >
            <div className="px-4 py-3 space-y-4">
              <Link
                to="/developer"
                className={`block px-4 py-2 rounded-lg ${
                  darkMode
                    ? "text-gray-300 hover:bg-gray-700"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                Developer
              </Link>
              <Link
                to="/contact"
                className={`block px-4 py-2 rounded-lg ${
                  darkMode
                    ? "text-gray-300 hover:bg-gray-700"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                Contact Us
              </Link>
              <div className="flex items-center justify-between px-2">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`flex items-center gap-2 p-2 rounded-lg ${
                    darkMode
                      ? "text-yellow-300 hover:bg-gray-700"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
                  <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
                </button>
                <div className="relative inline-block text-left z-50">
                  {/* Profile Icon Button */}
                  <button
                    onClick={() => setOpen((prev) => !prev)}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#3b82f6] text-white shadow-lg hover:scale-105 transition-transform"
                  >
                    <FiUser className="w-5 h-5" />
                  </button>

                  {/* Dropdown Menu */}
                  {open && (
                    <div className="absolute right-0 mt-2 w-44 origin-top-right bg-white dark:bg-slate-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-dropdown">
                      <div className="py-2 text-sm text-gray-700 dark:text-gray-200">
                        <Link
                          to="/login"
                          className="block px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 hover:text-blue-800 dark:hover:text-white transition-colors font-medium"
                          onClick={() => setOpen(false)}
                        >
                          Admin
                        </Link>
                        <Link
                          to="/request-user/login"
                          className="block px-4 py-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900 hover:text-green-800 dark:hover:text-white transition-colors font-medium"
                          onClick={() => setOpen(false)}
                        >
                          Member
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Header />
        </motion.div>

        <div className="mt-5 mb-7 px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#3b82f6] text-white shadow-xl">
            <div className="flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-10 gap-6 md:gap-0">
              <div className="text-center md:text-left">
                <h1 className="text-xl md:text-3xl font-bold leading-tight mb-2 flex flex-wrap items-center gap-2">
                  <span>Welcome to our</span>
                  <span className=" text-white">
                    <Typewriter
                      options={{
                        strings: [
                          "Community",
                          "Network",
                          "Circle",
                          "Space",
                          "Squad",
                          "Tribe",
                        ],
                        autoStart: true,
                        loop: true,
                        delay: 60,
                        deleteSpeed: 40,
                        pauseFor: 1200,
                      }}
                    />
                  </span>
                </h1>

                <p className="text-sm md:text-base opacity-80 max-w-md">
                  Join a vibrant group of thinkers, builders, and creators.
                  Collaborate, grow, and shine with us.
                </p>
              </div>

              <Link
                to="/join"
                className="mt-4 md:mt-0 bg-white text-blue-700 hover:scale-105 font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-gray-100 transition duration-300"
              >
                Join Now 🚀
              </Link>
            </div>
          </div>
        </div>

        {/* Search Bar (below Header) */}
        <div className="mt-8 mb-8 w-full">
          <div className="relative max-w-lg mx-auto">
            {" "}
            {/* Changed max-w-md to max-w-lg */}
            <FiSearch
              className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
              size={20}
            />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-12 pr-5 py-3 rounded-full text-base outline-none focus:ring-2 transition-all ${
                darkMode
                  ? "bg-transparent border border-gray-600 text-white ring-indigo-400"
                  : "bg-transparent border border-gray-300 text-gray-900 ring-indigo-500"
              }`}
            />
          </div>
        </div>

        {/* Posts Section */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <p className="text-center text-red-500 py-12">{error}</p>
        ) : filteredPosts.length === 0 ? (
          <p
            className={`text-center py-12 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            No posts found for your search.
          </p>
        ) : (
          <>
            <div
              className={`grid ${
                windowWidth < 640
                  ? "grid-cols-1"
                  : "sm:grid-cols-2 lg:grid-cols-3"
              } gap-6 mt-8`}
            >
              {currentPosts.map((post) => (
                <motion.article
                  key={post._id}
                  initial="offscreen"
                  whileInView="onscreen"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={cardVariants}
                  className={`rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all ${
                    darkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <div className="p-5">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        darkMode
                          ? "bg-blue-900 text-blue-300"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {post.category}
                    </span>
                    {post.featuredImage && (
                      <div className="w-full h-48 rounded-xl overflow-hidden shadow-sm border border-gray-200 mt-4">
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    <h2 className="mt-3 text-lg font-bold r leading-snug hover:text-blue-500">
                      <button
                        onClick={async () => {
                          await incrementBlogView(post._id);
                          navigate(`/post/${post._id}`);
                        }}
                        className="text-left w-full"
                      >
                        {post.title}
                      </button>
                    </h2>
                    <p
                      className={`mt-2 text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      } line-clamp-3`}
                    >
                      {post.excerpt}
                    </p>
                    <div
                      className={`mt-4 flex justify-between items-center text-xs ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <FiUser size={14} />
                        <span>{post.author || "Admin"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiCalendar size={14} />
                        <span>
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Link
                      onClick={async (e) => {
                        e.preventDefault(); // Prevent default link behavior
                        await incrementBlogView(post._id);
                        navigate(`/post/${post._id}`);
                      }}
                      className={`mt-4 inline-flex items-center text-sm ${
                        darkMode ? "text-blue-400" : "text-blue-600"
                      } hover:underline`}
                    >
                      Read more <FiArrowRight className="ml-1" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>

            {/* Pagination */}
            {filteredPosts.length > postsPerPage && (
              <div className="flex justify-center mt-10 gap-1 sm:gap-2">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-full ${
                    darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
                  } disabled:opacity-40`}
                >
                  <FiChevronLeft />
                </button>
                {[...Array(totalPages).keys()].map((i) => (
                  <button
                    key={i + 1}
                    onClick={() => paginate(i + 1)}
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentPage === i + 1
                        ? "bg-blue-600 text-white"
                        : darkMode
                        ? "hover:bg-gray-700"
                        : "hover:bg-gray-200"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-full ${
                    darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
                  } disabled:opacity-40`}
                >
                  <FiChevronRight />
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <div className=" mb-7 px-4">
        <WhyJoinCommunity />
      </div>

      {/* Footer */}
      <footer
        className={`py-6 border-t ${
          darkMode
            ? "border-gray-700 bg-gray-800 text-gray-400"
            : "bg-white text-gray-600 border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          © {new Date().getFullYear()} Daily Blogs. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default BlogPosts;
