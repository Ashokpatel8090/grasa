"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import ProfileCard from "@/components/grasa/ProfileCard";

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
     READ COOKIE TOKEN + USER ID (instead of sessionStorage)
  ---------------------------------------------- */
  useEffect(() => {
    const uid = getCookie("user_id");
    const tok = getCookie("token");

    console.log("DEBUG → Cookie user_id:", uid);
    console.log("DEBUG → Cookie token:", tok);

    setUserId(uid || null);
    setToken(tok || null);

    setSessionReady(true);
  }, []);

  /* ----------------------------------------------
     FETCH PROFILE (after cookie data available)
  ---------------------------------------------- */
  useEffect(() => {
    if (!sessionReady) return;

    console.log("DEBUG → Session ready:", sessionReady);
    console.log("DEBUG → userId:", userId);
    console.log("DEBUG → token:", token);

    if (!userId || !token) {
      console.log("DEBUG → Missing cookie auth! Cannot fetch.");
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        console.log("DEBUG → Fetching profile...");
        const res = await axios.get(
          `https://medicaps.cloud/api/patients/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("DEBUG → Profile response:", res.data);
        setProfile(res.data.patient_profile);
      } catch (err) {
        console.error("DEBUG → Profile fetch error:", err);
      }
    };

    const fetchProfileImage = async () => {
      try {
        console.log("DEBUG → Fetching profile image...");
        const res = await axios.get(
          `https://medicaps.cloud/api/patients/${userId}/profile-image`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("DEBUG → Profile image:", res.data);
        setProfileImage(res.data.profile_url);
      } catch (err) {
        console.error("DEBUG → Profile image error:", err);
      }
    };

    const loadAll = async () => {
      await Promise.all([fetchProfile(), fetchProfileImage()]);
      setLoading(false);
    };

    loadAll();
  }, [sessionReady, userId, token]);

  /* ----------------------------------------------
     LOADING STATE
  ---------------------------------------------- */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader2 className="animate-spin w-10 h-10 text-blue-500" />
      </div>
    );
  }

  /* ----------------------------------------------
     FAILED LOAD HANDLER
  ---------------------------------------------- */
  if (!profile && sessionReady && userId && token) {
    return (
      <div className="text-center mt-10 text-red-500 font-semibold">
        Failed to load profile
      </div>
    );
  }

  /* ----------------------------------------------
     SUCCESS — SHOW PROFILE
  ---------------------------------------------- */
  return (
    <div className="max-w-5xl mx-auto py-6 px-4">
      {profile && <ProfileCard profile={profile} profileImage={profileImage} />}
    </div>
  );
}
