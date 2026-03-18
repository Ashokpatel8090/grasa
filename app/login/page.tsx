
"use client";

import { useState, useEffect, FormEvent } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

import { BASE_URL } from "@/lib/api";

/* ===================== TYPES ===================== */
interface JWTPayload {
  sub?: string | number;
  id?: string | number;
  role?: string | number;
  role_id?: string | number;
}

/* ===================== JWT DECODE ===================== */
const decodeToken = (token: string): JWTPayload => {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return {};
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(
      decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      )
    );
  } catch {
    return {};
  }
};

/* ===================== COOKIE UTILS ===================== */
const setCookie = (name: string, value: string, days = 7) => {
  const expires = new Date(Date.now() + days * 86400000).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
};

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  /* ===================== REDIRECT HANDLING ===================== */
  const previousPage =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("redirect") || "/"
      : "/";

  const navigateTo = (path: string) => {
    window.location.href = path;
  };

  /* ===================== LOAD GOOGLE SCRIPT ===================== */
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;

    document.body.appendChild(script);

    script.onload = () => {
      // @ts-ignore
      window.google.accounts.id.initialize({
        client_id:
          "646757948054-vacp5dt2p3c3eg1d1i5cc85ac8pa3jug.apps.googleusercontent.com",
        callback: handleGoogleResponse,
      });

      // @ts-ignore
      window.google.accounts.id.renderButton(
        document.getElementById("googleSignInDiv"),
        { theme: "outline", size: "large", width: "100%" }
      );
    };

    return () => {
      script.remove();
    };
  }, []);

  /* ===================== GOOGLE LOGIN ===================== */
  const handleGoogleResponse = async (response: any) => {
    const idToken = response?.credential;
    if (!idToken) return;

    try {
      setLoading(true);

      const res = await axios.post(
            `${BASE_URL}/users/google-login`,
            { gid_token: idToken }
        );

      const data = res.data;

      const token =
        data.access_token ||
        data.token ||
        data.data?.token ||
        data.user?.token;

      handleLoginSuccess(token, data.user, {
        balance_available: data.balance_available ?? 0,
        balance_pending: data.balance_pending ?? 0,
        lifetime_earnings: data.lifetime_earnings ?? 0,
      });
    } catch {
      setError("Google login failed");
    } finally {
      setLoading(false);
    }
  };

  /* ===================== EMAIL/PASSWORD LOGIN ===================== */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
            `${BASE_URL}/users/login`,
            formData
        );

      const data = res.data;

      const token =
        data.access_token ||
        data.token ||
        data.data?.token ||
        data.user?.token;

      handleLoginSuccess(token, data.user, {
        balance_available: data.balance_available,
        balance_pending: data.balance_pending,
        lifetime_earnings: data.lifetime_earnings,
      });
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  /* ===================== LOGIN SUCCESS HANDLER ===================== */
  const handleLoginSuccess = (
    token: string,
    userObj: any,
    balances?: {
      balance_available?: number;
      balance_pending?: number;
      lifetime_earnings?: number;
    }
  ) => {
    const decoded = decodeToken(token);

    const userId = decoded.sub || decoded.id || userObj?.id;
    const roleValue = decoded.role || decoded.role_id || userObj?.role_id;

    const userRole =
      {
        1: "Patient",
        2: "Doctor",
        4: "Other",
        5: "Channel-partner",
        6: "Nutritionist",
      }[Number(roleValue)] || "Unknown";

    /* ===== SAVE AUTH DATA ===== */
    setCookie("token", token);
    setCookie("user", encodeURIComponent(JSON.stringify(userObj)));
    setCookie("user_id", String(userId));
    setCookie("user_role", String(userRole));

    /* ===== SAVE BALANCE DATA ===== */
    setCookie(
      "balance_available",
      String(balances?.balance_available ?? 0)
    );
    setCookie(
      "balance_pending",
      String(balances?.balance_pending ?? 0)
    );
    setCookie(
      "lifetime_earnings",
      String(balances?.lifetime_earnings ?? 0)
    );

    navigateTo(previousPage);
  };

  /* ===================== UI ===================== */
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md shadow-xl rounded-2xl border border-gray-200">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            Secure Login
          </CardTitle>
        </CardHeader>

        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              className="h-12"
            />

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                className="h-12 pr-12"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="text-right">
              <a
                href="/reset-password"
                className="text-sm text-blue-600 font-medium"
              >
                Forgot Password?
              </a>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gray-800 hover:bg-gray-900"
            >
              {loading ? "Processing..." : "Login"}
            </Button>
          </form>

          <div className="my-2 text-center">
            <p className="text-gray-600 text-sm">or</p>
            <div
              id="googleSignInDiv"
              className="flex justify-center mt-2"
            ></div>
          </div>

          <p className="mt-6 text-center text-md text-gray-600">
            Don’t have an account?{" "}
            <a href="/signup" className="text-blue-600 font-semibold">
              Sign Up
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
