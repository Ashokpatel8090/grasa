// "use client";

// import { useState, useEffect, ChangeEvent, FormEvent } from "react";
// import axios from "axios";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";

// import { BASE_URL } from "@/lib/api";

// // ---------------- COOKIE SETTER ----------------
// const setCookie = (name: string, value: string, days = 7) => {
//   const expires = new Date(Date.now() + days * 86400000).toUTCString();
//   document.cookie = `${name}=${value};expires=${expires};path=/`;
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
//   const router = useRouter();

//   const previousPage =
//     typeof window !== "undefined"
//       ? new URLSearchParams(window.location.search).get("redirect") || "/"
//       : "/";

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
//       // STEP 1: Signup
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

//       const res = await axios.post(
//             `${BASE_URL}/users/register`,
//             payload
//         );

//       if (res.status !== 201 && res.status !== 200) {
//         setError(res.data?.message || "Registration failed");
//         setLoading(false);
//         return;
//       }

//       // STEP 2: Auto Login (API needs this)
//       const loginRes = await axios.post(
//             `${BASE_URL}/users/login`,
//             {
//                 email: formData.email,
//                 password: formData.password,
//             }
//         );

//       const data = loginRes.data;

//       const token =
//         data.token ||
//         data.access_token ||
//         data.data?.token ||
//         data.user?.token;

//       if (!token) {
//         setError("Signup successful but login failed.");
//         setLoading(false);
//         return;
//       }

//       // Decode and save cookies
//       const decoded = decodeToken(token);
//       const userId = decoded.sub || decoded.id || data.user?.id;
//       const userRole =
//         {
//           1: "Patient",
//           2: "Doctor",
//           4: "Other",
//           5: "Channel-partner",
//           6: "Nutritionist",
//         }[decoded.role as number] || "Unknown";

//       setCookie("token", token);
//       setCookie("user", encodeURIComponent(JSON.stringify(data.user)));
//       setCookie("user_id", String(userId));
//       setCookie("user_role", String(userRole));

//       setSuccess("Registration successful!");

//       setTimeout(() => router.push(previousPage), 1000);
//     } catch (err: any) {
//       console.error(err);
//       if (err.response?.status === 409)
//         setError("User already exists. Try logging in.");
//       else setError(err.response?.data?.message || "Signup failed.");
//     } finally {
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
//       const res = await axios.post(
//             `${BASE_URL}/users/google-login`,
//             {
//                 gid_token: gidToken,
//                 phone: formData.phone,
//                 role_id: 1,
//                 referral_code: formData.referral_code || "",
//             }
//         );

//       const data = res.data;

//       const token =
//         data.token ||
//         data.access_token ||
//         data.data?.token ||
//         data.user?.token;

//       if (!token) {
//         setError("Google signup completed but token missing.");
//         return;
//       }

//       // Decode + Save Cookie
//       const decoded = decodeToken(token);
//       const userId = decoded.sub || decoded.id || data.user?.id;

//       const role =
//         {
//           1: "Patient",
//           2: "Doctor",
//           4: "Other",
//           5: "Channel-partner",
//           6: "Nutritionist",
//         }[decoded.role_id as number] || "Unknown";

//       setCookie("token", token);
//       setCookie("user", encodeURIComponent(JSON.stringify(data.user)));
//       setCookie("user_id", String(userId));
//       setCookie("user_role", String(role));

//       setSuccess("Signup successful!");

//       setTimeout(() => router.push(previousPage), 1200);
//     } catch (err: any) {
//       console.error(err);
//       setError(err.response?.data?.message || "Google signup failed.");
//     } finally {
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
//         client_id:
//         // process.env.GOOGLE_CLIENT_ID,
//           "646757948054-vacp5dt2p3c3eg1d1i5cc85ac8pa3jug.apps.googleusercontent.com",
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
//                 {success && <p className="text-green-600 text-sm">{success}</p>}

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

//               <div className="flex justify-end -mt-2">
//                 <Link
//                   href="/forgot-password"
//                   className="text-sm text-blue-600 hover:text-blue-800 font-medium"
//                 >
//                   Forgot Password?
//                 </Link>
//               </div>

//               {error && <p className="text-red-600 text-sm">{error}</p>}
//               {success && <p className="text-green-600 text-sm">{success}</p>}

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
// router.push hata diya gaya hai taaki hum hard redirect kar sakein
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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
      document.body.removeChild(script);
    };
  }, []);

  // ---------------- UI ----------------
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-emerald-50 to-white">
      <Card className="w-full max-w-md shadow-lg border border-emerald-100 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-gray-800">
            Sign Up
          </CardTitle>
        </CardHeader>

        <CardContent>
          {/* NORMAL SIGNUP */}
          {!showExtraFields && (
            <>
              <form onSubmit={handleSubmit} className="space-y-3">
                <Input
                  name="full_name"
                  placeholder="Full Name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                />

                <Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <Input
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />

                <Input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <Input
                  type="password"
                  name="confirm_password"
                  placeholder="Confirm Password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  required
                />

                <Input
                  name="referral_code"
                  placeholder="Referral Code (optional)"
                  value={formData.referral_code}
                  onChange={handleChange}
                />

                <div className="flex justify-end -mt-2">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Forgot Password?
                  </Link>
                </div>

                {error && <p className="text-red-600 text-sm">{error}</p>}
                {success && <p className="text-green-600 text-sm font-medium">{success}</p>}

                <Button
                  type="submit"
                  className="w-full h-12 bg-gray-800 hover:bg-gray-900 text-lg font-semibold"
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Sign Up"}
                </Button>
              </form>

              <div className="mt-3 text-center">
                <p className="text-gray-600 text-sm mb-2">or</p>
                <div id="googleSignupDiv" className="flex justify-center"></div>
              </div>
            </>
          )}

          {/* GOOGLE EXTRA FIELDS */}
          {showExtraFields && (
            <form onSubmit={handleGoogleFormSubmit} className="space-y-3">
              <p className="text-center text-gray-700 mb-3">
                Complete signup with additional details:
              </p>

              <Input
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
              />

              <Input
                name="referral_code"
                placeholder="Referral Code (optional)"
                value={formData.referral_code}
                onChange={handleChange}
              />

              {error && <p className="text-red-600 text-sm">{error}</p>}
              {success && <p className="text-green-600 text-sm font-medium">{success}</p>}

              <Button
                type="submit"
                className="w-full bg-emerald-700 hover:bg-emerald-800"
                disabled={loading}
              >
                {loading ? "Registering..." : "Complete Signup"}
              </Button>
            </form>
          )}
        </CardContent>

        <div className="text-center pb-4">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 font-semibold">
              Login
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}