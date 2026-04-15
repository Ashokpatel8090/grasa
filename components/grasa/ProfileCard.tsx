"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BASE_URL } from "@/components/config/api";
import toast from "react-hot-toast";

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
  Ban,
  Loader2,
  Upload,
  Trash2,
  Camera,
  X,
  CreditCard,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

/* ------------------- COOKIE UTILITY ------------------- */
const getCookie = (name: string) => {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : "";
};

/* ------------------- API ------------------- */
const MHC_WALLET_API = `${BASE_URL}/api/users/mhc_wallet`;
const MHC_SUBSCRIPTION_API = `${BASE_URL}/subscriptions/grasa/me/subscription`;
const MHC_CANCEL_SUBSCRIPTION_API = `${BASE_URL}/subscriptions/grasa/subscriptions/cancel`;

/* ------------------- TYPES ------------------- */
interface SubscriptionPlan {
  id: number;
  name: string;
}

interface SubscriptionData {
  status: "none" | "active" | "cancelled";
  razorpay_subscription_id?: string;
  plan?: SubscriptionPlan;
  current_period_start?: string;
  current_period_end?: string;
  trial_end?: string;
  next_billing_at?: string;
  paid_count?: number;
  total_count?: number;
  cancel_at_cycle_end?: boolean;
}

interface ProfileCardProps {
  profile: any;
  profileImage: string | null;
  userId: string | null;
}

