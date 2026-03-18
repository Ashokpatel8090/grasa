"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, Plus, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

const API_BASE_URL = "https://medicaps.cloud/api/locations";

const cn = (...classes: (string | false | undefined)[]) =>
  classes.filter(Boolean).join(" ");

interface Address {
  id: number;
  street: string;
  landmark?: string | null;
  postal_code: string;
  city: string;
  state: string;
  country: string;
  city_id: number;
  state_id: number;
  country_id: number;
  address_type?: string;
  created_at?: string;
}

interface Option {
  id: number;
  name: string;
}

export default function AddressSection(props: {
  token: string | null;
  selectedAddressId: number | null;
  setSelectedAddressId: (id: number | null) => void;
  selectedDate: string;
  setSelectedDate: (d: string) => void;
  showDeliveryPopup: boolean;
  setShowDeliveryPopup: (v: boolean) => void;
  setLoadingPaymentMeta: (v: boolean) => void;
}) {
  const {
    token,
    selectedAddressId,
    setSelectedAddressId,
    selectedDate,
    setSelectedDate,
    showDeliveryPopup,
    setShowDeliveryPopup,
    setLoadingPaymentMeta,
  } = props;

  // NEW DATE ERROR
  const [dateError, setDateError] = useState("");

  useEffect(() => {
    if (!selectedDate) setDateError("Please select a delivery date");
    else setDateError("");
  }, [selectedDate]);

  // UI + addresses
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [editing, setEditing] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [pincodeVerifying, setPincodeVerifying] = useState(false);

  // dropdown lists
  const [countries, setCountries] = useState<Option[]>([]);
  const [states, setStates] = useState<Option[]>([]);
  const [cities, setCities] = useState<Option[]>([]);

  // Address form state
  const [form, setForm] = useState<any>({
    street: "",
    landmark: "",
    postal_code: "",
    country_id: 0,
    state_id: 0,
    city_id: 0,
    country: "",
    state: "",
    city: "",
    address_type: "home",
    phone: "",
  });

  // ------------------------------------------
  // ⭐ UPDATED: AUTO-FILL DELIVERY DATE from LOCAL STORAGE and OPEN/HIDE POPUP
  // ------------------------------------------
  useEffect(() => {
    // run once on mount
    try {
      if (typeof window === "undefined") return;

      const raw = localStorage.getItem("selectedDelivery");

      if (raw) {
        const parsed = JSON.parse(raw);
        const storedIsoDate = parsed?.date;

        if (storedIsoDate) {
          const d = new Date(storedIsoDate);
          if (!isNaN(d.getTime())) {
            const formatted = d.toISOString().split("T")[0];
            // populate the date input
            setSelectedDate(formatted);

            // IMPORTANT: hide the delivery popup to avoid flashing it open
            // (CheckoutPage auto-open checks localStorage too, but hide here for safety)
            setShowDeliveryPopup(false);

            // Optionally show a small success hint
            toast.success("Delivery date auto-filled from recent order.");
          }
        }

        // Remove after reading (we keep the value)
        localStorage.removeItem("selectedDelivery");
      } else {
        // nothing stored: keep whatever showDeliveryPopup currently is (CheckoutPage may auto-open after 2s)
        // But if parent explicitly wants open and we don't have a date, ensure it is shown:
        if (showDeliveryPopup && !selectedDate) {
          setShowDeliveryPopup(true);
        }
      }
    } catch (err) {
      console.warn("Failed to load auto delivery date", err);
    }
    // only run on mount; include setters so linter is happy
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setSelectedDate, setShowDeliveryPopup]);
  // ------------------------------------------
  // END AUTO-FILL LOGIC
  // ------------------------------------------

  // FETCH ADDRESSES
  const fetchAddresses = useCallback(
    async (initial = false) => {
      if (initial) setLoading(true);
      try {
        const headers: any = {};
        if (token) headers.Authorization = `Bearer ${token}`;

        const res = await fetch(`${API_BASE_URL}/addresses`, { headers });
        if (!res.ok) throw new Error("Failed to load");

        const data = await res.json();
        const items = data.items || [];

        setAddresses(items);

        if (!selectedAddressId && items.length > 0) {
          setSelectedAddressId(items[0].id);
        } else {
          // const exists = items.some((a) => a.id === selectedAddressId);
          const exists = items.some((a: any) => a.id === selectedAddressId);
          if (!exists && items.length > 0) {
            setSelectedAddressId(items[0].id);
          }
        }
      } catch {
        toast.error("Unable to load addresses");
      } finally {
        if (initial) setLoading(false);
      }
    },
    [token, selectedAddressId, setSelectedAddressId]
  );

  // FETCH LOCATION LISTS
  const fetchAllLocations = useCallback(async () => {
    try {
      const c = await fetch(`${API_BASE_URL}/countrylist`);
      setCountries(c.ok ? await c.json() : []);
    } catch {}
  }, []);

  useEffect(() => {
    (async () => {
      await Promise.all([fetchAddresses(true), fetchAllLocations()]);
      setLoadingPaymentMeta(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Dependent states
  useEffect(() => {
    if (form.country_id > 0) {
      fetch(`${API_BASE_URL}/statelist?country_id=${form.country_id}`)
        .then((r) => (r.ok ? r.json() : []))
        .then(setStates);
    } else setStates([]);
    setCities([]);
  }, [form.country_id]);

  useEffect(() => {
    if (form.state_id > 0) {
      fetch(`${API_BASE_URL}/citylist?state_id=${form.state_id}`)
        .then((r) => (r.ok ? r.json() : []))
        .then(setCities);
    } else setCities([]);
  }, [form.state_id]);

  // RESET FORM
  const resetForm = () => {
    setForm({
      street: "",
      landmark: "",
      postal_code: "",
      country_id: 0,
      state_id: 0,
      city_id: 0,
      country: "",
      state: "",
      city: "",
      address_type: "home",
      phone: "",
    });
    setStates([]);
    setCities([]);
    setEditing(null);
    setShowForm(false);
  };

  // const handlePostalChange = (v: string) => {
  //   const clean = v.replace(/\D/g, "").slice(0, 6);
  //   setForm((p: any) => ({ ...p, postal_code: clean }));
  // };

  // PINCODE AUTOFILL
  
  const handlePostalChange = async (v: string) => {
  const clean = v.replace(/\D/g, "").slice(0, 6);

  setForm((p: any) => ({ ...p, postal_code: clean }));

  // Run autofill automatically when 6 digits entered
  if (clean.length !== 6) return;

  try {
    setPincodeVerifying(true);

    const res = await fetch(`${API_BASE_URL}/addresses/autofill`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ pincode: clean }),
    });

    const text = await res.text();
    if (!res.ok) throw new Error(text);

    const data = JSON.parse(text);


    if (data.valid == false) {
      toast.error("Enter valid pin");
      return;
    }

    const c = data.country;
    const s = data.state;
    const ci = data.city;

    const countryId = c?.id ?? 0;
    const stateId = s?.id ?? 0;
    const cityId = ci?.id ?? 0;

    if (countryId) {
      const r = await fetch(`${API_BASE_URL}/statelist?country_id=${countryId}`);
      setStates(r.ok ? await r.json() : []);
    }

    if (stateId) {
      const r = await fetch(`${API_BASE_URL}/citylist?state_id=${stateId}`);
      setCities(r.ok ? await r.json() : []);
    }

    setForm((prev: any) => ({
      ...prev,
      country_id: countryId,
      state_id: stateId,
      city_id: cityId,
      country: c?.name ?? "",
      state: s?.name ?? "",
      city: ci?.name ?? "",
    }));

    toast.success("Autofilled successfully");
  } catch {
    toast.error("Autofill failed");
  } finally {
    setPincodeVerifying(false);
  }
};
  
  
  
  
  
  const handleVerifyPincode = async () => {
    if (!form.postal_code || form.postal_code.length !== 6)
      return toast.error("Enter valid 6 digit pincode");

    try {
      setPincodeVerifying(true);

      const res = await fetch(`${API_BASE_URL}/addresses/autofill`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ pincode: form.postal_code }),
      });

      const text = await res.text();
      if (!res.ok) throw new Error(text);

      const data = JSON.parse(text);

      const c = data.country;
      const s = data.state;
      const ci = data.city;

      const countryId = c?.id ?? 0;
      const stateId = s?.id ?? 0;
      const cityId = ci?.id ?? 0;

      if (countryId) {
        const r = await fetch(`${API_BASE_URL}/statelist?country_id=${countryId}`);
        setStates(r.ok ? await r.json() : []);
      }

      if (stateId) {
        const r = await fetch(`${API_BASE_URL}/citylist?state_id=${stateId}`);
        setCities(r.ok ? await r.json() : []);
      }

      setForm((prev: any) => ({
        ...prev,
        country_id: countryId,
        state_id: stateId,
        city_id: cityId,
        country: c?.name ?? "",
        state: s?.name ?? "",
        city: ci?.name ?? "",
      }));

      toast.success("Autofilled successfully");
    } catch {
      toast.error("Autofill failed");
    } finally {
      setPincodeVerifying(false);
    }
  };

  // SAVE
  const handleSave = async () => {
    if (!form.street || !form.postal_code || !form.country_id || !form.state_id || !form.city_id) {
      toast.error("Please fill required fields");
      return;
    }

    try {
      setAdding(true);

      const url = editing
        ? `${API_BASE_URL}/addresses/${editing}`
        : `${API_BASE_URL}/addresses`;

      const method = editing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          street: form.street,
          landmark: form.landmark || "",
          postal_code: form.postal_code,
          city_id: form.city_id,
          state_id: form.state_id,
          country_id: form.country_id,
          address_type: form.address_type,
        }),
      });

      if (!res.ok) throw new Error("Failed");

      toast.success(editing ? "Updated" : "Added");
      resetForm();
      fetchAddresses();
    } catch {
      toast.error("Failed to save");
    } finally {
      setAdding(false);
    }
  };

  // DELETE
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this address?")) return;

    try {
      setDeleting(id);

      const res = await fetch(`${API_BASE_URL}/addresses/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) throw new Error("Failed to delete");

      toast.success("Deleted");

      const updated = addresses.filter((x) => x.id !== id);
      setAddresses(updated);

      if (selectedAddressId === id) {
        setSelectedAddressId(updated[0]?.id ?? null);
      }
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleting(null);
    }
  };

  // DELIVERY DATE LIMIT
  const minDeliveryDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toISOString().split("T")[0];
  })();

  return (
    <div>
      {/* ADDRESS LIST */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <MapPin /> Saved Addresses ({addresses.length})
          </h2>

          <Button onClick={() => { resetForm(); setShowForm(true); }}>
            <Plus className="w-4 h-4" /> Add Address
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="animate-spin w-8 h-8" />
          </div>
        ) : addresses.length === 0 ? (
          <div className="text-center p-12 bg-gray-100 border rounded">
            <AlertTriangle className="w-8 h-8 text-orange-500 mx-auto" />
            <p>No saved addresses</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {addresses.map((a) => (
              <div
                key={a.id}
                className={cn(
                  "border rounded-lg bg-white p-4 cursor-pointer hover:shadow",
                  selectedAddressId === a.id ? "ring-2 ring-green-500" : ""
                )}
                onClick={() => setSelectedAddressId(a.id)}
              >
                <div className="flex justify-between">
                  <div>
                    <div className="font-semibold">{a.street}</div>
                    {a.landmark && <div className="text-sm">{a.landmark}</div>}
                    <div className="text-sm">{a.city}, {a.state}</div>
                    <div className="text-sm">{a.country} - {a.postal_code}</div>
                  </div>

                  <div onClick={(e) => e.stopPropagation()}>
                    <Button
                      size="sm"
                      className="bg-yellow-200 hover:bg-yellow-300 text-gray-800 mr-2"
                      onClick={() => {
                        setEditing(a.id);
                        setForm((prev: any) => ({
                          ...prev,
                          street: a.street ?? "",
                          landmark: a.landmark ?? "",
                          postal_code: a.postal_code ?? "",
                          country_id: a.country_id ?? 0,
                          state_id: a.state_id ?? 0,
                          city_id: a.city_id ?? 0,
                        }));
                        setShowForm(true);
                      }}
                    >
                      Edit
                    </Button>

                    <Button
                      size="sm"
                      className="bg-red-500 text-white"
                      disabled={deleting === a.id}
                      onClick={() => handleDelete(a.id)}
                    >
                      {deleting === a.id ? "..." : "Delete"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* DELIVERY DATE FIELD */}
      <section className="mb-6">
        <label className="text-md font-semibold">Delivery Date:</label>

        {/* NEW INFO TEXT */}
        <p className="text-sm text-gray-700 mt-1">
          Delivery = <span className="font-semibold">Next Bake Day</span> (based on bake timer)
        </p>

        <input
          type="date"
          min={minDeliveryDate}
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className={cn(
            "border rounded px-3 py-2 mt-2",
            dateError ? "border-gray-300" : ""
          )}
        />

        {dateError && (
          <p className="text-red-500 text-sm mt-1">{dateError}</p>
        )}
      </section>


      {/* ADDRESS FORM MODAL */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetForm}
          >
            <motion.div
              className="bg-white rounded-xl p-6 w-full max-w-xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-semibold text-lg mb-4">
                {editing ? "Edit Address" : "Add New Address"}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  className="border rounded px-3 py-2"
                  placeholder="Full Address"
                  value={form.street}
                  onChange={(e) => setForm({ ...form, street: e.target.value })}
                />

                <input
                  className="border rounded px-3 py-2"
                  placeholder="Landmark"
                  value={form.landmark}
                  onChange={(e) => setForm({ ...form, landmark: e.target.value })}
                />

                <select
                  className="border rounded px-3 py-2"
                  value={form.country_id}
                  onChange={(e) =>
                    setForm({ ...form, country_id: Number(e.target.value) })
                  }
                >
                  <option value={0}>Choose Country</option>
                  {countries.map((x) => (
                    <option key={x.id} value={x.id}>{x.name}</option>
                  ))}
                </select>

                <select
                  className="border rounded px-3 py-2"
                  value={form.state_id}
                  onChange={(e) =>
                    setForm({ ...form, state_id: Number(e.target.value) })
                  }
                >
                  <option value={0}>Choose State</option>
                  {states.map((x) => (
                    <option key={x.id} value={x.id}>{x.name}</option>
                  ))}
                </select>

                <select
                  className="border rounded px-3 py-2"
                  value={form.city_id}
                  onChange={(e) =>
                    setForm({ ...form, city_id: Number(e.target.value) })
                  }
                >
                  <option value={0}>Choose City</option>
                  {cities.map((x) => (
                    <option key={x.id} value={x.id}>{x.name}</option>
                  ))}
                </select>

                <input
                  className="border rounded px-3 py-2"
                  placeholder="Pincode"
                  value={form.postal_code}
                  onChange={(e) => handlePostalChange(e.target.value)}
                />

                {/* <Button
                  className="col-span-2"
                  disabled={pincodeVerifying}
                  onClick={handleVerifyPincode}
                >
                  {pincodeVerifying ? "Autofilling..." : "Autofill by Pincode"}
                </Button> */}

                <div className="col-span-2 flex justify-end gap-3 mt-3">
                  <Button className="bg-gray-400 hover:bg-gray-500" variant="ghost" onClick={resetForm}>
                    Cancel
                  </Button>

                  <Button disabled={adding} onClick={handleSave}>
                    {adding ? "Saving..." : editing ? "Update" : "Save"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
