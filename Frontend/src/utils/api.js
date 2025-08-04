const API_BASE_URL = 'https://blog-frontend-qjw4.onrender.com/api/v1/auth';

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Helper to handle response
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
    throw new Error(data.message || 'An error occurred');
  }
  return data;
};

// Login
export const login = async (credentials) => {
  const res = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const responseData = await handleResponse(res);

  if (responseData?.data?.accessToken && responseData?.data?.refreshToken) {
    localStorage.setItem('accessToken', responseData.data.accessToken);
    localStorage.setItem('refreshToken', responseData.data.refreshToken);
  }

  return responseData;
};


// Signup
export const signup = async (userData) => {
  const res = await fetch(`${API_BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const responseData = await handleResponse(res);

  if (responseData?.data?.token) {
    setAuthToken(responseData.data.token);
  }

  return responseData;
};

// Get Dashboard
export const getDashboard = async () => {
  const token = localStorage.getItem('token');
  console.log('Dashboard Token of Admin :', token);

  if (!token) {
    throw new Error('Unauthorized: No token found');
  }

  const res = await fetch(`${API_BASE_URL}/dashboard`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  return await handleResponse(res);
};

// Verify Auth
export const verifyAuth = async () => {
  const token = localStorage.getItem('token');

  const res = await fetch(`${API_BASE_URL}/verify-auth`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // ✅ token must be sent
    },
  });

  return await handleResponse(res);
};

// Update Password
export const updatePassword = async (username, oldPassword, newPassword) => {
  const res = await fetch(`${API_BASE_URL}/update-password`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ username, oldPassword, newPassword }),
  });

  return await handleResponse(res);
};

// Delete Account
export const deleteAccount = async () => {
  const res = await fetch(`${API_BASE_URL}/delete-account`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  const data = await handleResponse(res);
  setAuthToken(null);
  return data;
};

// Logout
export const logout = () => {
  localStorage.removeItem('token');
  return { success: true, message: 'Logged out successfully' };
};

// Set Auth Token
export const setAuthToken = (token) => {
  
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};