export default function ProfileCard({
  profile,
  profileImage: initialProfileImage,
  userId,
}: ProfileCardProps) {
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(initialProfileImage);

  /* -------- SUBSCRIPTION STATE -------- */
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState<boolean>(true);
  const [isCancelingSubscription, setIsCancelingSubscription] = useState<boolean>(false);

  /* -------- WALLET STATE -------- */
  const [balanceAvailable, setBalanceAvailable] = useState<number>(0);
  const [balancePending, setBalancePending] = useState<number>(0);
  const [lifetimeEarnings, setLifetimeEarnings] = useState<number>(0);
  const [walletLoading, setWalletLoading] = useState<boolean>(true);

  /* -------- CANCEL AUTOPAY STATE -------- */
  const [isCanceling, setIsCanceling] = useState<boolean>(false);
  const [showCancelButton, setShowCancelButton] = useState<boolean>(false);

  /* -------- IMAGE MODAL STATE -------- */
  const [showImageModal, setShowImageModal] = useState<boolean>(false);
  const [imageUploading, setImageUploading] = useState<boolean>(false);
  const [imageDeletingMode, setImageDeletingMode] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* -------- LOCATION STATE -------- */
  const [countryName, setCountryName] = useState<string | null>(null);
  const [stateName, setStateName] = useState<string | null>(null);
  const [cityName, setCityName] = useState<string | null>(null);

  const showDefaultLetter = !profileImage || profileImage === "null";
  const firstLetter = profile?.user?.full_name
    ? profile.user.full_name.charAt(0).toUpperCase()
    : "?";

  const address = profile?.address || null;
  const countryId = address?.country_id || null;
  const stateId = address?.state_id || null;
  const cityId = address?.city_id || null;

  /* ------------------- LOAD TOKEN ------------------- */
  useEffect(() => {
    const t = getCookie("token");
    setToken(t || null);
  }, []);

  useEffect(() => {
    if (profile) {
      setShowCancelButton(profile.cancel_cycle_at_end === true);
    }
  }, [profile]);

  /* ------------------- FETCH SUBSCRIPTION ------------------- */
  useEffect(() => {
    if (!token) return;

    setSubscriptionLoading(true);
    fetch(MHC_SUBSCRIPTION_API, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch subscription");
        return res.json();
      })
      .then((data) => {
        setSubscription(data);
        // Don't show cancel button if cancel_at_cycle_end is already true
        if (data.status === "active" && data.cancel_at_cycle_end === false) {
          setShowCancelButton(true);
        } else {
          setShowCancelButton(false);
        }
      })
      .catch((error) => {
        console.error("Subscription fetch error:", error);
        setSubscription({ status: "none" });
        setShowCancelButton(false);
      })
      .finally(() => setSubscriptionLoading(false));
  }, [token]);

  /* ------------------- FETCH WALLET ------------------- */
  useEffect(() => {
    if (!token) return;

    setWalletLoading(true);
    fetch(MHC_WALLET_API, {
      headers: { Authorization: `Bearer ${token}` },
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

  /* ------------------- FETCH LOCATIONS ------------------- */
  useEffect(() => {
    if (!countryId) {
      setCountryName("N/A");
      return;
    }
    fetch(`${BASE_URL}/api/locations/countrylist`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((c: any) => c.id === countryId);
        setCountryName(found ? found.name : "Unknown Country");
      })
      .catch(() => setCountryName("Error"));
  }, [countryId, token]);

  useEffect(() => {
    if (!countryId || !stateId) {
      setStateName("N/A");
      return;
    }
    fetch(`${BASE_URL}/api/locations/statelist?country_id=${countryId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((s: any) => s.id === stateId);
        setStateName(found ? found.name : "Unknown State");
      })
      .catch(() => setStateName("Error"));
  }, [countryId, stateId, token]);

  useEffect(() => {
    if (!stateId || !cityId) {
      setCityName("N/A");
      return;
    }
    fetch(`${BASE_URL}/api/locations/citylist?state_id=${stateId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((c: any) => c.id === cityId);
        setCityName(found ? found.name : "Unknown City");
      })
      .catch(() => setCityName("Error"));
  }, [stateId, cityId, token]);

  /* ------------------- CANCEL SUBSCRIPTION HANDLER ------------------- */
  const handleCancelSubscription = async () => {
    if (!token) {
      toast.error("Authentication token not found. Please log in again.");
      return;
    }

    setIsCancelingSubscription(true);
    const loadingToast = toast.loading("Canceling subscription...");

    try {
      const response = await fetch(MHC_CANCEL_SUBSCRIPTION_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Failed to cancel subscription");
      }

      toast.success(data.message || "Subscription has been cancelled successfully.", {
        id: loadingToast,
      });

      // Update subscription state
      if (subscription) {
        setSubscription({
          ...subscription,
          cancel_at_cycle_end: true,
        });
      }
      setShowCancelButton(false);
    } catch (error: any) {
      toast.error(error.message || "An error occurred while cancelling subscription.", {
        id: loadingToast,
      });
    } finally {
      setIsCancelingSubscription(false);
    }
  };

  /* ------------------- CANCEL AUTOPAY HANDLER ------------------- */
  const handleCancelAutopay = async () => {
    if (!token) {
      toast.error("Authentication token not found. Please log in again.");
      return;
    }

    setIsCanceling(true);
    const loadingToast = toast.loading("Canceling autopay...");

    try {
      const response = await fetch(
        `${BASE_URL}/subscriptions/grasa/subscriptions/cancel`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Failed to cancel autopay");
      }

      toast.success(data.message || "Autopay has been cancelled successfully.", {
        id: loadingToast,
      });

      setShowCancelButton(false);
    } catch (error: any) {
      toast.error(error.message || "An error occurred while cancelling autopay.", {
        id: loadingToast,
      });
    } finally {
      setIsCanceling(false);
    }
  };

  /* ------------------- UPLOAD IMAGE HANDLER ------------------- */
  const handleUploadImage = async (file: File) => {
    if (!token) {
      toast.error("Authentication token not found. Please log in again.");
      return;
    }

    if (!userId) {
      toast.error("User ID not found. Please log in again.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    setImageUploading(true);
    const loadingToast = toast.loading("Uploading image...");

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(
        `${BASE_URL}/api/patients/${userId}/upload-patient-profile-image`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to upload image");
      }

      setProfileImage(data.image_url);
      toast.success("Profile image uploaded successfully!", {
        id: loadingToast,
      });
      setShowImageModal(false);
    } catch (error: any) {
      toast.error(error.message || "An error occurred while uploading the image.", {
        id: loadingToast,
      });
    } finally {
      setImageUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  /* ------------------- DELETE IMAGE HANDLER ------------------- */
  const handleDeleteImage = async () => {
    if (!token) {
      toast.error("Authentication token not found. Please log in again.");
      return;
    }

    if (!userId) {
      toast.error("User ID not found. Please log in again.");
      return;
    }

    setImageUploading(true);
    const loadingToast = toast.loading("Deleting image...");

    try {
      const response = await fetch(
        `${BASE_URL}/api/patients/${userId}/delete-profile-image`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete image");
      }

      setProfileImage(null);
      toast.success("Profile image deleted successfully!", {
        id: loadingToast,
      });
      setShowImageModal(false);
      setImageDeletingMode(false);
    } catch (error: any) {
      toast.error(error.message || "An error occurred while deleting the image.", {
        id: loadingToast,
      });
    } finally {
      setImageUploading(false);
    }
  };

  /* ------------------- FILE INPUT HANDLER ------------------- */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUploadImage(file);
    }
  };

  /* ------------------- FORMAT DATE HELPER ------------------- */
  // const formatDate = (dateString: string | undefined) => {
  //   if (!dateString) return "N/A";
  //   try {
  //     return new Date(dateString).toLocaleDateString("en-IN", {
  //       year: "numeric",
  //       month: "short",
  //       day: "numeric",
  //       hour: "2-digit",
  //       minute: "2-digit",
  //     });
  //   } catch {
  //     return dateString;
  //   }
  // };


  const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
};



  return (
    <>
      <Card className="bg-[#f4f4f2] border border-[#d6d1c4] rounded-3xl p-6 sm:p-8 md:p-10 shadow-lg shadow-[#d6d1c4]/30 max-w-[1000px] w-full mx-auto font-sans transition-all duration-300">
        
        {/* ---------- TOP HEADER ---------- */}
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-8 mb-2">
          
          {/* AVATAR & NAME */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            {/* PROFILE IMAGE WITH OVERLAY */}
            <div className="relative w-32 h-32 shrink-0 group cursor-pointer" onClick={() => setShowImageModal(true)}>
              <div className="absolute inset-0 bg-[#C5D82D] rounded-full blur-md opacity-40 group-hover:opacity-60 transition-opacity"></div>
              {showDefaultLetter ? (
                <div className="relative w-full h-full rounded-full bg-[#ebecdf] flex items-center justify-center border-4 border-[#C5D82D] shadow-sm z-10 group-hover:bg-[#dfe0c9] transition-colors">
                  <span className="text-5xl font-bold text-[#1b1b1b]">
                    {firstLetter}
                  </span>
                  <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Camera size={32} className="text-white" />
                  </div>
                </div>
              ) : (
                <>
                  <Image
                    src={profileImage!}
                    alt="Profile Image"
                    fill
                    className="relative rounded-full object-cover border-4 border-[#C5D82D] shadow-sm z-10 transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 z-20">
                    <Camera size={32} className="text-white" />
                  </div>
                </>
              )}
            </div>

            <div className="pt-2 sm:pt-4 flex flex-col items-center sm:items-start">
              <span className="inline-block bg-[#C5D82D] text-[#1b1b1b] text-xs uppercase px-3 py-1 rounded-full font-bold tracking-wide shadow-sm mb-3">
                Patient ID: {profile?.id || "---"}
              </span>
              <h1 className="text-3xl font-bold text-[#1b1b1b] tracking-tight">
                {profile?.user?.full_name || "Loading..."}
              </h1>
              <p className="text-[#5c5c5c] mt-1.5 font-medium text-lg">
                {profile?.relationship || "Patient"}
              </p>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full lg:w-auto justify-center lg:justify-end">
            <button
              onClick={() => router.push("/update-profile")}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-[#C5D82D] text-[#1b1b1b] rounded-xl font-bold shadow-sm hover:bg-[#b5c727] hover:-translate-y-0.5 active:translate-y-0 transition-all w-full sm:w-auto"
            >
              <Edit3 size={18} />
              Update Profile
            </button>

            <button
              onClick={() => router.push("/shop/orders")}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-white border border-[#d6d1c4] text-[#1b1b1b] rounded-xl font-semibold shadow-sm hover:bg-[#ebecdf] hover:-translate-y-0.5 active:translate-y-0 transition-all w-full sm:w-auto"
            >
              <ShoppingBag size={18} />
              Orders
            </button>

            <button
              onClick={() => router.push("/ticket")}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-white border border-[#d6d1c4] text-[#1b1b1b] rounded-xl font-semibold shadow-sm hover:bg-[#ebecdf] hover:-translate-y-0.5 active:translate-y-0 transition-all w-full sm:w-auto"
            >
              <Ticket size={18} />
              Raise Ticket
            </button>

            {/* CANCEL SUBSCRIPTION BUTTON */}
            {showCancelButton && subscription?.status === "active" && !subscription?.cancel_at_cycle_end && (
              <button
                onClick={handleCancelSubscription}
                disabled={isCancelingSubscription}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-[#fee2e2] text-red-700 border border-[#fca5a5] rounded-xl font-bold shadow-sm hover:bg-red-200 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none w-full sm:w-auto"
              >
                {isCancelingSubscription ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Ban size={18} />
                )}
                {isCancelingSubscription ? "Canceling..." : "Cancel Subscription"}
              </button>
            )}

            {/* CANCEL AUTOPAY BUTTON */}
            {showCancelButton && !subscription?.status && (
              <button
                onClick={handleCancelAutopay}
                disabled={isCanceling}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-[#fee2e2] text-red-700 border border-[#fca5a5] rounded-xl font-bold shadow-sm hover:bg-red-200 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none w-full sm:w-auto"
              >
                {isCanceling ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Ban size={18} />
                )}
                {isCanceling ? "Canceling..." : "Cancel Autopay"}
              </button>
            )}
          </div>
        </div>

        <hr className="border-t border-[#d6d1c4] mb-4" />

        <CardContent className="space-y-4 p-0">
          
          {/* ================= SUBSCRIPTION SUMMARY ================= */}
          {subscription && subscription.status !== "none" && (
            <>
              <section>
                <SectionTitle icon={<CreditCard size={16} />} title="Subscription Status" />

                {subscription.status === "active" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                    {/* STATUS CARD */}
                    <div className="p-6 border border-[#d6d1c4] rounded-2xl bg-white flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                      <div className="flex items-center gap-2">
                        {/* <CheckCircle2 size={18} className="text-green-600" /> */}
                        <p className="text-[#5c5c5c] text-sm font-bold uppercase tracking-wider">Status</p>
                      </div>
                      <p className="text-sm font-semibold text-green-600 flex items-center gap-2">
                        <CheckCircle2 size={20} />
                        Active
                      </p>
                    </div>

                    {/* PLAN NAME CARD */}
                    <InfoCard
                      icon={<CreditCard size={16} />}
                      label="Plan Name"
                      value={subscription.plan?.name || "N/A"}
                    />

                    {/* PERIOD START CARD */}
                    <InfoCard
                      label="Period Start"
                      value={formatDate(subscription.current_period_start)}
                    />

                    {/* PERIOD END CARD */}
                    <InfoCard
                      label="Period End"
                      value={formatDate(subscription.current_period_end)}
                    />

                    {/* NEXT BILLING CARD */}
                    <InfoCard
                      label="Next Billing"
                      value={formatDate(subscription.next_billing_at)}
                    />

                    {/* BILLING CYCLE CARD */}
                    {/* <div className="p-5 border border-[#d6d1c4] rounded-2xl bg-white flex flex-col gap-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-[#C5D82D]">
                      <p className="text-[#5c5c5c] text-xs font-bold uppercase tracking-wider">Billing Cycle Progress</p>
                      <p className="text-[#1b1b1b] font-semibold text-lg">
                        {subscription.paid_count} / {subscription.total_count}
                      </p>
                      <div className="w-full bg-[#ebecdf] rounded-full h-2 mt-2">
                        <div
                          className="bg-[#C5D82D] h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${((subscription.paid_count || 0) / (subscription.total_count || 1)) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div> */}

                    {/* CANCELLATION STATUS CARD */}
                    {subscription.cancel_at_cycle_end && (
                      <div className="p-6 border border-[#fca5a5] rounded-2xl bg-[#fee2e2] flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:col-span-2 md:col-span-3">
                        <div className="flex items-center gap-2">
                          <AlertCircle size={18} className="text-red-700" />
                          <p className="text-[#5c5c5c] text-sm font-bold uppercase tracking-wider">Cancellation Notice</p>
                        </div>
                        <p className="text-red-700 font-semibold">
                          Your subscription will be cancelled at the end of the current billing cycle on {formatDate(subscription.current_period_end)}.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-white border border-dashed border-[#d6d1c4] rounded-2xl p-8 text-center flex flex-col items-center gap-3 transition-colors hover:bg-[#ebecdf]">
                    <AlertCircle size={32} className="text-[#a8a396]" />
                    <p className="text-[#5c5c5c] font-medium">No active subscription. Subscribe now to access premium features.</p>
                  </div>
                )}
              </section>

              <hr className="border-t border-[#d6d1c4]" />
            </>
          )}

          {/* ================= WALLET SUMMARY ================= */}
          <section>
            <SectionTitle icon={<Wallet size={20} />} title="Wallet Summary" />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              <WalletCard
                label="Balance Available"
                value={balanceAvailable}
                isLoading={walletLoading}
                isHighlight={true}
              />
              <WalletCard
                label="Balance Pending"
                value={balancePending}
                isLoading={walletLoading}
              />
              <WalletCard
                label="Lifetime Earnings"
                value={lifetimeEarnings}
                isLoading={walletLoading}
              />
            </div>
          </section>

          <hr className="border-t border-[#d6d1c4]" />

          {/* ================= PERSONAL DETAILS ================= */}
          <section>
            <SectionTitle icon={<User size={20} />} title="Personal Details" />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              <InfoCard icon={<Mail size={16} />} label="Email" value={profile?.user?.email} />
              <InfoCard icon={<Phone size={16} />} label="Phone" value={profile?.user?.phone} />
              <InfoCard icon={<Calendar size={16} />} label="Date of Birth" value={profile?.date_of_birth} />
              <InfoCard icon={<User size={16} />} label="Gender" value={profile?.gender} />
              <InfoCard icon={<Droplet size={16} />} label="Blood Group" value={profile?.blood_group} />
            </div>
          </section>

          <hr className="border-t border-[#d6d1c4]" />

          {/* ================= ADDRESS ================= */}
          <section>
            <SectionTitle icon={<MapPin size={20} />} title="Address Information" />

            {!address ? (
              <div className="bg-white border border-dashed border-[#d6d1c4] rounded-2xl p-8 text-center flex flex-col items-center gap-3 transition-colors hover:bg-[#ebecdf]">
                <MapPin size={32} className="text-[#a8a396]" />
                <p className="text-[#5c5c5c] font-medium">No address available. Please update your profile to add one.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                <InfoCard label="Street" value={address.street} />
                <InfoCard label="Landmark" value={address.landmark} />
                <InfoCard label="Pincode" value={address.postal_code} />
                <InfoCard label="Country" value={countryName} isLoading={countryName === null} />
                <InfoCard label="State" value={stateName} isLoading={stateName === null} />
                <InfoCard label="City" value={cityName} isLoading={cityName === null} />
              </div>
            )}
          </section>
        </CardContent>
      </Card>

      {/* ================= IMAGE MODAL (LINKEDIN STYLE) ================= */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 relative animate-in fade-in zoom-in-95 duration-300">
            {/* CLOSE BUTTON */}
            <button
              onClick={() => {
                setShowImageModal(false);
                setImageDeletingMode(false);
              }}
              className="absolute top-4 right-4 p-2 hover:bg-[#f4f4f2] rounded-full transition-colors"
            >
              <X size={24} className="text-[#1b1b1b]" />
            </button>

            {!imageDeletingMode ? (
              <>
                {/* UPLOAD SECTION */}
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-[#C5D82D] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera size={32} className="text-[#1b1b1b]" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#1b1b1b] mb-2">
                    {showDefaultLetter ? "Add Profile Photo" : "Update Profile Photo"}
                  </h2>
                  <p className="text-[#5c5c5c] text-sm">
                    {showDefaultLetter 
                      ? "Make your profile stand out with a great photo" 
                      : "Choose a new photo to replace your current one"}
                  </p>
                </div>

                {/* ACTION BUTTONS */}
                <div className="space-y-3">
                  {/* UPLOAD BUTTON */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={imageUploading}
                    className="w-full py-3 px-4 bg-[#C5D82D] text-[#1b1b1b] rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#b5c727] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {imageUploading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload size={18} />
                        Choose Photo
                      </>
                    )}
                  </button>

                  {/* DELETE BUTTON (ONLY IF HAS IMAGE) */}
                  {!showDefaultLetter && (
                    <button
                      onClick={() => setImageDeletingMode(true)}
                      className="w-full py-3 px-4 bg-[#fee2e2] text-red-700 border border-[#fca5a5] rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-red-100 transition-all"
                    >
                      <Trash2 size={18} />
                      Delete Photo
                    </button>
                  )}

                  {/* CANCEL BUTTON */}
                  <button
                    onClick={() => {
                      setShowImageModal(false);
                      setImageDeletingMode(false);
                    }}
                    className="w-full py-3 px-4 bg-[#ebecdf] text-[#1b1b1b] rounded-xl font-semibold hover:bg-[#dfe0c9] transition-all"
                  >
                    Cancel
                  </button>
                </div>

                {/* HIDDEN FILE INPUT */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </>
            ) : (
              <>
                {/* CONFIRMATION SECTION */}
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-[#fee2e2] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trash2 size={32} className="text-red-700" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#1b1b1b] mb-2">
                    Delete Photo?
                  </h2>
                  <p className="text-[#5c5c5c] text-sm">
                    Are you sure you want to delete your profile photo? This action cannot be undone.
                  </p>
                </div>

                {/* CONFIRMATION BUTTONS */}
                <div className="space-y-3">
                  <button
                    onClick={handleDeleteImage}
                    disabled={imageUploading}
                    className="w-full py-3 px-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {imageUploading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 size={18} />
                        Yes, Delete
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setImageDeletingMode(false)}
                    className="w-full py-3 px-4 bg-[#ebecdf] text-[#1b1b1b] rounded-xl font-semibold hover:bg-[#dfe0c9] transition-all"
                  >
                    Keep Photo
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

/* ================== COMPONENT UTILITIES ================== */

/* SECTION TITLE */
function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="w-12 h-12 rounded-xl bg-[#C5D82D] shadow-sm flex items-center justify-center shrink-0 text-[#1b1b1b]">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-[#1b1b1b]">{title}</h3>
    </div>
  );
}

/* WALLET CARD */
function WalletCard({ 
  label, 
  value, 
  isLoading, 
  isHighlight = false 
}: { 
  label: string; 
  value: number; 
  isLoading: boolean;
  isHighlight?: boolean 
}) {
  return (
    <div className={`p-6 border border-[#d6d1c4] rounded-2xl flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${isHighlight ? 'bg-[#ebecdf]' : 'bg-white'}`}>
      <div className="flex items-center gap-2">
        <p className="text-[#5c5c5c] text-sm font-bold uppercase tracking-wider">{label}</p>
      </div>
      {isLoading ? (
        <div className="h-9 w-24 bg-[#d6d1c4] rounded animate-pulse mt-1"></div>
      ) : (
        <p className="text-3xl font-extrabold text-[#1b1b1b]">₹ {value.toLocaleString()}</p>
      )}
    </div>
  );
}

/* INFO CARD */
function InfoCard({ 
  icon, 
  label, 
  value, 
  isLoading = false 
}: { 
  icon?: React.ReactNode; 
  label: string; 
  value: any;
  isLoading?: boolean;
}) {
  return (
    <div className="group p-5 border border-[#d6d1c4] rounded-2xl bg-white flex flex-col gap-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-[#C5D82D]">
      <div className="flex items-center gap-2">
        {icon && <span className="text-[#a8a396] group-hover:text-[#C5D82D] transition-colors">{icon}</span>}
        <p className="text-[#5c5c5c] text-xs font-bold uppercase tracking-wider">{label}</p>
      </div>
      {isLoading ? (
        <div className="h-6 w-3/4 bg-[#ebecdf] rounded animate-pulse mt-1"></div>
      ) : (
        <p className="text-[#1b1b1b] font-semibold text-lg break-words">{value || "N/A"}</p>
      )}
    </div>
  );
}