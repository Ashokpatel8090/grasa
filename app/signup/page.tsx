
// "use client";

// import { useState, useEffect, ChangeEvent, FormEvent } from "react";
// import axios from "axios";
// import Link from "next/link";
// // router.push hata diya gaya hai taaki hum hard redirect kar sakein
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";

// import { BASE_URL } from "@/lib/api";

// // ---------------- COOKIE SETTER ----------------
// const setCookie = (name: string, value: string, days = 7) => {
//   const expires = new Date(Date.now() + days * 86400000).toUTCString();
//   document.cookie = `${name}=${value};expires=${expires};path=/;SameSite=Lax`;
// };

// // ---------------- JWT DECODE ----------------
// interface JWTPayload {
//   sub?: string | number;
//   id?: string | number;
//   role?: string | number;
//   role_id?: string | number;
// }

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

// // ---------------- FORM TYPE ----------------
// interface SignupForm {
//   full_name: string;
//   email: string;
//   phone: string;
//   password: string;
//   confirm_password: string;
//   referral_code: string;
// }

// export default function Signup() {
//   const previousPage =
//     typeof window !== "undefined"
//       ? new URLSearchParams(window.location.search).get("redirect") || "/"
//       : "/";

//   const navigateTo = (path: string) => {
//     window.location.href = path; // Hard redirect like the Login page
//   };

//   const [formData, setFormData] = useState<SignupForm>({
//     full_name: "",
//     email: "",
//     phone: "",
//     password: "",
//     confirm_password: "",
//     referral_code: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const [gidToken, setGidToken] = useState<string | null>(null);
//   const [showExtraFields, setShowExtraFields] = useState(false);

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   /* ===================== LOGIN SUCCESS HANDLER ===================== */
//   // Yeh function bilkul Login page jaisa banaya gaya hai taaki cookies sync rahein
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
//     if (userObj) {
//       setCookie("user", encodeURIComponent(JSON.stringify(userObj)));
//     }
//     setCookie("user_id", String(userId));
//     setCookie("user_role", String(userRole));

//     /* ===== SAVE BALANCE DATA (If provided by API) ===== */
//     setCookie("balance_available", String(balances?.balance_available ?? 0));
//     setCookie("balance_pending", String(balances?.balance_pending ?? 0));
//     setCookie("lifetime_earnings", String(balances?.lifetime_earnings ?? 0));

//     setSuccess("Signup & Login successful! Redirecting...");

//     // Thoda delay taaki user success message dekh sake
//     setTimeout(() => navigateTo(previousPage), 1000);
//   };

//   // ---------------- NORMAL SIGNUP ----------------
//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");
//     setLoading(true);

//     if (formData.password !== formData.confirm_password) {
//       setError("Passwords do not match");
//       setLoading(false);
//       return;
//     }

//     try {
//       // STEP 1: Registration
//       const payload = {
//         full_name: formData.full_name,
//         email: formData.email,
//         phone: formData.phone,
//         password: formData.password,
//         confirm_password: formData.confirm_password,
//         role_id: 1,
//         referral_code: formData.referral_code || "",
//         user_type: "WebApp",
//       };

//       const res = await axios.post(`${BASE_URL}/users/register`, payload);

//       if (res.status !== 201 && res.status !== 200) {
//         setError(res.data?.message || "Registration failed");
//         setLoading(false);
//         return;
//       }

//       // STEP 2: Background Auto-Login
//       const loginRes = await axios.post(`${BASE_URL}/users/login`, {
//         email: formData.email,
//         password: formData.password,
//       });

//       const data = loginRes.data;
//       const token =
//         data.access_token ||
//         data.token ||
//         data.data?.token ||
//         data.user?.token;

//       if (!token) {
//         setError("Signup successful but background login failed. Please log in manually.");
//         setLoading(false);
//         return;
//       }

//       // Login handler call karna (Same as Login Page)
//       handleLoginSuccess(token, data.user, {
//         balance_available: data.balance_available,
//         balance_pending: data.balance_pending,
//         lifetime_earnings: data.lifetime_earnings,
//       });

//     } catch (err: any) {
//       console.error(err);
//       if (err.response?.status === 409)
//         setError("User already exists. Try logging in.");
//       else setError(err.response?.data?.message || "Signup failed.");
//       setLoading(false);
//     }
//   };

//   // ---------------- GOOGLE FIRST STEP ----------------
//   const handleGoogleSignup = (response: any) => {
//     const token = response?.credential;
//     if (!token) {
//       setError("Google signup failed.");
//       return;
//     }
//     setGidToken(token);
//     setShowExtraFields(true);
//   };

//   // ---------------- GOOGLE FINAL SUBMIT ----------------
//   const handleGoogleFormSubmit = async (e: FormEvent) => {
//     e.preventDefault();

