import { useState } from "react";
import { generateBlogMeta } from "../utils/aiApi";

const GenerateMetaButton = () => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState(null);

  const handleGenerate = async () => {
    if (!content.trim()) return alert("Enter blog content first");
    setLoading(true);
    try {
      const result = await generateBlogMeta(content);
      setMeta(result);
    } catch (e) {
      alert("Generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-2xl mx-auto">
      {/* Textarea */}
      <textarea
        className="w-full h-44 p-4 bg-white/80 dark:bg-gray-800/70 backdrop-blur-md border border-gray-300 dark:border-gray-600 rounded-xl shadow-inner text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="✍️ Paste your blog content here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={loading}
        className={`w-full py-3 font-semibold text-lg text-white rounded-xl shadow-lg transition-all duration-300 ${
          loading
            ? "bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 cursor-not-allowed"
            : "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-green-500 hover:to-yellow-500"
        }`}
      >
        {loading ? "⏳ Generating..." : "🚀 Generate Blog Meta"}
      </button>

      {/* Result Display */}
      {meta && (
        <div className="bg-white/80 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700 p-6 rounded-xl shadow-lg text-gray-800 dark:text-gray-200 space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">📌 Suggested Titles</h3>
            <ul className="list-disc list-inside space-y-1">
              {meta.titles.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-1">📝 Meta Description</h3>
            <p>{meta.metaDescription}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-1">🏷️ SEO Tags</h3>
            <div className="flex flex-wrap gap-2">
              {meta.seoTags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm shadow"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateMetaButton;
