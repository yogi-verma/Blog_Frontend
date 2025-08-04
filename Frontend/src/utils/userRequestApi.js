// utils/userRequestApi.js

const API_BASE_URL = "http://localhost:5000/api/v1/requests";

export const submitUserRequest = async (formData) => {
  try {
    const res = await fetch(`${API_BASE_URL}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    return await res.json();
  } catch (err) {
    return { error: "Network error" };
  }
};

export const verifyUserOtp = async ({ email, otp }) => {
  try {
    const res = await fetch(`${API_BASE_URL}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    return await res.json();
  } catch (err) {
    return { error: "Network error" };
  }
};


export const getAllUsers = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/all-users`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching users:", err);
    return { error: "Network error" };
  }
};