//     if (!gidToken) return;
//     setError("");
//     setSuccess("");
//     setLoading(true);

//     try {
//       // STEP 1: Register the Google User
//       await axios.post(`${BASE_URL}/users/google-login`, {
//         gid_token: gidToken,
//         phone: formData.phone,
//         role_id: 1,
//         referral_code: formData.referral_code || "",
//       });

//       // STEP 2: Background Auto-Login for Google
//       const loginRes = await axios.post(`${BASE_URL}/users/google-login`, {
//         gid_token: gidToken,
//       });

//       const data = loginRes.data;
//       const token =
//         data.access_token ||
//         data.token ||
//         data.data?.token ||
//         data.user?.token;

//       if (!token) {
//         setError("Google signup completed but auto-login failed. Please log in manually.");
//         setLoading(false);
//         return;
//       }

//       // Login handler call karna (Same as Login Page)
//       handleLoginSuccess(token, data.user, {
//         balance_available: data.balance_available,
//         balance_pending: data.balance_pending,
//         lifetime_earnings: data.lifetime_earnings,
//       });

//     } catch (err: any) {
//       console.error("Google Signup Error:", err);
//       setError(err.response?.data?.message || "Google signup failed.");
//       setLoading(false);
//     }
//   };

//   // ---------------- LOAD GOOGLE SCRIPT ----------------
//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src = "https://accounts.google.com/gsi/client";
//     script.async = true;
//     script.defer = true;
//     document.body.appendChild(script);

//     script.onload = () => {
//       // @ts-ignore
//       window.google.accounts.id.initialize({
//         client_id: "646757948054-vacp5dt2p3c3eg1d1i5cc85ac8pa3jug.apps.googleusercontent.com",
//         callback: handleGoogleSignup,
//       });

//       // @ts-ignore
//       window.google.accounts.id.renderButton(
//         document.getElementById("googleSignupDiv"),
//         { theme: "outline", size: "large", width: "100%" }
//       );
//     };

//     return () => {
//       document.body.removeChild(script);
//     };
//   }, []);

//   // ---------------- UI ----------------
//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-emerald-50 to-white">
//       <Card className="w-full max-w-md shadow-lg border border-emerald-100 rounded-2xl">
//         <CardHeader>
//           <CardTitle className="text-3xl font-bold text-center text-gray-800">
//             Sign Up
//           </CardTitle>
//         </CardHeader>

//         <CardContent>
//           {/* NORMAL SIGNUP */}
//           {!showExtraFields && (
//             <>
//               <form onSubmit={handleSubmit} className="space-y-3">
//                 <Input
//                   name="full_name"
//                   placeholder="Full Name"
//                   value={formData.full_name}
//                   onChange={handleChange}
//                   required
//                 />

//                 <Input
//                   type="email"
//                   name="email"
//                   placeholder="Email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   required
//                 />

//                 <Input
//                   name="phone"
//                   placeholder="Phone Number"
//                   value={formData.phone}
//                   onChange={handleChange}
//                   required
//                 />

//                 <Input
//                   type="password"
//                   name="password"
//                   placeholder="Password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   required
//                 />

//                 <Input
//                   type="password"
//                   name="confirm_password"
//                   placeholder="Confirm Password"
//                   value={formData.confirm_password}
//                   onChange={handleChange}
//                   required
//                 />

//                 <Input
//                   name="referral_code"
//                   placeholder="Referral Code (optional)"
//                   value={formData.referral_code}
//                   onChange={handleChange}
//                 />

//                 <div className="flex justify-end -mt-2">
//                   <Link
//                     href="/forgot-password"
//                     className="text-sm text-blue-600 hover:text-blue-800 font-medium"
//                   >
//                     Forgot Password?
//                   </Link>
//                 </div>

//                 {error && <p className="text-red-600 text-sm">{error}</p>}
//                 {success && <p className="text-green-600 text-sm font-medium">{success}</p>}

//                 <Button
//                   type="submit"
//                   className="w-full h-12 bg-gray-800 hover:bg-gray-900 text-lg font-semibold"
//                   disabled={loading}
//                 >
//                   {loading ? "Registering..." : "Sign Up"}
//                 </Button>
//               </form>

//               <div className="mt-3 text-center">
//                 <p className="text-gray-600 text-sm mb-2">or</p>
//                 <div id="googleSignupDiv" className="flex justify-center"></div>
//               </div>
//             </>
//           )}

//           {/* GOOGLE EXTRA FIELDS */}
//           {showExtraFields && (
//             <form onSubmit={handleGoogleFormSubmit} className="space-y-3">
//               <p className="text-center text-gray-700 mb-3">
//                 Complete signup with additional details:
//               </p>

//               <Input
//                 name="phone"
//                 placeholder="Phone Number"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 required
//               />

