// src/utils/aiApi.js

const API_BASE_URL = "https://blog-frontend-qjw4.onrender.com/api/v1/ai"; // Adjust if needed

export const generateBlogMeta = async (blogContent) => {
  try {
    const res = await fetch(`${API_BASE_URL}/generate-meta`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ blogContent }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to generate blog meta");
    }

    const data = await res.json();
    return data; // { titles: [...], metaDescription: "...", seoTags: [...] }
  } catch (error) {
    console.error("Error generating blog meta:", error.message);
    throw error;
  }
};



export const getTrendIdeas = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/trend/generate`);
    if (!res.ok) throw new Error("Failed to fetch trend ideas");
    const data = await res.json();
    return data.blogTopics;
  } catch (err) {
    console.error("AI fetch error:", err);
    return [];
  }
};
