// components/RelatedBlogs.jsx
import { useEffect, useState } from "react";
import { fetchRelatedBlogs } from "../utils/blog_api";
import { Link, useLocation } from "react-router-dom";

const RelatedBlogs = ({ blogId }) => {
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  const location = useLocation();

  useEffect(() => {
    // Scroll to top when path changes (navigating to new blog)
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  useEffect(() => {
    const getRelated = async () => {
      const blogs = await fetchRelatedBlogs(blogId);
      setRelatedBlogs(blogs);
    };
    getRelated();
  }, [blogId]);

  if (relatedBlogs.length === 0) return null;

  return (
    <div className="mt-2">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Related Posts💫
      </h2>

      <div
        className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto pr-2"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#c3bffc #F4F3FF",
        }}
      >
        {relatedBlogs.map((related) => (
          <div
            key={related._id}
            className="bg-[#F4F3FF] hover:bg-[#edeaff] transition-colors duration-300 rounded-xl shadow-sm hover:shadow-md border border-indigo-100 p-5 flex flex-col justify-between"
          >
            <h3 className="text-sm font-semibold text-indigo-900 mb-2">
              {related.title}
            </h3>

            <Link
              to={`/post/${related._id}`}
              className="text-indigo-600 text-xs font-medium hover:underline"
            >
              Read More →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedBlogs;
