"use client";

import { useState,useEffect } from "react";
import { login } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  useEffect(() => {
  document.cookie = "token=YOUR_JWT; path=/";
}, []);
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  const res = await login(form);

  if (res.token) {
    localStorage.setItem("token", res.token);
    router.push("/dashboard");
  } else {
    setError(res.message || "Login failed");
  }
};

  return (
    <div className="flex h-screen">
      
      {/* Left Side */}
      <div className="hidden md:flex w-1/2 bg-red-600 text-white items-center justify-center">
        <div className="text-center px-10">
          <h1 className="text-4xl font-bold mb-4">Welcome Back 👋</h1>
          <p className="text-lg opacity-80">
            Login to manage your products and track your inventory.
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gray-100">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-lg w-96"
        >
          <h2 className="text-2xl font-bold bg-red-600 text-white p-3 rounded mb-6 text-center">Login</h2>

          {error && (
            <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
          )}

          <input
            type="text"
            placeholder="Username"
            className="w-full mb-3 p-3 border rounded focus:outline-none text-black focus:ring-2 focus:ring-red-400"
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
          />

          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-3 border rounded focus:outline-none text-black focus:ring-2 focus:ring-red-400"
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 cursor-pointer text-sm text-gray-500"
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

          <button className="w-full bg-red-600 text-white p-3 rounded hover:bg-red-800 transition">
            Login
          </button>

          <p className="text-center mt-4 text-black text-sm">
            Don’t have an account?{" "}
            <span
              onClick={() => router.push("/signup")}
              className="text-red-600 cursor-pointer"
            >
              Signup
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}