// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { BASE_URL } from "@/components/config/api";

// /* ---------------- COOKIE UTILITY ---------------- */
// const getCookie = (name: string) => {
//   const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
//   return match ? match[2] : "";
// };

// export default function UpdateProfile() {
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   const [userId, setUserId] = useState<string | null>(null);
//   const [token, setToken] = useState<string | null>(null);

//   const [profile, setProfile] = useState<any>(null);

//   const [countries, setCountries] = useState<any[]>([]);
//   const [states, setStates] = useState<any[]>([]);
//   const [cities, setCities] = useState<any[]>([]);

//   const [form, setForm] = useState({
//     full_name: "",
//     relationship: "",
//     date_of_birth: "",
//     gender: "",
//     blood_group: "",
//     street: "",
//     landmark: "",
//     country_id: 0,
//     state_id: 0,
//     city_id: 0,
//     postal_code: "",
//   });

//   /* -------------------- LOAD TOKEN FROM COOKIE -------------------- */
//   useEffect(() => {
//     setUserId(getCookie("user_id"));
//     setToken(getCookie("token"));
//   }, []);

//   /* -------------------- FETCH PROFILE -------------------- */
//   useEffect(() => {
//     if (!userId || !token) return;

//     axios.get(`${BASE_URL}/api/patients/${userId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((res) => {
//         const p = res.data.patient_profile;
//         setProfile(p);

//         setForm({
//           full_name: p.user.full_name,
//           relationship: p.relationship,
//           date_of_birth: p.date_of_birth,
//           gender: p.gender,
//           blood_group: p.blood_group,
//           street: p.address?.street || "",
//           landmark: p.address?.landmark || "",
//           country_id: p.address?.country_id || 0,
//           state_id: p.address?.state_id || 0,
//           city_id: p.address?.city_id || 0,
//           postal_code: p.address?.postal_code || "",
//         });

//         setLoading(false);
//       })
//       .catch(() => setLoading(false));
//   }, [userId, token]);

//   /* -------------------- COUNTRY LIST -------------------- */
//   useEffect(() => {
//     fetch(`${BASE_URL}/api/locations/countrylist`)
//       .then((res) => res.json())
//       .then(setCountries);
//   }, []);

//   /* -------------------- STATE LIST -------------------- */
//   useEffect(() => {
//     if (!form.country_id) return;

//     fetch(
//         `${BASE_URL}/api/locations/statelist?country_id=${form.country_id}`
//       )
//       .then((res) => res.json())
//       .then(setStates);
//   }, [form.country_id]);

//   /* -------------------- CITY LIST -------------------- */
//   useEffect(() => {
//     if (!form.state_id) return;

//     fetch(
//         `${BASE_URL}/api/locations/citylist?state_id=${form.state_id}`
//       )
//       .then((res) => res.json())
//       .then(setCities);
//   }, [form.state_id]);

//   /* -------------------- UPDATE FORM -------------------- */
//   const updateForm = (field: string, value: any) => {
//     setForm((prev) => ({ ...prev, [field]: value }));
//   };

//   /* -------------------- SUBMIT UPDATED PROFILE -------------------- */
//   const handleSubmit = async () => {
//     if (!token || !userId) return;

//     setSaving(true);

//     const payload = {
//       full_name: form.full_name,
//       relationship: form.relationship,
//       date_of_birth: form.date_of_birth,
//       gender: form.gender,
//       blood_group: form.blood_group,
//       address: {
//         street: form.street,
//         landmark: form.landmark,
//         country_id: Number(form.country_id),
//         state_id: Number(form.state_id),
//         city_id: Number(form.city_id),
//         postal_code: form.postal_code,
//       },
//     };

//     console.log(payload)

//     try {
//       await axios.put(
//         `${BASE_URL}/api/patients/update/${userId}`,
//         payload,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       alert("Profile updated successfully!");
//     } catch (err) {
//       alert("Update failed");
//     }

//     setSaving(false);
//   };

//   /* -------------------- LOADING STATE -------------------- */
//   if (loading)
//     return <p className="text-center p-10 text-lg">Loading profile...</p>;

//   return (
//     <Card className="max-w-4xl mx-auto p-6 mt-10 shadow-lg">
//       <CardHeader>
//         <CardTitle className="text-3xl font-bold">Update Profile</CardTitle>
//       </CardHeader>

//       <CardContent className="space-y-10">
//         {/* PERSONAL DETAILS */}
//         <div>
//           <h2 className="text-xl font-semibold mb-4">Personal Details</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <Input label="Full Name" value={form.full_name} onChange={(e) => updateForm("full_name", e.target.value)} />
//             <Input label="Relationship" value={form.relationship} onChange={(e) => updateForm("relationship", e.target.value)} />
//             <Input type="date" label="Date of Birth" value={form.date_of_birth} onChange={(e) => updateForm("date_of_birth", e.target.value)} />
//             <Input label="Gender" value={form.gender} onChange={(e) => updateForm("gender", e.target.value)} />
//             <Input label="Blood Group" value={form.blood_group} onChange={(e) => updateForm("blood_group", e.target.value)} />
//           </div>
//         </div>

