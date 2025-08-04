const API_BASE = "https://blog-frontend-qjw4.onrender.com/api/v1/user";

// Signup user
export const signupUser = async (formData) => {
  const res = await fetch(`${API_BASE}/request-user/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formData)
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Signup failed");
  return data;
};

// Login user
export const loginUser = async (formData) => {
  const res = await fetch(`${API_BASE}/request-user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formData)
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login failed");
  return data;
};

// Get dashboard (Protected)
export const fetchDashboard = async (token) => {
    console.log("Dashboard token of Member", token);
  const res = await fetch(`${API_BASE}/request-user/dashboard`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch dashboard");
  return data;
};