//               <Input
//                 name="referral_code"
//                 placeholder="Referral Code (optional)"
//                 value={formData.referral_code}
//                 onChange={handleChange}
//               />

//               {error && <p className="text-red-600 text-sm">{error}</p>}
//               {success && <p className="text-green-600 text-sm font-medium">{success}</p>}

//               <Button
//                 type="submit"
//                 className="w-full bg-emerald-700 hover:bg-emerald-800"
//                 disabled={loading}
//               >
//                 {loading ? "Registering..." : "Complete Signup"}
//               </Button>
//             </form>
//           )}
//         </CardContent>

//         <div className="text-center pb-4">
//           <p className="text-gray-600">
//             Already have an account?{" "}
//             <Link href="/login" className="text-blue-600 font-semibold">
//               Login
//             </Link>
//           </p>
//         </div>
//       </Card>
//     </div>
//   );
// }









"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

import { BASE_URL } from "@/lib/api";

// ---------------- COOKIE SETTER ----------------
const setCookie = (name: string, value: string, days = 7) => {
  const expires = new Date(Date.now() + days * 86400000).toUTCString();
  document.cookie = `${name}=${value};expires=${expires};path=/;SameSite=Lax`;
};

// ---------------- JWT DECODE ----------------
interface JWTPayload {
  sub?: string | number;
  id?: string | number;
  role?: string | number;
  role_id?: string | number;
}

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

// ---------------- FORM TYPE ----------------
interface SignupForm {
  full_name: string;
  email: string;
  phone: string;
  password: string;
  confirm_password: string;
  referral_code: string;
}

