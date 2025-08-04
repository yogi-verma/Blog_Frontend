import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getPosts, updatePost, deletePost } from "../utils/blog_api";
import {
  FiMoreVertical,
  FiEdit,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { getTotalBlogViews } from "../utils/blog_api";
import { FiEye } from "react-icons/fi"; // make sure to import this
import { getAverageViewsPerBlog } from "../utils/blog_api";
import { BsGraphUpArrow } from "react-icons/bs";
import GenerateMetaModal from "./GenerateMetaModal";
import { totalComments } from "../utils/commentApi";
import { LiaCommentSolid } from "react-icons/lia";

import { Toaster } from "react-hot-toast";


import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    [{ color: [] }, { background: [] }],
    ["link", "image"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "align",
  "color",
  "background",
  "link",
  "image",
];

const Dashboard = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingPost, setEditingPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(6);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);

  const [isDeleting, setIsDeleting] = useState(false);

  const [totalViews, setTotalViews] = useState(0);

  const [averageViews, setAverageViews] = useState(0);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [commentsCount, setCommentsCount] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const count = await totalComments(token);
        setCommentsCount(count);
      } catch (err) {
        toast.error("Error fetching total comments");
      }
    };

    if (token) fetchData();
  }, [token]);

  useEffect(() => {
    const fetchTotalViews = async () => {
      const views = await getTotalBlogViews();
      setTotalViews(views);
    };

    fetchTotalViews();
  }, []);

  useEffect(() => {
    const fetchAverageViews = async () => {
      try {
        const avg = await getAverageViewsPerBlog();
        setAverageViews(avg);
      } catch (err) {
        console.error("Failed to load average views:", err);

        setAverageViews(null);
      }
    };

    fetchAverageViews();
  });

  // Responsive posts per page
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setPostsPerPage(3);
      } else {
        setPostsPerPage(6);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch all posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { posts } = await getPosts();
        setPosts(posts);
        setIsLoading(false);
      } catch (error) {
        toast.error("Failed to load posts");
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Filter posts based on search term
  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // Handle post update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updatedPost = await updatePost(editingPost._id, editingPost);
      setPosts(
        posts.map((post) => (post._id === editingPost._id ? updatedPost : post))
      );

      toast.success("Post updated successfully!");

      // Wait 2 seconds before closing the modal and stopping loading
      setTimeout(() => {
        setLoading(false);
        setEditingPost(null);
      }, 2000);
    } catch (error) {
      toast.error("Failed to update post");

      setLoading(false);
    }
  };

  // Handle post deletion
  const handleDelete = async (postId) => {
    setIsDeleting(true);

    try {
      await deletePost(postId);
      setPosts(posts.filter((post) => post._id !== postId));
      setShowDeleteConfirm(null);
      toast.success("Post deleted successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      toast.error("Failed to delete post", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <ToastContainer />
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">
            Welcome👋, {user?.username}!
          </h3>
          <p className="text-gray-500 mt-1">
            This is your personalized dashboard
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-4 sm:mt-0">
          <input
            type="text"
            placeholder="Search posts..."
            className="px-4 py-2 border lg:w-80 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <Link
            to="/admin/create-blog"
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-6 rounded-lg transition duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create Blog
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap justify-between items-center gap-4 mb-7">
        {/* Left: Generate Button */}

        <div>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 text-white font-semibold rounded-full shadow-lg bg-gradient-to-r from-red-400 via-green-400 to-blue-500 hover:from-purple-500 hover:via-pink-500 hover:to-yellow-500 hover:cursor-pointer transition-all animate-gradient"
          >
            🎯 Generate Blog With AI
          </button>
          {showModal && (
            <GenerateMetaModal onClose={() => setShowModal(false)} />
          )}
        </div>
        {/* Right Metrics Container */}
        <div className="flex flex-wrap gap-4">
          {/* Total Views Card */}
          <div className="bg-green-50 border border-green-300 text-green-800 px-5 py-4 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 w-[260px]">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-200 text-green-800 rounded-full shadow-sm">
                <FiEye className="text-xl" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-700">
                  Total Blog Views
                </p>
                <p className="text-2xl font-bold tracking-wide">{totalViews}</p>
              </div>
            </div>
          </div>

          {/* Average Views Card */}
          <div className="bg-blue-50 border border-blue-300 text-blue-800 px-5 py-4 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 w-[260px]">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-200 text-blue-800 rounded-full shadow-sm">
                <BsGraphUpArrow className="text-xl" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-700">
                  Average Views Per Blog
                </p>
                <p className="text-2xl font-bold tracking-wide">
                  {averageViews?.toFixed(2)} views
                </p>
              </div>
            </div>
          </div>

          <div className="bg-pink-50 border border-pink-300 text-pink-800 px-5 py-4 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 w-[260px]">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-pink-200 text-pink-800 rounded-full shadow-sm">
                <LiaCommentSolid className="text-xl" />
              </div>
              <div>
                <p className="text-sm font-medium text-pink-700">
                  Total Comments
                </p>
                <p className="text-2xl font-bold tracking-wide">
                  {commentsCount !== null ? commentsCount : "Loading..."}{" "}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-gray-800 my-4">
          Manage Your Blogs Below ➤
        </h3>
      </div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {currentPosts.map((post) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow relative"
            >
              <div className="p-5">
                {/* Three dots menu */}
                <div className="absolute top-3 right-3">
                  <button
                    onClick={() =>
                      setActiveMenu(activeMenu === post._id ? null : post._id)
                    }
                    className="p-1 rounded-full hover:cursor-pointer hover:bg-gray-200 transition"
                  >
                    <FiMoreVertical className="text-gray-500" />
                  </button>

                  {activeMenu === post._id && (
                    <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg z-10 border border-gray-100">
                      <button
                        onClick={() => {
                          setEditingPost(post);
                          setActiveMenu(null);
                        }}
                        className="flex hover:cursor-pointer items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FiEdit className="mr-2" /> Update
                      </button>
                      <button
                        onClick={() => {
                          setShowDeleteConfirm(post._id);
                          setActiveMenu(null);
                        }}
                        className="flex hover:cursor-pointer items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        <FiTrash2 className="mr-2" /> Delete
                      </button>
                    </div>
                  )}
                </div>

                <h2 className="text-md font-semibold text-gray-700 pr-6">
                  {post.title}
                </h2>
                <p className="text-xs text-gray-500 mt-1">ID: {post._id}</p>

                <div className="flex items-center gap-1 text-gray-500 text-xs mt-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  <span>{post.views} views</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {filteredPosts.length > postsPerPage && (
        <div className="flex justify-center mt-8 gap-1">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>

          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-10 h-10 rounded-lg ${
                  currentPage === pageNum
                    ? "bg-indigo-600 text-white"
                    : "border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          {totalPages > 5 && currentPage < totalPages - 2 && (
            <span className="flex items-center px-2 text-gray-500">...</span>
          )}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
          >
            <FiChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Update Post Modal */}
      {editingPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            {/* Toast container inside modal */}
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              pauseOnHover
              draggable
            />

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Update Post</h2>
              <button
                onClick={() => setEditingPost(null)}
                className="text-gray-500 hover:text-gray-700 text-3xl"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleUpdate}>
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={editingPost.title}
                    onChange={(e) =>
                      setEditingPost({ ...editingPost, title: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Excerpt
                  </label>
                  <textarea
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={editingPost.excerpt}
                    onChange={(e) =>
                      setEditingPost({
                        ...editingPost,
                        excerpt: e.target.value,
                      })
                    }
                    rows="3"
                    required
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                  </label>
                  <ReactQuill
                    modules={modules}
                    formats={formats}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={editingPost.content}
                    onChange={(e) =>
                      setEditingPost({
                        ...editingPost,
                        content: e.target.value,
                      })
                    }
                    rows="6"
                    required
                  />
                </div>

                {/* Featured Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Featured Image URL
                  </label>
                  <input
                    type="url"
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={editingPost.featuredImage}
                    onChange={(e) =>
                      setEditingPost({
                        ...editingPost,
                        featuredImage: e.target.value,
                      })
                    }
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingPost(null)}
                    className="px-4 hover:cursor-pointer py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-4 py-2 hover:cursor-pointer flex items-center justify-center gap-2 rounded-lg transition ${
                      loading
                        ? "bg-indigo-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    } text-white`}
                  >
                    {loading && (
                      <svg
                        className="w-4 h-4 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
                        />
                      </svg>
                    )}
                    {loading ? "Updating..." : "Update Post"}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full"
          >
            <h3 className="text-lg font-bold text-gray-800 mb-3">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this post? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 hover:cursor-pointer text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="px-4 py-2 flex items-center hover:cursor-pointer hover:scale-105 justify-center gap-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-60"
                disabled={isDeleting}
              >
                {isDeleting && (
                  <svg
                    className="w-4 h-4 animate-spin text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 000 16v4l3.5-3.5L12 20v-4a8 8 0 01-8-8z"
                    />
                  </svg>
                )}
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
