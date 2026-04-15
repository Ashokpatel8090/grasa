// src/pages/forgot-password.tsx
"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { BASE_URL } from "@/components/config/api";



const ForgotPassword = () => {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
      `${BASE_URL}/auth/forget-password?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Something went wrong");
      }

      setMessage("Reset link sent to your email.");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#c5f1ee] to-white px-2">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-xl border border-gray-100 space-y-5"
      >
        <h2 className="text-xl font-bold text-center text-gray-800">Forgot Password</h2>
        <p className="text-sm text-gray-500 text-center">
          Enter your email and we’ll send you a reset link
        </p>

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2ddfba] outline-none"
        />

        {message && <p className="text-green-600 text-sm text-center">{message}</p>}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-full font-semibold transition-all ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#1072b9] hover:bg-[#1053b9] text-white"
          }`}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <div className="text-center text-sm text-gray-500">
          Back to{" "}
          <Link href="/login" className="text-[#1072b9] font-semibold hover:underline">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
