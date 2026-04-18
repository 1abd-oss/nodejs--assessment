"use client";

import { useState,useEffect } from "react";
import { createProduct } from "@/lib/api";
import { useRouter } from "next/navigation";
export default function AddProductPage() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    cost: "",
    price: "",
    quantity: ""
  });
const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    const token = document.cookie.includes("token");

    if (!token) {
      router.push("/login");
    }
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await createProduct({
        name: form.name,
        description: form.description,
        cost: Number(form.cost),
        price: Number(form.price),
        quantity: Number(form.quantity)
      });

      if (res) {
        setMessage("Product added successfully ✅");

        setForm({
          name: "",
          description: "",
          cost: "",
          price: "",
          quantity: ""
        });
      } else {
        setError("Failed to add product ❌");
      }
    } catch (err) {
      setError("Server error ❌");
    }

    setLoading(false);
  };

  return (
    <div style={styles.page}>

      <h1 style={styles.title}>➕ Add Product</h1>

      <div style={styles.card}>

        <form onSubmit={handleSubmit} style={styles.form}>

          <input
            style={styles.input}
            placeholder="Product Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            style={styles.input}
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <input
            style={styles.input}
            type="number"
            placeholder="Cost"
            value={form.cost}
            onChange={(e) => setForm({ ...form, cost: e.target.value })}
          />

          <input
            style={styles.input}
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />

          <input
            style={styles.input}
            type="number"
            placeholder="Quantity"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          />

          <button style={styles.button} disabled={loading}>
            {loading ? "Adding..." : "Add Product"}
          </button>

        </form>

        {message && <p style={styles.success}>{message}</p>}
        {error && <p style={styles.error}>{error}</p>}

      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0a0a0a",
    color: "white",
    padding: 30,
    fontFamily: "Arial"
  },

  title: {
    marginBottom: 20,
    fontSize: 28
  },

  card: {
    background: "#111",
    padding: 20,
    borderRadius: 12,
    width: 500,
    boxShadow: "0 0 20px rgba(0,255,150,0.08)"
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12
  },

  input: {
    padding: 10,
    borderRadius: 6,
    border: "1px solid #333",
    background: "#000",
    color: "white",
    outline: "none"
  },

  button: {
    padding: 12,
    background: "#00ff99",
    color: "#000",
    fontWeight: "bold",
    border: "none",
    borderRadius: 6,
    cursor: "pointer"
  },

  success: {
    marginTop: 10,
    color: "#00ff99"
  },

  error: {
    marginTop: 10,
    color: "red"
  }
};