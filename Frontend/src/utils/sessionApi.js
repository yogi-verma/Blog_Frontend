// utils/sessionApi.js

const API_BASE_URL = "http://localhost:5000/api/v1/sessions";

/**
 * Get all active sessions for the logged-in user
 * @param {string} accessToken - JWT Access Token
 */
export const getSessions = async (accessToken) => {
  const res = await fetch(`${API_BASE_URL}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch sessions");
  }

  return await res.json(); // returns an array
};

/**
 * Logout from a specific session using its refresh token
 * @param {string} refreshToken - The refresh token of the session to remove
 * @param {string} accessToken - JWT Access Token
 */
export const logoutSession = async (refreshToken, accessToken) => {
  const res = await fetch(`${API_BASE_URL}/logout-session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    throw new Error("Failed to logout from session");
  }

  return await res.json();
};

/**
 * Logout from all sessions
 * @param {string} accessToken - JWT Access Token
 */
export const logoutAllSessions = async (accessToken) => {
  const res = await fetch(`${API_BASE_URL}/logout-all`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to logout from all sessions");
  }

  return await res.json();
};
