
// "use client";

// import { useState, useEffect, FormEvent } from "react";
// import axios from "axios";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Eye, EyeOff } from "lucide-react";

// import { BASE_URL } from "@/lib/api";

// /* ===================== TYPES ===================== */
// interface JWTPayload {
//   sub?: string | number;
//   id?: string | number;
//   role?: string | number;
//   role_id?: string | number;
// }

// /* ===================== JWT DECODE ===================== */
// const decodeToken = (token: string): JWTPayload => {
//   try {
//     const base64Url = token.split(".")[1];
//     if (!base64Url) return {};
//     const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//     return JSON.parse(
//       decodeURIComponent(
//         atob(base64)
//           .split("")
//           .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
//           .join("")
//       )
//     );
//   } catch {
//     return {};
//   }
// };

// /* ===================== COOKIE UTILS ===================== */
// const setCookie = (name: string, value: string, days = 7) => {
//   const expires = new Date(Date.now() + days * 86400000).toUTCString();
//   document.cookie = `${name}=${value}; expires=${expires}; path=/`;
// };

// export default function Login() {
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   /* ===================== REDIRECT HANDLING ===================== */
//   const previousPage =
//     typeof window !== "undefined"
//       ? new URLSearchParams(window.location.search).get("redirect") || "/"
//       : "/";

//   const navigateTo = (path: string) => {
//     window.location.href = path;
//   };

//   /* ===================== LOAD GOOGLE SCRIPT ===================== */
//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src = "https://accounts.google.com/gsi/client";
//     script.async = true;
//     script.defer = true;

//     document.body.appendChild(script);

//     script.onload = () => {
//       // @ts-ignore
//       window.google.accounts.id.initialize({
//         client_id:
//           "646757948054-vacp5dt2p3c3eg1d1i5cc85ac8pa3jug.apps.googleusercontent.com",
//         callback: handleGoogleResponse,
//       });

//       // @ts-ignore
//       window.google.accounts.id.renderButton(
//         document.getElementById("googleSignInDiv"),
//         { theme: "outline", size: "large", width: "100%" }
//       );
//     };

//     return () => {
//       script.remove();
//     };
//   }, []);

//   /* ===================== GOOGLE LOGIN ===================== */
//   const handleGoogleResponse = async (response: any) => {
//     const idToken = response?.credential;
//     if (!idToken) return;

//     try {
//       setLoading(true);

//       const res = await axios.post(
//             `${BASE_URL}/users/google-login`,
//             { gid_token: idToken }
//         );

//       const data = res.data;

//       const token =
//         data.access_token ||
//         data.token ||
//         data.data?.token ||
//         data.user?.token;

//       handleLoginSuccess(token, data.user, {
//         balance_available: data.balance_available ?? 0,
//         balance_pending: data.balance_pending ?? 0,
//         lifetime_earnings: data.lifetime_earnings ?? 0,
//       });
//     } catch {
//       setError("Google login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ===================== EMAIL/PASSWORD LOGIN ===================== */
//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       const res = await axios.post(
//             `${BASE_URL}/users/login`,
//             formData
//         );

//       const data = res.data;

//       const token =
//         data.access_token ||
//         data.token ||
//         data.data?.token ||
//         data.user?.token;

//       handleLoginSuccess(token, data.user, {
//         balance_available: data.balance_available,
//         balance_pending: data.balance_pending,
//         lifetime_earnings: data.lifetime_earnings,
//       });
//     } catch {
//       setError("Invalid email or password");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ===================== LOGIN SUCCESS HANDLER ===================== */
//   const handleLoginSuccess = (
//     token: string,
//     userObj: any,
//     balances?: {
//       balance_available?: number;
//       balance_pending?: number;
//       lifetime_earnings?: number;
//     }
//   ) => {
//     const decoded = decodeToken(token);

//     const userId = decoded.sub || decoded.id || userObj?.id;
//     const roleValue = decoded.role || decoded.role_id || userObj?.role_id;

//     const userRole =
//       {
//         1: "Patient",
//         2: "Doctor",
//         4: "Other",
//         5: "Channel-partner",
//         6: "Nutritionist",
//       }[Number(roleValue)] || "Unknown";

//     /* ===== SAVE AUTH DATA ===== */
//     setCookie("token", token);
//     setCookie("user", encodeURIComponent(JSON.stringify(userObj)));
//     setCookie("user_id", String(userId));
//     setCookie("user_role", String(userRole));

