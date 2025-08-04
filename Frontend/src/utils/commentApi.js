const API_BASE_URL = "https://blog-frontend-qjw4.onrender.com/api/v1/comments";

// 1. Submit a new comment (no auth)
export const submitComment = async (postId, commentData) => {
  try {
    const res = await fetch(`${API_BASE_URL}/${postId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commentData),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to submit comment");

    return data;
  } catch (err) {
    console.error("submitComment error:", err.message);
    throw err;
  }
};

// 2. Get pending comments (admin only)
export const getPendingComments = async (token) => {
  try {
    const res = await fetch(`${API_BASE_URL}/pending-comments`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to fetch pending comments");

    return data.pendingComments;
  } catch (err) {
    console.error("getPendingComments error:", err.message);
    throw err;
  }
};

// 3. Get approved comments (no auth)
export const getApprovedComments = async (postId) => {
  try {
    const res = await fetch(`${API_BASE_URL}/approved-comments/${postId}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to fetch approved comments");

    return data.approvedComments;
  } catch (err) {
    console.error("getApprovedComments error:", err.message);
    throw err;
  }
};

// 4. Approve comment (admin only)
export const approveComment = async (postId, commentId, token) => {
  try {
    const res = await fetch(`${API_BASE_URL}/approve/${postId}/${commentId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to approve comment");

    return data;
  } catch (err) {
    console.error("approveComment error:", err.message);
    throw err;
  }
};

// 5. Reject comment (admin only)
export const rejectComment = async (postId, commentId, token) => {
  try {
    const res = await fetch(`${API_BASE_URL}/reject/${postId}/${commentId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to reject comment");

    return data;
  } catch (err) {
    console.error("rejectComment error:", err.message);
    throw err;
  }
};


export const totalComments = async (token) => {
  try {
    const res = await fetch(`${API_BASE_URL}/total-comments`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ Include Bearer token
      },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to fetch total comments");

    return data.totalComments;
  } catch (err) {
    console.error("totalComments error:", err.message);
    throw err;
  }
};
