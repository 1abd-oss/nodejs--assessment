const API_URL = process.env.NEXT_PUBLIC_API_URL;

// 🔐 token helper
const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

// =======================
// AUTH
// =======================

export const signup = async (data) => {
  const res = await fetch(`${API_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
};

export const login = async (data) => {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
};

// =======================
// PRODUCTS (FIXED)
// =======================

// 📦 GET PRODUCTS (NOW SUPPORTS QUERY)
export const getProducts = async (query = "") => {
  const res = await fetch(
    `${API_URL}/api/products${query}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return res.json();
};

// ➕ CREATE
export const createProduct = async (data) => {
  const res = await fetch(`${API_URL}/api/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

// ✏️ UPDATE
export const updateProduct = async (id, data) => {
  const res = await fetch(`${API_URL}/api/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

// ❌ DELETE
export const deleteProduct = async (id) => {
  const res = await fetch(`${API_URL}/api/products/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.json();
};
export const getInventoryHistory = async () => {
  const res = await fetch(`${API_URL}/api/inventory`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.json();
};