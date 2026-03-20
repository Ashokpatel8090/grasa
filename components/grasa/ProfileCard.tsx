"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

import {
  User,
  Mail,
  Phone,
  Calendar,
  Droplet,
  MapPin,
  ShoppingBag,
  Edit3,
  Ticket,
  Wallet,
} from "lucide-react";

/* ------------------- COOKIE UTILITY ------------------- */
const getCookie = (name: string) => {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : "";
};

/* ------------------- API ------------------- */
const MHC_WALLET_API = "https://medicaps.cloud/api/users/mhc_wallet";

interface ProfileCardProps {
  profile: any;
  profileImage: string | null;
}

export default function ProfileCard({
  profile,
  profileImage,
}: ProfileCardProps) {
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);

  /* -------- WALLET STATE -------- */
  const [balanceAvailable, setBalanceAvailable] = useState<number>(0);
  const [balancePending, setBalancePending] = useState<number>(0);
  const [lifetimeEarnings, setLifetimeEarnings] = useState<number>(0);
  const [walletLoading, setWalletLoading] = useState<boolean>(true);

  const showDefaultLetter = !profileImage || profileImage === "null";
  const firstLetter = profile?.user?.full_name
    ? profile.user.full_name.charAt(0).toUpperCase()
    : "?";

  const address = profile?.address || null;

  const countryId = address?.country_id || null;
  const stateId = address?.state_id || null;
  const cityId = address?.city_id || null;

  const [countryName, setCountryName] = useState("Loading...");
  const [stateName, setStateName] = useState("Loading...");
  const [cityName, setCityName] = useState("Loading...");

  /* ------------------- LOAD TOKEN ------------------- */
  useEffect(() => {
    const t = getCookie("token");
    setToken(t || null);
  }, []);

  /* ------------------- FETCH WALLET ------------------- */
  useEffect(() => {
    if (!token) return;

    setWalletLoading(true);

    fetch(MHC_WALLET_API, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch wallet");
        return res.json();
      })
      .then((data) => {
        setBalanceAvailable(Number(data.balance_available ?? 0));
        setBalancePending(Number(data.balance_pending ?? 0));
        setLifetimeEarnings(Number(data.lifetime_earnings ?? 0));
      })
      .catch(() => {
        setBalanceAvailable(0);
        setBalancePending(0);
        setLifetimeEarnings(0);
      })
      .finally(() => setWalletLoading(false));
  }, [token]);

  /* ------------------- COUNTRY ------------------- */
  useEffect(() => {
    if (!countryId) {
      setCountryName("N/A");
      return;
    }

    fetch("https://medicaps.cloud/api/locations/countrylist", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((c: any) => c.id === countryId);
        setCountryName(found ? found.name : "Unknown Country");
      })
      .catch(() => setCountryName("Error"));
  }, [countryId, token]);

  /* ------------------- STATE ------------------- */
  useEffect(() => {
    if (!countryId || !stateId) {
      setStateName("N/A");
      return;
    }

    fetch(
      `https://medicaps.cloud/api/locations/statelist?country_id=${countryId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((s: any) => s.id === stateId);
        setStateName(found ? found.name : "Unknown State");
      })
      .catch(() => setStateName("Error"));
  }, [countryId, stateId, token]);

  /* ------------------- CITY ------------------- */
  useEffect(() => {
    if (!stateId || !cityId) {
      setCityName("N/A");
      return;
    }

    fetch(
      `https://medicaps.cloud/api/locations/citylist?state_id=${stateId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((c: any) => c.id === cityId);
        setCityName(found ? found.name : "Unknown City");
      })
      .catch(() => setCityName("Error"));
  }, [stateId, cityId, token]);

  return (
    <Card className="shadow-lg border border-gray-200 rounded-2xl py-4 max-w-5xl w-full mx-auto">

      {/* ---------- TOP HEADER ---------- */}
      <div className="flex flex-col md:flex-row justify-between md:items-center p-4 border-b gap-4">
        <div className="flex items-center gap-6">
          <div className="relative w-28 h-28 rounded-full">
            {showDefaultLetter ? (
              <div className="w-28 h-28 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-400 shadow-md">
                <span className="text-4xl font-bold text-blue-700">
                  {firstLetter}
                </span>
              </div>
            ) : (
              <Image
                src={profileImage!}
                alt="Profile Image"
                fill
                className="rounded-full object-cover border-4 border-blue-300 shadow-lg"
              />
            )}
          </div>

          <div>
            <h1 className="text-3xl font-semibold text-gray-900">
              {profile?.user?.full_name}
            </h1>
            <p className="text-gray-600 text-sm">
              Patient ID: {profile.id}
            </p>
            <p className="text-blue-600 mt-1 font-medium">
              {profile?.relationship}
            </p>
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => router.push("/update-profile")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
          >
            <Edit3 size={18} />
            Update Profile
          </button>

          <button
            onClick={() => router.push("/shop/orders")}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
          >
            <ShoppingBag size={18} />
            Orders
          </button>

          <button
            onClick={() => router.push("/ticket")}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700"
          >
            <Ticket size={18} />
            Raise Ticket
          </button>
        </div>
      </div>

      <CardContent className="mt-6 space-y-10">

        {/* ================= WALLET SUMMARY ================= */}
        <div>
          <SectionTitle icon={<Wallet />} title="Wallet Summary" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-4">
            <WalletCard
              label="Balance Available"
              value={walletLoading ? "..." : `₹ ${balanceAvailable}`}
              color="text-green-700"
            />
            <WalletCard
              label="Balance Pending"
              value={walletLoading ? "..." : `₹ ${balancePending}`}
              color="text-yellow-700"
            />
            <WalletCard
              label="Lifetime Earnings"
              value={walletLoading ? "..." : `₹ ${lifetimeEarnings}`}
              color="text-blue-700"
            />
          </div>
        </div>

        {/* ================= PERSONAL DETAILS ================= */}
        <div>
          <SectionTitle icon={<User />} title="Personal Details" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
            <InfoCard icon={<Mail />} label="Email" value={profile?.user?.email} />
            <InfoCard icon={<Phone />} label="Phone" value={profile?.user?.phone} />
            <InfoCard icon={<Calendar />} label="Date of Birth" value={profile?.date_of_birth} />
            <InfoCard icon={<User />} label="Gender" value={profile?.gender} />
            <InfoCard icon={<Droplet />} label="Blood Group" value={profile?.blood_group} />
            <InfoCard icon={<User />} label="Relationship" value={profile?.relationship} />
          </div>
        </div>

        {/* ================= ADDRESS ================= */}
        <div>
          <SectionTitle icon={<MapPin />} title="Address Information" />

          {!address ? (
            <p className="mt-3 text-red-500 font-semibold">
              No address available
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
              <InfoCard label="Street" value={address.street} />
              <InfoCard label="Landmark" value={address.landmark} />
              <InfoCard label="Pincode" value={address.postal_code} />
              <InfoCard label="Country" value={countryName} />
              <InfoCard label="State" value={stateName} />
              <InfoCard label="City" value={cityName} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/* ---------------- SECTION TITLE ---------------- */
function SectionTitle({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
      <span className="text-blue-600">{icon}</span>
      {title}
    </h2>
  );
}

/* ---------------- WALLET CARD ---------------- */
function WalletCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="p-4 border rounded-xl shadow-sm bg-gray-50">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

/* ---------------- INFO CARD ---------------- */
function InfoCard({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: any;
}) {
  return (
    <div className="p-4 border rounded-xl shadow-sm bg-gray-50">
      <div className="flex items-center gap-2 mb-1">
        {icon && <span className="text-blue-600">{icon}</span>}
        <p className="text-gray-700 font-medium">{label}</p>
      </div>
      <p className="text-gray-900 font-semibold">{value || "N/A"}</p>
    </div>
  );
}