export default function Signup() {
  const previousPage =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("redirect") || "/"
      : "/";

  const navigateTo = (path: string) => {
    window.location.href = path; // Hard redirect like the Login page
  };

  const [formData, setFormData] = useState<SignupForm>({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
    referral_code: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [gidToken, setGidToken] = useState<string | null>(null);
  const [showExtraFields, setShowExtraFields] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  /* ===================== LOGIN SUCCESS HANDLER ===================== */
  // Yeh function bilkul Login page jaisa banaya gaya hai taaki cookies sync rahein
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
    if (userObj) {
      setCookie("user", encodeURIComponent(JSON.stringify(userObj)));
    }
    setCookie("user_id", String(userId));
    setCookie("user_role", String(userRole));

    /* ===== SAVE BALANCE DATA (If provided by API) ===== */
    setCookie("balance_available", String(balances?.balance_available ?? 0));
    setCookie("balance_pending", String(balances?.balance_pending ?? 0));
    setCookie("lifetime_earnings", String(balances?.lifetime_earnings ?? 0));

    setSuccess("Signup & Login successful! Redirecting...");

    // Thoda delay taaki user success message dekh sake
    setTimeout(() => navigateTo(previousPage), 1000);
  };

  // ---------------- NORMAL SIGNUP ----------------
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      // STEP 1: Registration
      const payload = {
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        confirm_password: formData.confirm_password,
        role_id: 1,
        referral_code: formData.referral_code || "",
        user_type: "WebApp",
      };

      const res = await axios.post(`${BASE_URL}/users/register`, payload);

      if (res.status !== 201 && res.status !== 200) {
        setError(res.data?.message || "Registration failed");
        setLoading(false);
        return;
      }

      // STEP 2: Background Auto-Login
      const loginRes = await axios.post(`${BASE_URL}/users/login`, {
        email: formData.email,
        password: formData.password,
      });

      const data = loginRes.data;
      const token =
        data.access_token ||
        data.token ||
        data.data?.token ||
        data.user?.token;

      if (!token) {
        setError("Signup successful but background login failed. Please log in manually.");
        setLoading(false);
        return;
      }

      // Login handler call karna (Same as Login Page)
      handleLoginSuccess(token, data.user, {
        balance_available: data.balance_available,
        balance_pending: data.balance_pending,
        lifetime_earnings: data.lifetime_earnings,
      });

    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 409)
        setError("User already exists. Try logging in.");
      else setError(err.response?.data?.message || "Signup failed.");
      setLoading(false);
    }
  };

  // ---------------- GOOGLE FIRST STEP ----------------
  const handleGoogleSignup = (response: any) => {
    const token = response?.credential;
    if (!token) {
      setError("Google signup failed.");
      return;
    }
    setGidToken(token);
    setShowExtraFields(true);
  };

  // ---------------- GOOGLE FINAL SUBMIT ----------------
  const handleGoogleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!gidToken) return;
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // STEP 1: Register the Google User
      await axios.post(`${BASE_URL}/users/google-login`, {
        gid_token: gidToken,
        phone: formData.phone,
        role_id: 1,
        referral_code: formData.referral_code || "",
      });

      // STEP 2: Background Auto-Login for Google
      const loginRes = await axios.post(`${BASE_URL}/users/google-login`, {
        gid_token: gidToken,
      });

      const data = loginRes.data;
      const token =
        data.access_token ||
        data.token ||
        data.data?.token ||
        data.user?.token;

      if (!token) {
        setError("Google signup completed but auto-login failed. Please log in manually.");
        setLoading(false);
        return;
      }

      // Login handler call karna (Same as Login Page)
      handleLoginSuccess(token, data.user, {
        balance_available: data.balance_available,
        balance_pending: data.balance_pending,
        lifetime_earnings: data.lifetime_earnings,
      });

    } catch (err: any) {
      console.error("Google Signup Error:", err);
      setError(err.response?.data?.message || "Google signup failed.");
      setLoading(false);
    }
  };

  // ---------------- LOAD GOOGLE SCRIPT ----------------
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      // @ts-ignore
      window.google.accounts.id.initialize({
        client_id: "646757948054-vacp5dt2p3c3eg1d1i5cc85ac8pa3jug.apps.googleusercontent.com",
        callback: handleGoogleSignup,
      });

      // @ts-ignore
      window.google.accounts.id.renderButton(
        document.getElementById("googleSignupDiv"),
        { theme: "outline", size: "large", width: "100%" }
      );
    };

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Shared Input Style
  const inputClassName = "h-[50px] border border-[#d6d1c4] rounded-lg px-4 w-full bg-white text-[#1b1b1b] placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1b1b1b] focus-visible:ring-offset-0";

  // ---------------- UI ----------------
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#ebecdf] px-4 py-4">
      {/* Increased max width from 450px to 700px */}
      <Card className="w-full max-w-[700px] bg-[#f4f4f2] shadow-sm rounded-xl border border-[#d6d1c4] overflow-hidden">
        <CardHeader className="pb-4 ">
          <CardTitle className="text-[34px] leading-[40px] font-bold text-[#1b1b1b] text-center">
            Create an Account
          </CardTitle>
          <p className="text-[#5c5c5c] text-center text-sm ">
            Join GRASA to start your health journey
          </p>
        </CardHeader>

        <CardContent className="p-8 pt-1">
          {/* NORMAL SIGNUP */}
          {!showExtraFields && (
            <>
              <form onSubmit={handleSubmit} className="space-y-2">
                
                {/* 2-Column Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    name="full_name"
                    placeholder="Full Name"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                    className={inputClassName}
                  />

                  <Input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={inputClassName}
                  />

                  <Input
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className={inputClassName}
                  />

                  <Input
                    name="referral_code"
                    placeholder="Referral Code (optional)"
                    value={formData.referral_code}
                    onChange={handleChange}
                    className={inputClassName}
                  />

                  {/* Replace the Password Input with this */}
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className={`${inputClassName} pr-10`} // Added pr-10 so text doesn't hide behind the icon
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  {/* Replace the Confirm Password Input with this */}
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirm_password"
                      placeholder="Confirm Password"
                      value={formData.confirm_password}
                      onChange={handleChange}
                      required
                      className={`${inputClassName} pr-10`} // Added pr-10 so text doesn't hide behind the icon
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-[#1b1b1b] font-bold hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-md text-center">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-700 text-sm p-3 rounded-md text-center">
                    {success}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-[52px] bg-[#C5D82D] text-[#1b1b1b] text-lg rounded-md font-bold hover:bg-[#b8cc28] hover:opacity-90 transition disabled:opacity-50 mt-2"
                >
                  {loading ? "Registering..." : "Sign Up"}
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
                id="googleSignupDiv"
                className="flex justify-center w-full min-h-[40px] md:w-1/2 md:mx-auto"
              ></div>
            </>
          )}

          {/* GOOGLE EXTRA FIELDS */}
          {showExtraFields && (
            <form onSubmit={handleGoogleFormSubmit} className="space-y-4">
              <p className="text-center text-[#1b1b1b] font-semibold mb-2">
                Almost there! Complete your details:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className={inputClassName}
                />

                <Input
                  name="referral_code"
                  placeholder="Referral Code (optional)"
                  value={formData.referral_code}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-md text-center">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 text-sm p-3 rounded-md text-center">
                  {success}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-[52px] bg-[#C5D82D] text-[#1b1b1b] text-lg rounded-md font-bold hover:bg-[#b8cc28] hover:opacity-90 transition disabled:opacity-50 mt-2"
              >
                {loading ? "Registering..." : "Complete Signup"}
              </Button>
            </form>
          )}

          <p className="mt-8 text-center text-sm text-[#5c5c5c]">
            Already have an account?{" "}
            <Link href="/login" className="text-[#1b1b1b] font-bold hover:underline">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}