//         {/* ADDRESS DETAILS */}
//         <div>
//           <h2 className="text-xl font-semibold mb-4">Address Details</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <Input label="Street" value={form.street} onChange={(e) => updateForm("street", e.target.value)} />
//             <Input label="Landmark" value={form.landmark} onChange={(e) => updateForm("landmark", e.target.value)} />

//             <Select label="Country" value={form.country_id} options={countries} onChange={(e) => updateForm("country_id", e.target.value)} />
//             <Select label="State" value={form.state_id} options={states} onChange={(e) => updateForm("state_id", e.target.value)} />
//             <Select label="City" value={form.city_id} options={cities} onChange={(e) => updateForm("city_id", e.target.value)} />

//             <Input label="Pincode" value={form.postal_code} onChange={(e) => updateForm("postal_code", e.target.value)} />
//           </div>
//         </div>

//         <div className="flex justify-center mt-6">
//           <button
//             onClick={handleSubmit}
//             disabled={saving}
//             className="py-3 px-6 text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700"
//           >
//             {saving ? "Saving..." : "Update Profile"}
//           </button>
//         </div>

//       </CardContent>
//     </Card>
//   );
// }

// /* ------------------------------------
//    INPUT COMPONENT
// ------------------------------------- */
// function Input({ label, value, onChange, type = "text" }: any) {
//   return (
//     <div>
//       <label className="block mb-1 text-gray-700">{label}</label>
//       <input
//         type={type}
//         className="w-full p-3 border rounded-lg"
//         value={value}
//         onChange={onChange}
//       />
//     </div>
//   );
// }

// /* ------------------------------------
//    SELECT COMPONENT
// ------------------------------------- */
// function Select({ label, value, options, onChange }: any) {
//   return (
//     <div>
//       <label className="block mb-1 text-gray-700">{label}</label>
//       <select className="w-full p-3 border rounded-lg" value={value} onChange={onChange}>
//         <option value="">Select {label}</option>
//         {options.map((o: any) => (
//           <option key={o.id} value={o.id}>
//             {o.name}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// }










"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { User, MapPin, Loader2 } from "lucide-react"; // Added icons for premium feel
import { BASE_URL } from "@/components/config/api";

/* ---------------- COOKIE UTILITY ---------------- */
const getCookie = (name: string) => {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : "";
};

