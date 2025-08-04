import { useEffect, useState } from "react";
import { getApprovedComments } from "../utils/commentApi";
import { FiUser } from "react-icons/fi";

const CommentsSection = ({ postId, darkMode }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await getApprovedComments(postId);
        setComments(data);
      } catch (err) {
        console.error("Error loading comments:", err.message);
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchComments();
    }
  }, [postId]);

  return (
    <div className="mt-6 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-indigo-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800 pr-2">
      {loading ? (
        <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
          Loading comments...
        </p>
      ) : comments.length > 0 ? (
        comments.map((comment) => (
          <div
            key={comment._id}
            className={`rounded-xl p-5 shadow-md transition-all duration-300 border mb-4 ${
              darkMode
                ? "bg-[#1f2937] border-gray-700 text-gray-200"
                : "bg-white border-gray-200 text-gray-800"
            }`}
          >
            <div className="flex items-center gap-4 mb-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-xl font-semibold ${
                  darkMode
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <FiUser />
              </div>
              <div>
                <p className="font-medium text-base">{comment.name}</p>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {new Date(comment.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
            <p
              className={`text-sm leading-relaxed ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {comment.text}
            </p>
          </div>
        ))
      ) : (
        <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
          No comments yet. Be the first to comment!
        </p>
      )}
    </div>
  );
};

export default CommentsSection;
