// utils/blog_api.js

const API_BASE_URL = 'https://blog-frontend-qjw4.onrender.com/api/v1/posts';

// Helper function to handle responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Something went wrong');
  }
  return response.json();
};

// Get all posts
export const getPosts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/get-posts`);
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

// Create a new post
export const createPost = async (postData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/create-post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};


export const getPostById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/post/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch post');
  }
  return await response.json(); // This returns the post object directly
};



export const updatePost = async (postId, updatedData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/post/update/${postId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });
    if (!response.ok) {
      throw new Error('Failed to update post');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};



export const deletePost = async (postId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/post/delete/${postId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete post');
    }
    return await response.json();
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};



export const incrementBlogView = async (blogId) => {
  try {
    const res = await fetch(`${API_BASE_URL}/increment-view/${blogId}`, {
      method: "PUT",
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to increment view count");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error incrementing blog view:", error.message);
  }
};


export const getTotalBlogViews = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/total-views`);
    if (!response.ok) {
      throw new Error('Failed to fetch total views');
    }
    const data = await response.json();
    return data.totalViews;
  } catch (error) {
    console.error('Error fetching total views:', error);
    throw error;
  }
};


export const getTotalBlogs = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/total-blogs`);
    if (!response.ok) {
      throw new Error('Failed to fetch total blogs');
    }
    const data = await response.json();
    return data.totalBlogs;
  } catch (error) {
    console.error('Error fetching total blogs:', error);
    throw error;
  }
}


export const getAverageViewsPerBlog = async () => {
  try {
    // Get both total views and total blogs in parallel
    const [totalViews, totalBlogs] = await Promise.all([
      getTotalBlogViews(),
      getTotalBlogs()
    ]);
    
    // Calculate the average
    if (totalBlogs === 0) {
      return 0; // To avoid division by zero if there are no blogs
    }
    
    const averageViews = totalViews / totalBlogs;
    return averageViews;
    
  } catch (error) {
    console.error('Error calculating average views per blog:', error);
    throw error;
  }
};



export const fetchRelatedBlogs = async (blogId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/related/${blogId}`);
    if (!response.ok) throw new Error("Failed to fetch related blogs");
    return await response.json();
  } catch (error) {
    console.error("Error fetching related blogs:", error);
    return [];
  }
};