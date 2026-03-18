"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

/* ---------------- COOKIE UTILITY ---------------- */
const getCookie = (name: string) => {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : "";
};

export default function UpdateProfile() {
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
      .get(`https://medicaps.cloud/api/patients/${userId}`, {
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
    fetch("https://medicaps.cloud/api/locations/countrylist")
      .then((res) => res.json())
      .then(setCountries);
  }, []);

  /* -------------------- STATE LIST -------------------- */
  useEffect(() => {
    if (!form.country_id) return;

    fetch(
      `https://medicaps.cloud/api/locations/statelist?country_id=${form.country_id}`
    )
      .then((res) => res.json())
      .then(setStates);
  }, [form.country_id]);

  /* -------------------- CITY LIST -------------------- */
  useEffect(() => {
    if (!form.state_id) return;

    fetch(
      `https://medicaps.cloud/api/locations/citylist?state_id=${form.state_id}`
    )
      .then((res) => res.json())
      .then(setCities);
  }, [form.state_id]);

  /* -------------------- UPDATE FORM -------------------- */
  const updateForm = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  /* -------------------- SUBMIT UPDATED PROFILE -------------------- */
  const handleSubmit = async () => {
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

    console.log(payload)

    try {
      await axios.put(
        `https://medicaps.cloud/api/patients/update/${userId}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Profile updated successfully!");
    } catch (err) {
      alert("Update failed");
    }

    setSaving(false);
  };

  /* -------------------- LOADING STATE -------------------- */
  if (loading)
    return <p className="text-center p-10 text-lg">Loading profile...</p>;

  return (
    <Card className="max-w-4xl mx-auto p-6 mt-10 shadow-lg">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">Update Profile</CardTitle>
      </CardHeader>

      <CardContent className="space-y-10">
        {/* PERSONAL DETAILS */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Personal Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Full Name" value={form.full_name} onChange={(e) => updateForm("full_name", e.target.value)} />
            <Input label="Relationship" value={form.relationship} onChange={(e) => updateForm("relationship", e.target.value)} />
            <Input type="date" label="Date of Birth" value={form.date_of_birth} onChange={(e) => updateForm("date_of_birth", e.target.value)} />
            <Input label="Gender" value={form.gender} onChange={(e) => updateForm("gender", e.target.value)} />
            <Input label="Blood Group" value={form.blood_group} onChange={(e) => updateForm("blood_group", e.target.value)} />
          </div>
        </div>

        {/* ADDRESS DETAILS */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Address Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Street" value={form.street} onChange={(e) => updateForm("street", e.target.value)} />
            <Input label="Landmark" value={form.landmark} onChange={(e) => updateForm("landmark", e.target.value)} />

            <Select label="Country" value={form.country_id} options={countries} onChange={(e) => updateForm("country_id", e.target.value)} />
            <Select label="State" value={form.state_id} options={states} onChange={(e) => updateForm("state_id", e.target.value)} />
            <Select label="City" value={form.city_id} options={cities} onChange={(e) => updateForm("city_id", e.target.value)} />

            <Input label="Pincode" value={form.postal_code} onChange={(e) => updateForm("postal_code", e.target.value)} />
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="py-3 px-6 text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700"
          >
            {saving ? "Saving..." : "Update Profile"}
          </button>
        </div>

      </CardContent>
    </Card>
  );
}

/* ------------------------------------
   INPUT COMPONENT
------------------------------------- */
function Input({ label, value, onChange, type = "text" }: any) {
  return (
    <div>
      <label className="block mb-1 text-gray-700">{label}</label>
      <input
        type={type}
        className="w-full p-3 border rounded-lg"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

/* ------------------------------------
   SELECT COMPONENT
------------------------------------- */
function Select({ label, value, options, onChange }: any) {
  return (
    <div>
      <label className="block mb-1 text-gray-700">{label}</label>
      <select className="w-full p-3 border rounded-lg" value={value} onChange={onChange}>
        <option value="">Select {label}</option>
        {options.map((o: any) => (
          <option key={o.id} value={o.id}>
            {o.name}
          </option>
        ))}
      </select>
    </div>
  );
}
