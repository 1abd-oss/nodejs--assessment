"use client";

import { useState } from "react";
import { signup } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  document.cookie = "token=YOUR_JWT; path=/";
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await signup(form);

    if (res.token) {
      localStorage.setItem("token", res.token);
      router.push("/dashboard");
    } else {
      setError(res.message || "Signup failed");
    }
  };

  return (
    <div className="flex h-screen">

      {/* Left Side */}
      <div className="hidden md:flex w-1/2 bg-green-600 text-white items-center justify-center">
        <div className="text-center px-10">
          <h1 className="text-4xl font-bold mb-4">Join Us 🚀</h1>
          <p className="text-lg opacity-80">
            Create an account to manage your inventory بسهولة.
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gray-100">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-lg w-96"
        >
          <h2 className="text-2xl font-bold mb-6 text-black text-center">Signup</h2>

          {error && (
            <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
          )}

          <input
            type="text"
            placeholder="First Name"
            className="w-full mb-2 p-3 border text-black rounded focus:ring-2 focus:ring-green-400"
            onChange={(e) =>
              setForm({ ...form, firstname: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Last Name"
            className="w-full mb-2 p-3 border text-black rounded focus:ring-2 focus:ring-green-400"
            onChange={(e) =>
              setForm({ ...form, lastname: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Username"
            className="w-full mb-2 p-3 border text-black rounded focus:ring-2 focus:ring-green-400"
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full mb-4 p-3 border rounded text-black focus:ring-2 focus:ring-green-400"
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <button className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700 transition">
            Signup
          </button>

          <p className="text-center text-black mt-4 text-sm">
            Already have an account?{" "}
            <span
              onClick={() => router.push("/login")}
              className="text-green-600 cursor-pointer"
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}