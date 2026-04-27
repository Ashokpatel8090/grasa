"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import ProfileCard from "@/components/grasa/ProfileCard";
import { BASE_URL } from "@/components/config/api";

/* ------------------- COOKIE UTILITY ------------------- */
const getCookie = (name: string) => {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : "";
};

interface Address {
  id: number;
  street: string;
  landmark: string;
  city_id: number;
  state_id: number;
  country_id: number;
  postal_code: string;
  created_at: string;
}

interface UserInfo {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  is_active: boolean;
}

interface PatientProfile {
  id: number;
  user: UserInfo;
  relationship: string;
  date_of_birth: string;
  gender: string;
  address: Address | null;
  blood_group: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const [sessionReady, setSessionReady] = useState(false);

  /* ----------------------------------------------
     READ COOKIE TOKEN + USER ID
  ---------------------------------------------- */
  useEffect(() => {
    const uid = getCookie("user_id");
    const tok = getCookie("token");

    setUserId(uid || null);
    setToken(tok || null);
    setSessionReady(true);
  }, []);

  /* ----------------------------------------------
     FETCH PROFILE
  ---------------------------------------------- */
  useEffect(() => {
    if (!sessionReady) return;

    if (!userId || !token) {
      toast.error("Authentication missing. Please log in.");
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/patients/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data.patient_profile);
        return true;
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || "Failed to load profile details";
        toast.error(errorMsg);
        return false;
      }
    };

    const fetchProfileImage = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/patients/${userId}/profile-image`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProfileImage(res.data.profile_url);
      } catch (err) {
        // Silently fail or use a subtle toast if image fails, to avoid spamming the user
        toast.error("Could not load profile image");
      }
    };

    const loadAll = async () => {
      const profileSuccess = await fetchProfile();
      await fetchProfileImage();
      setLoading(false);

      // Show completion toast only if the main profile successfully fetched
      if (profileSuccess) {
        toast.success("Profile loaded successfully!");
      }
    };

    loadAll();
  }, [sessionReady, userId, token]);

  /* ----------------------------------------------
     LOADING STATE
  ---------------------------------------------- */
  if (loading) {
    return (
       <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#C5D82D] mb-4"></div>
        <p className="text-base sm:text-lg font-medium text-zinc-700 text-center">
          Loading ...
        </p>
      </div>
    );
  }

  /* ----------------------------------------------
     FAILED LOAD HANDLER
  ---------------------------------------------- */
  if (!profile && sessionReady && userId && token) {
    return (
      <div className="text-center mt-10 text-red-500 font-semibold">
        <Toaster position="top-right" />
        Failed to load profile
      </div>
    );
  }

  /* ----------------------------------------------
     SUCCESS — SHOW PROFILE
  ---------------------------------------------- */
  return (
    <div className="max-w-5xl mx-auto py-6 px-4">
      {/* The Toaster handles displaying the notifications. 
        Any child component (like ProfileCard buttons) can now import 'toast' 
        and call toast.success() or toast.error() safely. 
      */}
      <Toaster position="top-right" reverseOrder={false} />
      
      {profile && (
        <ProfileCard 
          profile={profile} 
          profileImage={profileImage}
          userId={userId}
        />
      )}
    </div>
  );
}