export default function UpdateProfile() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const [profile, setProfile] = useState<any>(null);

  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  const [form, setForm] = useState({
    full_name: "",
    relationship: "",
    date_of_birth: "",
    gender: "",
    blood_group: "",
    street: "",
    landmark: "",
    country_id: 0,
    state_id: 0,
    city_id: 0,
    postal_code: "",
  });

  /* -------------------- LOAD TOKEN FROM COOKIE -------------------- */
  useEffect(() => {
    setUserId(getCookie("user_id"));
    setToken(getCookie("token"));
  }, []);

  /* -------------------- FETCH PROFILE -------------------- */
  useEffect(() => {
    if (!userId || !token) return;

    axios
      .get(`${BASE_URL}/api/patients/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const p = res.data.patient_profile;
        setProfile(p);

        setForm({
          full_name: p.user.full_name,
          relationship: p.relationship,
          date_of_birth: p.date_of_birth,
          gender: p.gender,
          blood_group: p.blood_group,
          street: p.address?.street || "",
          landmark: p.address?.landmark || "",
          country_id: p.address?.country_id || 0,
          state_id: p.address?.state_id || 0,
          city_id: p.address?.city_id || 0,
          postal_code: p.address?.postal_code || "",
        });

        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [userId, token]);

  /* -------------------- COUNTRY LIST -------------------- */
  useEffect(() => {
    fetch(`${BASE_URL}/api/locations/countrylist`)
      .then((res) => res.json())
      .then(setCountries);
  }, []);

  /* -------------------- STATE LIST -------------------- */
  useEffect(() => {
    if (!form.country_id) return;

    fetch(`${BASE_URL}/api/locations/statelist?country_id=${form.country_id}`)
      .then((res) => res.json())
      .then(setStates);
  }, [form.country_id]);

  /* -------------------- CITY LIST -------------------- */
  useEffect(() => {
    if (!form.state_id) return;

    fetch(`${BASE_URL}/api/locations/citylist?state_id=${form.state_id}`)
      .then((res) => res.json())
      .then(setCities);
  }, [form.state_id]);

  /* -------------------- UPDATE FORM -------------------- */
  const updateForm = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  /* -------------------- SUBMIT UPDATED PROFILE -------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !userId) return;

    setSaving(true);

    const payload = {
      full_name: form.full_name,
      relationship: form.relationship,
      date_of_birth: form.date_of_birth,
      gender: form.gender,
      blood_group: form.blood_group,
      address: {
        street: form.street,
        landmark: form.landmark,
        country_id: Number(form.country_id),
        state_id: Number(form.state_id),
        city_id: Number(form.city_id),
        postal_code: form.postal_code,
      },
    };

    try {
      await axios.put(`${BASE_URL}/api/patients/update/${userId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Profile updated successfully!");
      router.back();
    } catch (err) {
      toast.error("Update failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  /* -------------------- LOADING STATE -------------------- */
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

  return (
    <section className="w-full min-h-screen bg-[#ebecdf] py-4 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-[900px] mx-auto">
        
        {/* HEADER */}
        <div className="mb-8">
          
          <h2 className="text-[34px] leading-[40px] font-bold text-[#1b1b1b] mb-4">
            Update Profile Details
          </h2>
          {/* <div className="w-12 h-[3px] bg-[#1b1b1b]"></div> */}
        </div>

        {/* MAIN FORM CARD */}
        <div className="bg-[#f4f4f2] rounded-2xl p-6 md:p-10 shadow-sm border border-[#d6d1c4]">
          <form onSubmit={handleSubmit} className="space-y-12">
            
            {/* PERSONAL DETAILS SECTION */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-[#C5D82D] flex items-center justify-center shrink-0">
                  <User size={20} className="text-[#1b1b1b]" />
                </div>
                <h3 className="text-xl font-bold text-[#1b1b1b]">Personal Details</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input label="Full Name" value={form.full_name} onChange={(e: any) => updateForm("full_name", e.target.value)} required />
                <Input label="Relationship" value={form.relationship} onChange={(e: any) => updateForm("relationship", e.target.value)} />
                <Input type="date" label="Date of Birth" value={form.date_of_birth} onChange={(e: any) => updateForm("date_of_birth", e.target.value)} />
                
                {/* Custom Gender Select */}
                <Select 
                  label="Gender" 
                  value={form.gender} 
                  options={[{id: 'Male', name: 'Male'}, {id: 'Female', name: 'Female'}, {id: 'Other', name: 'Other'}]} 
                  onChange={(e: any) => updateForm("gender", e.target.value)} 
                />
                
                <Input label="Blood Group" value={form.blood_group} onChange={(e: any) => updateForm("blood_group", e.target.value)} placeholder="e.g. O+, A-" />
              </div>
            </div>

            {/* <div className="w-full h-[1px] bg-[#d6d1c4]"></div> */}

            {/* ADDRESS DETAILS SECTION */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-[#C5D82D] flex items-center justify-center shrink-0">
                  <MapPin size={20} className="text-[#1b1b1b]" />
                </div>
                <h3 className="text-xl font-bold text-[#1b1b1b]">Address Details</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input label="Street" value={form.street} onChange={(e: any) => updateForm("street", e.target.value)} placeholder="House/Flat No., Street Name" />
                <Input label="Landmark" value={form.landmark} onChange={(e: any) => updateForm("landmark", e.target.value)} placeholder="Nearby landmark" />

                <Select label="Country" value={form.country_id} options={countries} onChange={(e: any) => updateForm("country_id", e.target.value)} />
                <Select label="State" value={form.state_id} options={states} onChange={(e: any) => updateForm("state_id", e.target.value)} disabled={!form.country_id} />
                <Select label="City" value={form.city_id} options={cities} onChange={(e: any) => updateForm("city_id", e.target.value)} disabled={!form.state_id} />

                <Input label="Pincode" value={form.postal_code} onChange={(e: any) => updateForm("postal_code", e.target.value)} />
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <div className=" flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="w-full md:w-auto min-w-[200px] bg-[#C5D82D] text-gray-900 py-4 px-8 rounded-md font-bold text-lg hover:opacity-90 transition-all flex justify-center items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------
   PREMIUM INPUT COMPONENT
------------------------------------- */
function Input({ label, value, onChange, type = "text", placeholder, required = false }: any) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-[#1b1b1b]">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        required={required}
        placeholder={placeholder}
        className="border border-[#d6d1c4] rounded-lg px-4 py-3 w-full bg-white focus:outline-none focus:ring-2 focus:ring-[#1b1b1b] transition-all text-[#1b1b1b] placeholder:text-gray-400"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

/* ------------------------------------
   PREMIUM SELECT COMPONENT
------------------------------------- */
function Select({ label, value, options, onChange, disabled = false }: any) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-[#1b1b1b]">
        {label}
      </label>
      <select 
        className="border border-[#d6d1c4] rounded-lg px-4 py-3 w-full bg-white focus:outline-none focus:ring-2 focus:ring-[#1b1b1b] transition-all text-[#1b1b1b] disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed" 
        value={value} 
        onChange={onChange}
        disabled={disabled}
      >
        <option value="">Select {label}</option>
        {options?.map((o: any) => (
          <option key={o.id} value={o.id}>
            {o.name}
          </option>
        ))}
      </select>
    </div>
  );
}