//     /* ===== SAVE BALANCE DATA ===== */
//     setCookie(
//       "balance_available",
//       String(balances?.balance_available ?? 0)
//     );
//     setCookie(
//       "balance_pending",
//       String(balances?.balance_pending ?? 0)
//     );
//     setCookie(
//       "lifetime_earnings",
//       String(balances?.lifetime_earnings ?? 0)
//     );

//     navigateTo(previousPage);
//   };

//   /* ===================== UI ===================== */
//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-50">
//       <Card className="w-full max-w-md shadow-xl rounded-2xl border border-gray-200">
//         <CardHeader>
//           <CardTitle className="text-3xl font-bold text-center">
//             Secure Login
//           </CardTitle>
//         </CardHeader>

//         <CardContent className="p-8">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <Input
//               type="email"
//               placeholder="Email"
//               value={formData.email}
//               onChange={(e) =>
//                 setFormData({ ...formData, email: e.target.value })
//               }
//               required
//               className="h-12"
//             />

//             <div className="relative">
//               <Input
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Password"
//                 value={formData.password}
//                 onChange={(e) =>
//                   setFormData({ ...formData, password: e.target.value })
//                 }
//                 required
//                 className="h-12 pr-12"
//               />

//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-1/2 -translate-y-1/2"
//               >
//                 {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//               </button>
//             </div>

//             <div className="text-right">
//               <a
//                 href="/reset-password"
//                 className="text-sm text-blue-600 font-medium"
//               >
//                 Forgot Password?
//               </a>
//             </div>

//             {error && <p className="text-red-600 text-sm">{error}</p>}

//             <Button
//               type="submit"
//               disabled={loading}
//               className="w-full h-12 bg-gray-800 hover:bg-gray-900"
//             >
//               {loading ? "Processing..." : "Login"}
//             </Button>
//           </form>

//           <div className="my-2 text-center">
//             <p className="text-gray-600 text-sm">or</p>
//             <div
//               id="googleSignInDiv"
//               className="flex justify-center mt-2"
//             ></div>
//           </div>

//           <p className="mt-6 text-center text-md text-gray-600">
//             Don’t have an account?{" "}
//             <a href="/signup" className="text-blue-600 font-semibold">
//               Sign Up
//             </a>
//           </p>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }












"use client";

import { useState, useEffect, FormEvent } from "react";
import axios from "axios";
// Keeping your UI imports, but we will heavily style them to match the new theme
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

  /* ===================== LOGIN SUCCESS HANDLER ===================== */
  // Moved ABOVE the submit handlers to fix initialization scoping issues
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

  /* ===================== UI ===================== */
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#ebecdf] px-4 py-4">
      <Card className="w-full max-w-[450px] bg-[#f4f4f2] shadow-sm rounded-xl border border-[#d6d1c4] overflow-hidden">
        <CardHeader className=" pt-2">
          <CardTitle className="text-[34px] leading-[40px] font-bold text-[#1b1b1b] text-center">
            Welcome Back
          </CardTitle>
          <p className="text-[#5c5c5c] text-center text-sm mt-1">
            Log in to access your GRASA account
          </p>
        </CardHeader>

        <CardContent className="p-8 pt-4">
          <form onSubmit={handleSubmit} className="space-y-2">
            <div>
              <Input
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="h-[50px] border border-[#d6d1c4] rounded-lg px-4 w-full bg-white text-[#1b1b1b] placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1b1b1b] focus-visible:ring-offset-0"
              />
            </div>

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                className="h-[50px] border border-[#d6d1c4] rounded-lg px-4 pr-12 w-full bg-white text-[#1b1b1b] placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1b1b1b] focus-visible:ring-offset-0"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5c5c5c] hover:text-[#1b1b1b] transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="flex justify-end pt-1">
              <a
                href="/reset-password"
                className="text-sm text-[#1b1b1b] font-bold hover:underline"
              >
                Forgot Password?
              </a>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-md text-center">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-[52px] bg-[#C5D82D] text-[#1b1b1b] text-lg rounded-md font-bold hover:bg-[#b8cc28] hover:opacity-90 transition disabled:opacity-50 mt-2"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#d6d1c4]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-[#f4f4f2] text-[#5c5c5c] uppercase tracking-wider font-semibold text-[11px]">
                Or continue with
              </span>
            </div>
          </div>

          <div
            id="googleSignInDiv"
            className="flex justify-center w-full min-h-[40px]"
          ></div>

          <p className="mt-4 text-center text-sm text-[#5c5c5c]">
            Don’t have an account?{" "}
            <a href="/signup" className="text-[#1b1b1b] font-bold hover:underline">
              Sign Up
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}