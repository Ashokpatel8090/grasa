// "use client";

// import React, { useCallback, useEffect, useMemo, useState } from "react";
// import { AnimatePresence, motion } from "framer-motion";
// import { MapPin, Plus, AlertTriangle, Loader2 } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import toast from "react-hot-toast";
// import { BASE_URL } from "@/components/config/api";



// const API_BASE_URL = `${BASE_URL}/api/locations`;
// const cn = (...classes: (string | false | undefined)[]) =>
//   classes.filter(Boolean).join(" ");

// interface Address {
//   id: number;
//   street: string;
//   landmark?: string | null;
//   postal_code: string;
//   city: string;
//   state: string;
//   country: string;
//   city_id: number;
//   state_id: number;
//   country_id: number;
//   address_type?: string;
//   created_at?: string;
// }

// interface Option {
//   id: number;
//   name: string;
// }

// export default function AddressSection(props: {
//   token: string | null;
//   selectedAddressId: number | null;
//   setSelectedAddressId: (id: number | null) => void;
//   selectedDate: string;
//   setSelectedDate: (d: string) => void;
//   showDeliveryPopup: boolean;
//   setShowDeliveryPopup: (v: boolean) => void;
//   setLoadingPaymentMeta: (v: boolean) => void;
// }) {
//   const {
//     token,
//     selectedAddressId,
//     setSelectedAddressId,
//     selectedDate,
//     setSelectedDate,
//     showDeliveryPopup,
//     setShowDeliveryPopup,
//     setLoadingPaymentMeta,
//   } = props;

//   // NEW DATE ERROR
//   const [dateError, setDateError] = useState("");

//   useEffect(() => {
//     if (!selectedDate) setDateError("Please select a delivery date");
//     else setDateError("");
//   }, [selectedDate]);

//   // UI + addresses
//   const [addresses, setAddresses] = useState<Address[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [adding, setAdding] = useState(false);
//   const [deleting, setDeleting] = useState<number | null>(null);
//   const [editing, setEditing] = useState<number | null>(null);
//   const [showForm, setShowForm] = useState(false);

//   const [pincodeVerifying, setPincodeVerifying] = useState(false);

//   // dropdown lists
//   const [countries, setCountries] = useState<Option[]>([]);
//   const [states, setStates] = useState<Option[]>([]);
//   const [cities, setCities] = useState<Option[]>([]);

//   // Address form state
//   const [form, setForm] = useState<any>({
//     street: "",
//     landmark: "",
//     postal_code: "",
//     country_id: 0,
//     state_id: 0,
//     city_id: 0,
//     country: "",
//     state: "",
//     city: "",
//     address_type: "home",
//     phone: "",
//   });

//   // ------------------------------------------
//   // ⭐ UPDATED: AUTO-FILL DELIVERY DATE from LOCAL STORAGE and OPEN/HIDE POPUP
//   // ------------------------------------------
//   useEffect(() => {
//     // run once on mount
//     try {
//       if (typeof window === "undefined") return;

//       const raw = localStorage.getItem("selectedDelivery");

//       if (raw) {
//         const parsed = JSON.parse(raw);
//         const storedIsoDate = parsed?.date;

//         if (storedIsoDate) {
//           const d = new Date(storedIsoDate);
//           if (!isNaN(d.getTime())) {
//             const formatted = d.toISOString().split("T")[0];
//             // populate the date input
//             setSelectedDate(formatted);

//             // IMPORTANT: hide the delivery popup to avoid flashing it open
//             // (CheckoutPage auto-open checks localStorage too, but hide here for safety)
//             setShowDeliveryPopup(false);

//             // Optionally show a small success hint
//             toast.success("Delivery date auto-filled from recent order.");
//           }
//         }

//         // Remove after reading (we keep the value)
//         localStorage.removeItem("selectedDelivery");
//       } else {
//         // nothing stored: keep whatever showDeliveryPopup currently is (CheckoutPage may auto-open after 2s)
//         // But if parent explicitly wants open and we don't have a date, ensure it is shown:
//         if (showDeliveryPopup && !selectedDate) {
//           setShowDeliveryPopup(true);
//         }
//       }
//     } catch (err) {
//       console.warn("Failed to load auto delivery date", err);
//     }
//     // only run on mount; include setters so linter is happy
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [setSelectedDate, setShowDeliveryPopup]);
//   // ------------------------------------------
//   // END AUTO-FILL LOGIC
//   // ------------------------------------------

//   // FETCH ADDRESSES
//   const fetchAddresses = useCallback(
//     async (initial = false) => {
//       if (initial) setLoading(true);
//       try {
//         const headers: any = {};
//         if (token) headers.Authorization = `Bearer ${token}`;

//         const res = await fetch(`${API_BASE_URL}/addresses`, { headers });
//         if (!res.ok) throw new Error("Failed to load");

//         const data = await res.json();
//         const items = data.items || [];

//         setAddresses(items);

//         if (!selectedAddressId && items.length > 0) {
//           setSelectedAddressId(items[0].id);
//         } else {
//           // const exists = items.some((a) => a.id === selectedAddressId);
//           const exists = items.some((a: any) => a.id === selectedAddressId);
//           if (!exists && items.length > 0) {
//             setSelectedAddressId(items[0].id);
//           }
//         }
//       } catch {
//         toast.error("Unable to load addresses");
//       } finally {
//         if (initial) setLoading(false);
//       }
//     },
//     [token, selectedAddressId, setSelectedAddressId]
//   );

//   // FETCH LOCATION LISTS
//   const fetchAllLocations = useCallback(async () => {
//     try {
//       const c = await fetch(`${API_BASE_URL}/countrylist`);
//       setCountries(c.ok ? await c.json() : []);
//     } catch {}
//   }, []);

//   useEffect(() => {
//     (async () => {
//       await Promise.all([fetchAddresses(true), fetchAllLocations()]);
//       setLoadingPaymentMeta(false);
//     })();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // Dependent states
//   useEffect(() => {
//     if (form.country_id > 0) {
//       fetch(`${API_BASE_URL}/statelist?country_id=${form.country_id}`)
//         .then((r) => (r.ok ? r.json() : []))
//         .then(setStates);
//     } else setStates([]);
//     setCities([]);
//   }, [form.country_id]);

//   useEffect(() => {
//     if (form.state_id > 0) {
//       fetch(`${API_BASE_URL}/citylist?state_id=${form.state_id}`)
//         .then((r) => (r.ok ? r.json() : []))
//         .then(setCities);
//     } else setCities([]);
//   }, [form.state_id]);

//   // RESET FORM
//   const resetForm = () => {
//     setForm({
//       street: "",
//       landmark: "",
//       postal_code: "",
//       country_id: 0,
//       state_id: 0,
//       city_id: 0,
//       country: "",
//       state: "",
//       city: "",
//       address_type: "home",
//       phone: "",
//     });
//     setStates([]);
//     setCities([]);
//     setEditing(null);
//     setShowForm(false);
//   };

//   // const handlePostalChange = (v: string) => {
//   //   const clean = v.replace(/\D/g, "").slice(0, 6);
//   //   setForm((p: any) => ({ ...p, postal_code: clean }));
//   // };

//   // PINCODE AUTOFILL
  
//   const handlePostalChange = async (v: string) => {
//   const clean = v.replace(/\D/g, "").slice(0, 6);

//   setForm((p: any) => ({ ...p, postal_code: clean }));

//   // Run autofill automatically when 6 digits entered
//   if (clean.length !== 6) return;

//   try {
//     setPincodeVerifying(true);

//     const res = await fetch(`${API_BASE_URL}/addresses/autofill`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         ...(token ? { Authorization: `Bearer ${token}` } : {}),
//       },
//       body: JSON.stringify({ pincode: clean }),
//     });

//     const text = await res.text();
//     if (!res.ok) throw new Error(text);

//     const data = JSON.parse(text);


//     if (data.valid == false) {
//       toast.error("Enter valid pin");
//       return;
//     }

//     const c = data.country;
//     const s = data.state;
//     const ci = data.city;

//     const countryId = c?.id ?? 0;
//     const stateId = s?.id ?? 0;
//     const cityId = ci?.id ?? 0;

//     if (countryId) {
//       const r = await fetch(`${API_BASE_URL}/statelist?country_id=${countryId}`);
//       setStates(r.ok ? await r.json() : []);
//     }

//     if (stateId) {
//       const r = await fetch(`${API_BASE_URL}/citylist?state_id=${stateId}`);
//       setCities(r.ok ? await r.json() : []);
//     }

//     setForm((prev: any) => ({
//       ...prev,
//       country_id: countryId,
//       state_id: stateId,
//       city_id: cityId,
//       country: c?.name ?? "",
//       state: s?.name ?? "",
//       city: ci?.name ?? "",
//     }));

//     toast.success("Autofilled successfully");
//   } catch {
//     toast.error("Autofill failed");
//   } finally {
//     setPincodeVerifying(false);
//   }
// };
  
  
  
  
  
//   const handleVerifyPincode = async () => {
//     if (!form.postal_code || form.postal_code.length !== 6)
//       return toast.error("Enter valid 6 digit pincode");

//     try {
//       setPincodeVerifying(true);

//       const res = await fetch(`${API_BASE_URL}/addresses/autofill`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           ...(token ? { Authorization: `Bearer ${token}` } : {}),
//         },
//         body: JSON.stringify({ pincode: form.postal_code }),
//       });

//       const text = await res.text();
//       if (!res.ok) throw new Error(text);

//       const data = JSON.parse(text);

//       const c = data.country;
//       const s = data.state;
//       const ci = data.city;

//       const countryId = c?.id ?? 0;
//       const stateId = s?.id ?? 0;
//       const cityId = ci?.id ?? 0;

//       if (countryId) {
//         const r = await fetch(`${API_BASE_URL}/statelist?country_id=${countryId}`);
//         setStates(r.ok ? await r.json() : []);
//       }

//       if (stateId) {
//         const r = await fetch(`${API_BASE_URL}/citylist?state_id=${stateId}`);
//         setCities(r.ok ? await r.json() : []);
//       }

//       setForm((prev: any) => ({
//         ...prev,
//         country_id: countryId,
//         state_id: stateId,
//         city_id: cityId,
//         country: c?.name ?? "",
//         state: s?.name ?? "",
//         city: ci?.name ?? "",
//       }));

//       toast.success("Autofilled successfully");
//     } catch {
//       toast.error("Autofill failed");
//     } finally {
//       setPincodeVerifying(false);
//     }
//   };

//   // SAVE
//   const handleSave = async () => {
//     if (!form.street || !form.postal_code || !form.country_id || !form.state_id || !form.city_id) {
//       toast.error("Please fill required fields");
//       return;
//     }

//     try {
//       setAdding(true);

//       const url = editing
//         ? `${API_BASE_URL}/addresses/${editing}`
//         : `${API_BASE_URL}/addresses`;

//       const method = editing ? "PUT" : "POST";

//       const res = await fetch(url, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//           ...(token ? { Authorization: `Bearer ${token}` } : {}),
//         },
//         body: JSON.stringify({
//           street: form.street,
//           landmark: form.landmark || "",
//           postal_code: form.postal_code,
//           city_id: form.city_id,
//           state_id: form.state_id,
//           country_id: form.country_id,
//           address_type: form.address_type,
//         }),
//       });

//       if (!res.ok) throw new Error("Failed");

//       toast.success(editing ? "Updated" : "Added");
//       resetForm();
//       fetchAddresses();
//     } catch {
//       toast.error("Failed to save");
//     } finally {
//       setAdding(false);
//     }
//   };

//   // DELETE
//   const handleDelete = async (id: number) => {
//     if (!confirm("Delete this address?")) return;

//     try {
//       setDeleting(id);

//       const res = await fetch(`${API_BASE_URL}/addresses/${id}`, {
//         method: "DELETE",
//         headers: token ? { Authorization: `Bearer ${token}` } : {},
//       });

//       if (!res.ok) throw new Error("Failed to delete");

//       toast.success("Deleted");

//       const updated = addresses.filter((x) => x.id !== id);
//       setAddresses(updated);

//       if (selectedAddressId === id) {
//         setSelectedAddressId(updated[0]?.id ?? null);
//       }
//     } catch {
//       toast.error("Delete failed");
//     } finally {
//       setDeleting(null);
//     }
//   };

//   // DELIVERY DATE LIMIT
//   const minDeliveryDate = (() => {
//     const d = new Date();
//     d.setDate(d.getDate() + 5);
//     return d.toISOString().split("T")[0];
//   })();

//   return (
//     <div>
//       {/* ADDRESS LIST */}
//       <section className="mb-6">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-xl font-semibold flex items-center gap-2">
//             <MapPin /> Saved Addresses ({addresses.length})
//           </h2>

//           <Button onClick={() => { resetForm(); setShowForm(true); }}>
//             <Plus className="w-4 h-4" /> Add Address
//           </Button>
//         </div>

//         {loading ? (
//           <div className="flex justify-center p-8">
//             <Loader2 className="animate-spin w-8 h-8" />
//           </div>
//         ) : addresses.length === 0 ? (
//           <div className="text-center p-12 bg-gray-100 border rounded">
//             <AlertTriangle className="w-8 h-8 text-orange-500 mx-auto" />
//             <p>No saved addresses</p>
//           </div>
//         ) : (
//           <div className="grid sm:grid-cols-2 gap-4">
//             {addresses.map((a) => (
//               <div
//                 key={a.id}
//                 className={cn(
//                   "border rounded-lg bg-white p-4 cursor-pointer hover:shadow",
//                   selectedAddressId === a.id ? "ring-2 ring-green-500" : ""
//                 )}
//                 onClick={() => setSelectedAddressId(a.id)}
//               >
//                 <div className="flex justify-between">
//                   <div>
//                     <div className="font-semibold">{a.street}</div>
//                     {a.landmark && <div className="text-sm">{a.landmark}</div>}
//                     <div className="text-sm">{a.city}, {a.state}</div>
//                     <div className="text-sm">{a.country} - {a.postal_code}</div>
//                   </div>

//                   <div onClick={(e) => e.stopPropagation()}>
//                     <Button
//                       size="sm"
//                       className="bg-yellow-200 hover:bg-yellow-300 text-gray-800 mr-2"
//                       onClick={() => {
//                         setEditing(a.id);
//                         setForm((prev: any) => ({
//                           ...prev,
//                           street: a.street ?? "",
//                           landmark: a.landmark ?? "",
//                           postal_code: a.postal_code ?? "",
//                           country_id: a.country_id ?? 0,
//                           state_id: a.state_id ?? 0,
//                           city_id: a.city_id ?? 0,
//                         }));
//                         setShowForm(true);
//                       }}
//                     >
//                       Edit
//                     </Button>

//                     <Button
//                       size="sm"
//                       className="bg-red-500 text-white"
//                       disabled={deleting === a.id}
//                       onClick={() => handleDelete(a.id)}
//                     >
//                       {deleting === a.id ? "..." : "Delete"}
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </section>

//       {/* DELIVERY DATE FIELD */}
//       <section className="mb-6">
//         <label className="text-md font-semibold">Delivery Date:</label>

//         {/* NEW INFO TEXT */}
//         <p className="text-sm text-gray-700 mt-1">
//           Delivery = <span className="font-semibold">Next Bake Day</span> (based on bake timer)
//         </p>

//         <input
//           type="date"
//           min={minDeliveryDate}
//           value={selectedDate}
//           onChange={(e) => setSelectedDate(e.target.value)}
//           className={cn(
//             "border rounded px-3 py-2 mt-2",
//             dateError ? "border-gray-300" : ""
//           )}
//         />

//         {dateError && (
//           <p className="text-red-500 text-sm mt-1">{dateError}</p>
//         )}
//       </section>


//       {/* ADDRESS FORM MODAL */}
//       <AnimatePresence>
//         {showForm && (
//           <motion.div
//             className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={resetForm}
//           >
//             <motion.div
//               className="bg-white rounded-xl p-6 w-full max-w-xl"
//               initial={{ y: 20, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               onClick={(e) => e.stopPropagation()}
//             >
//               <h3 className="font-semibold text-lg mb-4">
//                 {editing ? "Edit Address" : "Add New Address"}
//               </h3>

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                 <input
//                   className="border rounded px-3 py-2"
//                   placeholder="Full Address"
//                   value={form.street}
//                   onChange={(e) => setForm({ ...form, street: e.target.value })}
//                 />

//                 <input
//                   className="border rounded px-3 py-2"
//                   placeholder="Landmark"
//                   value={form.landmark}
//                   onChange={(e) => setForm({ ...form, landmark: e.target.value })}
//                 />

//                 <select
//                   className="border rounded px-3 py-2"
//                   value={form.country_id}
//                   onChange={(e) =>
//                     setForm({ ...form, country_id: Number(e.target.value) })
//                   }
//                 >
//                   <option value={0}>Choose Country</option>
//                   {countries.map((x) => (
//                     <option key={x.id} value={x.id}>{x.name}</option>
//                   ))}
//                 </select>

//                 <select
//                   className="border rounded px-3 py-2"
//                   value={form.state_id}
//                   onChange={(e) =>
//                     setForm({ ...form, state_id: Number(e.target.value) })
//                   }
//                 >
//                   <option value={0}>Choose State</option>
//                   {states.map((x) => (
//                     <option key={x.id} value={x.id}>{x.name}</option>
//                   ))}
//                 </select>

//                 <select
//                   className="border rounded px-3 py-2"
//                   value={form.city_id}
//                   onChange={(e) =>
//                     setForm({ ...form, city_id: Number(e.target.value) })
//                   }
//                 >
//                   <option value={0}>Choose City</option>
//                   {cities.map((x) => (
//                     <option key={x.id} value={x.id}>{x.name}</option>
//                   ))}
//                 </select>

//                 <input
//                   className="border rounded px-3 py-2"
//                   placeholder="Pincode"
//                   value={form.postal_code}
//                   onChange={(e) => handlePostalChange(e.target.value)}
//                 />

//                 {/* <Button
//                   className="col-span-2"
//                   disabled={pincodeVerifying}
//                   onClick={handleVerifyPincode}
//                 >
//                   {pincodeVerifying ? "Autofilling..." : "Autofill by Pincode"}
//                 </Button> */}

//                 <div className="col-span-2 flex justify-end gap-3 mt-3">
//                   <Button className="bg-gray-400 hover:bg-gray-500" variant="ghost" onClick={resetForm}>
//                     Cancel
//                   </Button>

//                   <Button disabled={adding} onClick={handleSave}>
//                     {adding ? "Saving..." : editing ? "Update" : "Save"}
//                   </Button>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }











// "use client";

// import React, { useCallback, useEffect, useState } from "react";
// import { MapPin, Plus, AlertTriangle, Loader2, X } from "lucide-react";
// import toast from "react-hot-toast";
// import { BASE_URL } from "@/components/config/api";

// const API_BASE_URL = `${BASE_URL}/api/locations`;

// interface Address {
//   id: number;
//   street: string;
//   landmark?: string | null;
//   postal_code: string;
//   city: string;
//   state: string;
//   country: string;
//   city_id: number;
//   state_id: number;
//   country_id: number;
//   address_type?: string;
// }

// interface Option {
//   id: number;
//   name: string;
// }

// const cardStyle = {
//   background: "#fff",
//   borderRadius: 12,
//   border: "0.5px solid #e5e5e0",
//   padding: "20px",
//   marginBottom: 16,
// } as React.CSSProperties;

// const stepBadge = {
//   width: 24, height: 24, borderRadius: "50%",
//   background: "#C5D82D", display: "flex",
//   alignItems: "center", justifyContent: "center",
//   fontSize: 12, fontWeight: 500, color: "#1b1b1b", flexShrink: 0,
// } as React.CSSProperties;

// const sectionTitle = {
//   fontSize: 15, fontWeight: 500, marginBottom: 16,
//   display: "flex", alignItems: "center", gap: 8,
//   paddingBottom: 12, borderBottom: "0.5px solid #e5e5e0",
// } as React.CSSProperties;

// export default function AddressSection(props: {
//   token: string | null;
//   selectedAddressId: number | null;
//   setSelectedAddressId: (id: number | null) => void;
//   selectedDate: string;
//   setSelectedDate: (d: string) => void;
//   showDeliveryPopup: boolean;
//   setShowDeliveryPopup: (v: boolean) => void;
//   setLoadingPaymentMeta: (v: boolean) => void;
// }) {
//   const {
//     token, selectedAddressId, setSelectedAddressId,
//     selectedDate, setSelectedDate, setLoadingPaymentMeta,
//   } = props;

//   const [addresses, setAddresses] = useState<Address[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [deleting, setDeleting] = useState<number | null>(null);
//   const [editing, setEditing] = useState<number | null>(null);
//   const [showForm, setShowForm] = useState(false);
//   const [adding, setAdding] = useState(false);
//   const [pincodeVerifying, setPincodeVerifying] = useState(false);

//   const [countries, setCountries] = useState<Option[]>([]);
//   const [states, setStates] = useState<Option[]>([]);
//   const [cities, setCities] = useState<Option[]>([]);

//   const [form, setForm] = useState<any>({
//     street: "", landmark: "", postal_code: "",
//     country_id: 0, state_id: 0, city_id: 0, address_type: "home",
//   });

//   // Quick date options (next Wed / Sat)
//   const quickDates = (() => {
//     const today = new Date();
//     const result: { label: string; value: string; display: string }[] = [];
//     [3, 6].forEach((wd) => {
//       const d = new Date(today.getTime());
//       const day = d.getDay();
//       let delta = (wd - day + 7) % 7;
//       if (delta < 5) delta += 7; // min 5 days ahead
//       d.setDate(d.getDate() + delta);
//       const value = d.toISOString().split("T")[0];
//       const display = d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
//       result.push({ label: wd === 3 ? "Wednesday" : "Saturday", value, display });
//     });
//     return result;
//   })();

//   const minDeliveryDate = (() => {
//     const d = new Date();
//     d.setDate(d.getDate() + 5);
//     return d.toISOString().split("T")[0];
//   })();

//   // Auto-fill date from localStorage
//   useEffect(() => {
//     try {
//       const raw = localStorage.getItem("selectedDelivery");
//       if (raw) {
//         const parsed = JSON.parse(raw);
//         if (parsed?.date) {
//           const d = new Date(parsed.date);
//           if (!isNaN(d.getTime())) {
//             setSelectedDate(d.toISOString().split("T")[0]);
//           }
//         }
//         localStorage.removeItem("selectedDelivery");
//       }
//     } catch {}
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const fetchAddresses = useCallback(async (initial = false) => {
//     if (initial) setLoading(true);
//     try {
//       const headers: any = token ? { Authorization: `Bearer ${token}` } : {};
//       const res = await fetch(`${API_BASE_URL}/addresses`, { headers });
//       if (!res.ok) throw new Error();
//       const data = await res.json();
//       const items: Address[] = data.items || [];
//       setAddresses(items);
//       if (!selectedAddressId && items.length > 0) {
//         setSelectedAddressId(items[0].id);
//       } else {
//         const exists = items.some((a) => a.id === selectedAddressId);
//         if (!exists && items.length > 0) setSelectedAddressId(items[0].id);
//       }
//     } catch {
//       toast.error("Unable to load addresses");
//     } finally {
//       if (initial) setLoading(false);
//     }
//   }, [token, selectedAddressId, setSelectedAddressId]);

//   useEffect(() => {
//     (async () => {
//       const res = await fetch(`${API_BASE_URL}/countrylist`);
//       setCountries(res.ok ? await res.json() : []);
//     })();
//     fetchAddresses(true).finally(() => setLoadingPaymentMeta(false));
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   useEffect(() => {
//     if (form.country_id > 0) {
//       fetch(`${API_BASE_URL}/statelist?country_id=${form.country_id}`)
//         .then((r) => (r.ok ? r.json() : []))
//         .then(setStates);
//     } else setStates([]);
//     setCities([]);
//   }, [form.country_id]);

//   useEffect(() => {
//     if (form.state_id > 0) {
//       fetch(`${API_BASE_URL}/citylist?state_id=${form.state_id}`)
//         .then((r) => (r.ok ? r.json() : []))
//         .then(setCities);
//     } else setCities([]);
//   }, [form.state_id]);

//   const resetForm = () => {
//     setForm({ street: "", landmark: "", postal_code: "", country_id: 0, state_id: 0, city_id: 0, address_type: "home" });
//     setStates([]); setCities([]); setEditing(null); setShowForm(false);
//   };

//   const handlePostalChange = async (v: string) => {
//     const clean = v.replace(/\D/g, "").slice(0, 6);
//     setForm((p: any) => ({ ...p, postal_code: clean }));
//     if (clean.length !== 6) return;
//     try {
//       setPincodeVerifying(true);
//       const res = await fetch(`${API_BASE_URL}/addresses/autofill`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
//         body: JSON.stringify({ pincode: clean }),
//       });
//       const text = await res.text();
//       if (!res.ok) throw new Error(text);
//       const data = JSON.parse(text);
//       if (data.valid === false) { toast.error("Invalid pincode"); return; }

//       const countryId = data.country?.id ?? 0;
//       const stateId = data.state?.id ?? 0;
//       const cityId = data.city?.id ?? 0;

//       if (countryId) {
//         const r = await fetch(`${API_BASE_URL}/statelist?country_id=${countryId}`);
//         setStates(r.ok ? await r.json() : []);
//       }
//       if (stateId) {
//         const r = await fetch(`${API_BASE_URL}/citylist?state_id=${stateId}`);
//         setCities(r.ok ? await r.json() : []);
//       }
//       setForm((prev: any) => ({ ...prev, country_id: countryId, state_id: stateId, city_id: cityId }));
//       toast.success("Address autofilled");
//     } catch {
//       toast.error("Autofill failed");
//     } finally {
//       setPincodeVerifying(false);
//     }
//   };

//   const handleSave = async () => {
//     if (!form.street || !form.postal_code || !form.country_id || !form.state_id || !form.city_id) {
//       toast.error("Please fill all required fields");
//       return;
//     }
//     try {
//       setAdding(true);
//       const url = editing ? `${API_BASE_URL}/addresses/${editing}` : `${API_BASE_URL}/addresses`;
//       const method = editing ? "PUT" : "POST";
//       const res = await fetch(url, {
//         method,
//         headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
//         body: JSON.stringify({
//           street: form.street, landmark: form.landmark || "",
//           postal_code: form.postal_code, city_id: form.city_id,
//           state_id: form.state_id, country_id: form.country_id,
//           address_type: form.address_type,
//         }),
//       });
//       if (!res.ok) throw new Error();
//       toast.success(editing ? "Address updated" : "Address added");
//       resetForm();
//       fetchAddresses();
//     } catch {
//       toast.error("Failed to save address");
//     } finally {
//       setAdding(false);
//     }
//   };

//   const handleDelete = async (id: number) => {
//     if (!confirm("Delete this address?")) return;
//     try {
//       setDeleting(id);
//       const res = await fetch(`${API_BASE_URL}/addresses/${id}`, {
//         method: "DELETE",
//         headers: token ? { Authorization: `Bearer ${token}` } : {},
//       });
//       if (!res.ok) throw new Error();
//       toast.success("Address deleted");
//       const updated = addresses.filter((x) => x.id !== id);
//       setAddresses(updated);
//       if (selectedAddressId === id) setSelectedAddressId(updated[0]?.id ?? null);
//     } catch {
//       toast.error("Delete failed");
//     } finally {
//       setDeleting(null);
//     }
//   };

//   const inputStyle = {
//     border: "0.5px solid #d6d1c4", borderRadius: 8,
//     padding: "9px 12px", fontSize: 14, width: "100%",
//     background: "#fff", color: "#1b1b1b",
//   } as React.CSSProperties;

//   return (
//     <div>
//       {/* Step 1: Address */}
//       <div style={cardStyle}>
//         <div style={sectionTitle}>
//           <div style={stepBadge}>1</div>
//           <span>Delivery address</span>
//           <button
//             onClick={() => { resetForm(); setShowForm(true); }}
//             style={{
//               marginLeft: "auto", display: "flex", alignItems: "center", gap: 6,
//               background: "#f0f0e8", border: "none", borderRadius: 8,
//               padding: "6px 14px", fontSize: 13, fontWeight: 500, cursor: "pointer", color: "#1b1b1b",
//             }}
//           >
//             <Plus size={14} /> Add address
//           </button>
//         </div>

//         {loading ? (
//           <div style={{ display: "flex", justifyContent: "center", padding: 32 }}>
//             <Loader2 className="animate-spin" size={28} style={{ color: "#C5D82D" }} />
//           </div>
//         ) : addresses.length === 0 ? (
//           <div style={{ textAlign: "center", padding: "32px 16px", background: "#f9f8f4", borderRadius: 10 }}>
//             <AlertTriangle size={24} style={{ color: "#d9820a", margin: "0 auto 8px" }} />
//             <p style={{ fontSize: 14, color: "#5c5c5c" }}>No saved addresses. Add one to continue.</p>
//           </div>
//         ) : (
//           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
//             {addresses.map((a) => {
//               const isSelected = selectedAddressId === a.id;
//               return (
//                 <div
//                   key={a.id}
//                   onClick={() => setSelectedAddressId(a.id)}
//                   style={{
//                     border: `1.5px solid ${isSelected ? "#7c9b2a" : "#e5e5e0"}`,
//                     borderRadius: 10, padding: 14, cursor: "pointer",
//                     background: isSelected ? "#f8fce8" : "#fff",
//                     position: "relative", transition: "all 0.15s",
//                   }}
//                 >
//                   {isSelected && (
//                     <div style={{
//                       position: "absolute", top: 10, right: 10,
//                       width: 18, height: 18, borderRadius: "50%",
//                       background: "#7c9b2a", display: "flex",
//                       alignItems: "center", justifyContent: "center",
//                     }}>
//                       <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
//                         <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//                       </svg>
//                     </div>
//                   )}
//                   <span style={{
//                     display: "inline-block", fontSize: 11, padding: "2px 8px",
//                     borderRadius: 20, background: "#f0f0e8", color: "#5c5c3d",
//                     fontWeight: 500, marginBottom: 6, textTransform: "capitalize",
//                   }}>
//                     {a.address_type || "Home"}
//                   </span>
//                   <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 3 }}>{a.street}</div>
//                   {a.landmark && <div style={{ fontSize: 13, color: "#5c5c5c" }}>{a.landmark}</div>}
//                   <div style={{ fontSize: 13, color: "#5c5c5c" }}>{a.city}, {a.state}</div>
//                   <div style={{ fontSize: 13, color: "#5c5c5c" }}>{a.country} - {a.postal_code}</div>

//                   <div
//                     onClick={(e) => e.stopPropagation()}
//                     style={{ display: "flex", gap: 6, marginTop: 10 }}
//                   >
//                     <button
//                       onClick={() => {
//                         setEditing(a.id);
//                         setForm({
//                           street: a.street ?? "", landmark: a.landmark ?? "",
//                           postal_code: a.postal_code ?? "",
//                           country_id: a.country_id ?? 0,
//                           state_id: a.state_id ?? 0,
//                           city_id: a.city_id ?? 0,
//                           address_type: a.address_type ?? "home",
//                         });
//                         setShowForm(true);
//                       }}
//                       style={{
//                         fontSize: 12, padding: "4px 12px",
//                         background: "#f0f0e8", border: "none",
//                         borderRadius: 6, cursor: "pointer", fontWeight: 500,
//                       }}
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete(a.id)}
//                       disabled={deleting === a.id}
//                       style={{
//                         fontSize: 12, padding: "4px 12px",
//                         background: "#fee2e2", border: "none",
//                         borderRadius: 6, cursor: "pointer", color: "#991b1b",
//                       }}
//                     >
//                       {deleting === a.id ? "..." : "Delete"}
//                     </button>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>

//       {/* Step 2: Delivery date */}
//       <div style={cardStyle}>
//         <div style={sectionTitle}>
//           <div style={stepBadge}>2</div>
//           <span>Delivery date</span>
//         </div>
//         <p style={{ fontSize: 13, color: "#5c5c5c", marginBottom: 12 }}>
//           Delivery happens on our next bake day (min. 5 days from today).
//         </p>

//         {/* Quick select */}
//         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
//           {quickDates.map((qd) => (
//             <div
//               key={qd.value}
//               onClick={() => setSelectedDate(qd.value)}
//               style={{
//                 border: `1.5px solid ${selectedDate === qd.value ? "#7c9b2a" : "#e5e5e0"}`,
//                 borderRadius: 10, padding: "12px 14px", cursor: "pointer",
//                 background: selectedDate === qd.value ? "#f8fce8" : "#fff",
//                 transition: "all 0.15s",
//               }}
//             >
//               <div style={{ fontSize: 12, color: "#5c5c5c", marginBottom: 3 }}>{qd.label}</div>
//               <div style={{ fontSize: 14, fontWeight: 500 }}>{qd.display}</div>
//             </div>
//           ))}
//         </div>

//         {/* Custom date */}
//         <div>
//           <label style={{ fontSize: 13, color: "#5c5c5c", display: "block", marginBottom: 6 }}>
//             Or pick a custom date
//           </label>
//           <input
//             type="date"
//             min={minDeliveryDate}
//             value={selectedDate}
//             onChange={(e) => setSelectedDate(e.target.value)}
//             style={{ ...inputStyle, width: "auto", minWidth: 180 }}
//           />
//           {!selectedDate && (
//             <p style={{ fontSize: 12, color: "#c0392b", marginTop: 6 }}>
//               Please select a delivery date
//             </p>
//           )}
//         </div>
//       </div>

//       {/* Address form modal */}
//       {showForm && (
//         <div style={{
//           position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
//           display: "flex", alignItems: "center", justifyContent: "center",
//           padding: 16, zIndex: 50,
//         }} onClick={resetForm}>
//           <div style={{
//             background: "#fff", borderRadius: 16, padding: 24,
//             width: "100%", maxWidth: 520,
//           }} onClick={(e) => e.stopPropagation()}>
//             <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
//               <h3 style={{ fontSize: 16, fontWeight: 500 }}>
//                 {editing ? "Edit address" : "Add new address"}
//               </h3>
//               <button onClick={resetForm} style={{ background: "none", border: "none", cursor: "pointer" }}>
//                 <X size={18} />
//               </button>
//             </div>

//             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
//               <input
//                 style={{ ...inputStyle, gridColumn: "1/-1" }}
//                 placeholder="Full address / street *"
//                 value={form.street}
//                 onChange={(e) => setForm({ ...form, street: e.target.value })}
//               />
//               <input
//                 style={{ ...inputStyle, gridColumn: "1/-1" }}
//                 placeholder="Landmark (optional)"
//                 value={form.landmark}
//                 onChange={(e) => setForm({ ...form, landmark: e.target.value })}
//               />
//               <div style={{ gridColumn: "1/-1" }}>
//                 <input
//                   style={inputStyle}
//                   placeholder="Pincode *"
//                   value={form.postal_code}
//                   onChange={(e) => handlePostalChange(e.target.value)}
//                 />
//                 {pincodeVerifying && (
//                   <p style={{ fontSize: 12, color: "#7c9b2a", marginTop: 4 }}>Autofilling location...</p>
//                 )}
//               </div>

//               <select
//                 style={inputStyle}
//                 value={form.country_id}
//                 onChange={(e) => setForm({ ...form, country_id: Number(e.target.value) })}
//               >
//                 <option value={0}>Country *</option>
//                 {countries.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
//               </select>

//               <select
//                 style={inputStyle}
//                 value={form.state_id}
//                 onChange={(e) => setForm({ ...form, state_id: Number(e.target.value) })}
//               >
//                 <option value={0}>State *</option>
//                 {states.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
//               </select>

//               <select
//                 style={inputStyle}
//                 value={form.city_id}
//                 onChange={(e) => setForm({ ...form, city_id: Number(e.target.value) })}
//               >
//                 <option value={0}>City *</option>
//                 {cities.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
//               </select>

//               <select
//                 style={inputStyle}
//                 value={form.address_type}
//                 onChange={(e) => setForm({ ...form, address_type: e.target.value })}
//               >
//                 <option value="home">Home</option>
//                 <option value="work">Work</option>
//                 <option value="other">Other</option>
//               </select>
//             </div>

//             <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
//               <button
//                 onClick={resetForm}
//                 style={{
//                   border: "0.5px solid #d6d1c4", background: "transparent",
//                   borderRadius: 8, padding: "9px 20px", fontSize: 14, cursor: "pointer",
//                 }}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSave}
//                 disabled={adding}
//                 style={{
//                   background: "#C5D82D", border: "none", borderRadius: 8,
//                   padding: "9px 24px", fontSize: 14, fontWeight: 500, cursor: "pointer",
//                   opacity: adding ? 0.7 : 1,
//                 }}
//               >
//                 {adding ? "Saving..." : editing ? "Update" : "Save address"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }











"use client";

import React, { useCallback, useEffect, useState } from "react";
import { MapPin, Plus, AlertTriangle, Loader2, X, Edit2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { BASE_URL } from "@/components/config/api";

const API_BASE_URL = `${BASE_URL}/api/locations`;

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
}

interface Option {
  id: number;
  name: string;
}

const cardStyle = {
  background: "#fff",
  borderRadius: "12px",
  border: "0.5px solid #e5e5e0",
  padding: "20px",
  marginBottom: 16,
} as React.CSSProperties;

const stepBadge = {
  width: 32, height: 32, borderRadius: "50%",
  background: "#C5D82D", display: "flex",
  alignItems: "center", justifyContent: "center",
  fontSize: 13, fontWeight: 600, color: "#1b1b1b", flexShrink: 0,
} as React.CSSProperties;

const sectionTitle = {
  fontSize: 16, fontWeight: 600, marginBottom: 16,
  display: "flex", alignItems: "center", gap: 10,
  paddingBottom: 12, borderBottom: "0.5px solid #e5e5e0",
} as React.CSSProperties;

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
    token, selectedAddressId, setSelectedAddressId,
    selectedDate, setSelectedDate, setLoadingPaymentMeta,
  } = props;

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [editing, setEditing] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [adding, setAdding] = useState(false);
  const [pincodeVerifying, setPincodeVerifying] = useState(false);

  const [countries, setCountries] = useState<Option[]>([]);
  const [states, setStates] = useState<Option[]>([]);
  const [cities, setCities] = useState<Option[]>([]);

  const [form, setForm] = useState<any>({
    street: "", landmark: "", postal_code: "",
    country_id: 0, state_id: 0, city_id: 0, address_type: "home",
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const quickDates = (() => {
    const today = new Date();
    const result: { label: string; value: string; display: string }[] = [];
    [3, 6].forEach((wd) => {
      const d = new Date(today.getTime());
      const day = d.getDay();
      let delta = (wd - day + 7) % 7;
      if (delta < 5) delta += 7;
      d.setDate(d.getDate() + delta);
      const value = d.toISOString().split("T")[0];
      const display = d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
      result.push({ label: wd === 3 ? "Wednesday" : "Saturday", value, display });
    });
    return result;
  })();

  const minDeliveryDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toISOString().split("T")[0];
  })();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("selectedDelivery");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.date) {
          const d = new Date(parsed.date);
          if (!isNaN(d.getTime())) {
            setSelectedDate(d.toISOString().split("T")[0]);
          }
        }
        localStorage.removeItem("selectedDelivery");
      }
    } catch {}
  }, []);

  const fetchAddresses = useCallback(async (initial = false) => {
    if (initial) setLoading(true);
    try {
      const headers: any = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`${API_BASE_URL}/addresses`, { headers });
      if (!res.ok) throw new Error();
      const data = await res.json();
      const items: Address[] = data.items || [];
      setAddresses(items);
      if (!selectedAddressId && items.length > 0) {
        setSelectedAddressId(items[0].id);
      } else {
        const exists = items.some((a) => a.id === selectedAddressId);
        if (!exists && items.length > 0) setSelectedAddressId(items[0].id);
      }
    } catch {
      toast.error("Unable to load addresses");
    } finally {
      if (initial) setLoading(false);
    }
  }, [token, selectedAddressId, setSelectedAddressId]);

  useEffect(() => {
    (async () => {
      const res = await fetch(`${API_BASE_URL}/countrylist`);
      setCountries(res.ok ? await res.json() : []);
    })();
    fetchAddresses(true).finally(() => setLoadingPaymentMeta(false));
  }, []);

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

  const resetForm = () => {
    setForm({ street: "", landmark: "", postal_code: "", country_id: 0, state_id: 0, city_id: 0, address_type: "home" });
    setStates([]); setCities([]); setEditing(null); setShowForm(false);
  };

  const handlePostalChange = async (v: string) => {
    const clean = v.replace(/\D/g, "").slice(0, 6);
    setForm((p: any) => ({ ...p, postal_code: clean }));
    if (clean.length !== 6) return;
    try {
      setPincodeVerifying(true);
      const res = await fetch(`${API_BASE_URL}/addresses/autofill`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ pincode: clean }),
      });
      const text = await res.text();
      if (!res.ok) throw new Error(text);
      const data = JSON.parse(text);
      if (data.valid === false) { toast.error("Invalid pincode"); return; }

      const countryId = data.country?.id ?? 0;
      const stateId = data.state?.id ?? 0;
      const cityId = data.city?.id ?? 0;

      if (countryId) {
        const r = await fetch(`${API_BASE_URL}/statelist?country_id=${countryId}`);
        setStates(r.ok ? await r.json() : []);
      }
      if (stateId) {
        const r = await fetch(`${API_BASE_URL}/citylist?state_id=${stateId}`);
        setCities(r.ok ? await r.json() : []);
      }
      setForm((prev: any) => ({ ...prev, country_id: countryId, state_id: stateId, city_id: cityId }));
      toast.success("Address autofilled");
    } catch {
      toast.error("Autofill failed");
    } finally {
      setPincodeVerifying(false);
    }
  };

  const handleSave = async () => {
    if (!form.street || !form.postal_code || !form.country_id || !form.state_id || !form.city_id) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      setAdding(true);
      const url = editing ? `${API_BASE_URL}/addresses/${editing}` : `${API_BASE_URL}/addresses`;
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({
          street: form.street, landmark: form.landmark || "",
          postal_code: form.postal_code, city_id: form.city_id,
          state_id: form.state_id, country_id: form.country_id,
          address_type: form.address_type,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success(editing ? "Address updated" : "Address added");
      resetForm();
      fetchAddresses();
    } catch {
      toast.error("Failed to save address");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this address?")) return;
    try {
      setDeleting(id);
      const res = await fetch(`${API_BASE_URL}/addresses/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error();
      toast.success("Address deleted");
      const updated = addresses.filter((x) => x.id !== id);
      setAddresses(updated);
      if (selectedAddressId === id) setSelectedAddressId(updated[0]?.id ?? null);
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleting(null);
    }
  };

  const inputStyle = {
    border: "0.5px solid #d6d1c4", borderRadius: 8,
    padding: "10px 12px", fontSize: 14, width: "100%",
    background: "#fff", color: "#1b1b1b",
    boxSizing: "border-box" as const,
  } as React.CSSProperties;

  return (
    <div>
      {/* Step 1: Address */}
      <div style={{
        ...cardStyle,
        padding: isMobile ? "16px" : "20px",
        marginBottom: isMobile ? "12px" : "16px",
      }}>
        <div style={{
          ...sectionTitle,
          gap: isMobile ? "8px" : "10px",
          fontSize: isMobile ? "15px" : "16px",
          flexWrap: "wrap",
        }}>
          <div style={stepBadge}>1</div>
          <span style={{ flex: 1 }}>Delivery address</span>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            style={{
              width: isMobile ? "100%" : "auto",
              marginLeft: isMobile ? "0" : "auto",
              marginTop: isMobile ? "8px" : "0",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              background: "#f0f0e8", border: "none", borderRadius: 8,
              padding: "8px 14px", fontSize: 13, fontWeight: 500, cursor: "pointer", color: "#1b1b1b",
            }}
          >
            <Plus size={16} /> {isMobile ? "Add" : "Add address"}
          </button>
        </div>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 32 }}>
            <Loader2 className="animate-spin" size={28} style={{ color: "#C5D82D" }} />
          </div>
        ) : addresses.length === 0 ? (
          <div style={{ textAlign: "center", padding: isMobile ? "24px 12px" : "32px 16px", background: "#f9f8f4", borderRadius: 10 }}>
            <AlertTriangle size={28} style={{ color: "#d9820a", margin: "0 auto 8px" }} />
            <p style={{ fontSize: 14, color: "#5c5c5c", marginBottom: 12 }}>No saved addresses. Add one to continue.</p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: isMobile ? "10px" : "12px",
            marginTop: "12px",
          }}>
            {addresses.map((a) => {
              const isSelected = selectedAddressId === a.id;
              return (
                <div
                  key={a.id}
                  onClick={() => setSelectedAddressId(a.id)}
                  style={{
                    border: `1.5px solid ${isSelected ? "#7c9b2a" : "#e5e5e0"}`,
                    borderRadius: 10, padding: isMobile ? "12px" : "14px", cursor: "pointer",
                    background: isSelected ? "#f8fce8" : "#fff",
                    position: "relative", transition: "all 0.15s",
                  }}
                >
                  {isSelected && (
                    <div style={{
                      position: "absolute", top: 10, right: 10,
                      width: 20, height: 20, borderRadius: "50%",
                      background: "#7c9b2a", display: "flex",
                      alignItems: "center", justifyContent: "center",
                    }}>
                      <svg width="11" height="9" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                  <span style={{
                    display: "inline-block", fontSize: 11, padding: "3px 8px",
                    borderRadius: 20, background: "#f0f0e8", color: "#5c5c3d",
                    fontWeight: 500, marginBottom: 6, textTransform: "capitalize",
                  }}>
                    {a.address_type || "Home"}
                  </span>
                  <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 3, wordBreak: "break-word" }}>{a.street}</div>
                  {a.landmark && <div style={{ fontSize: 13, color: "#5c5c5c", marginBottom: 2 }}>{a.landmark}</div>}
                  <div style={{ fontSize: 13, color: "#5c5c5c", marginBottom: 1 }}>{a.city}, {a.state}</div>
                  <div style={{ fontSize: 13, color: "#5c5c5c", marginBottom: 8 }}>{a.country} - {a.postal_code}</div>

                  <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      display: "flex", gap: 6, marginTop: 10,
                      flexDirection: isMobile ? "column" : "row",
                    }}
                  >
                    <button
                      onClick={() => {
                        setEditing(a.id);
                        setForm({
                          street: a.street ?? "", landmark: a.landmark ?? "",
                          postal_code: a.postal_code ?? "",
                          country_id: a.country_id ?? 0,
                          state_id: a.state_id ?? 0,
                          city_id: a.city_id ?? 0,
                          address_type: a.address_type ?? "home",
                        });
                        setShowForm(true);
                      }}
                      style={{
                        flex: isMobile ? "1" : "auto",
                        fontSize: 12, padding: "6px 12px",
                        background: "#f0f0e8", border: "none",
                        borderRadius: 6, cursor: "pointer", fontWeight: 500,
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                      }}
                    >
                      <Edit2 size={14} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(a.id)}
                      disabled={deleting === a.id}
                      style={{
                        flex: isMobile ? "1" : "auto",
                        fontSize: 12, padding: "6px 12px",
                        background: "#fee2e2", border: "none",
                        borderRadius: 6, cursor: "pointer", color: "#991b1b",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                        opacity: deleting === a.id ? 0.6 : 1,
                      }}
                    >
                      <Trash2 size={14} /> {deleting === a.id ? "..." : "Delete"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Step 2: Delivery date */}
      <div style={{
        ...cardStyle,
        padding: isMobile ? "16px" : "20px",
        marginBottom: isMobile ? "12px" : "16px",
      }}>
        <div style={{
          ...sectionTitle,
          fontSize: isMobile ? "15px" : "16px",
          gap: isMobile ? "8px" : "10px",
        }}>
          <div style={stepBadge}>2</div>
          <span>Delivery date</span>
        </div>
        <p style={{ fontSize: 13, color: "#5c5c5c", marginBottom: 12, lineHeight: 1.5 }}>
          Delivery happens on our next bake day (min. 5 days from today).
        </p>

        {/* Quick select */}
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: isMobile ? "8px" : "10px",
          marginBottom: 14,
        }}>
          {quickDates.map((qd) => (
            <div
              key={qd.value}
              onClick={() => setSelectedDate(qd.value)}
              style={{
                border: `1.5px solid ${selectedDate === qd.value ? "#7c9b2a" : "#e5e5e0"}`,
                borderRadius: 10, padding: isMobile ? "10px 12px" : "12px 14px", cursor: "pointer",
                background: selectedDate === qd.value ? "#f8fce8" : "#fff",
                transition: "all 0.15s",
              }}
            >
              <div style={{ fontSize: 12, color: "#5c5c5c", marginBottom: 3 }}>{qd.label}</div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{qd.display}</div>
            </div>
          ))}
        </div>

        {/* Custom date */}
        <div>
          <label style={{ fontSize: 13, color: "#5c5c5c", display: "block", marginBottom: 6, fontWeight: 500 }}>
            Or pick a custom date
          </label>
          <input
            type="date"
            min={minDeliveryDate}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              ...inputStyle,
              width: isMobile ? "100%" : "auto",
              minWidth: isMobile ? "100%" : 180,
            }}
          />
          {!selectedDate && (
            <p style={{ fontSize: 12, color: "#c0392b", marginTop: 6 }}>
              Please select a delivery date
            </p>
          )}
        </div>
      </div>

      {/* Address form modal */}
      {showForm && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
          display: "flex", alignItems: "flex-end", justifyContent: "center",
          padding: 0, zIndex: 50, overflowY: "auto",
        }} onClick={resetForm}>
          <div style={{
            background: "#fff", borderRadius: isMobile ? "20px 20px 0 0" : "16px", padding: isMobile ? "20px 16px" : "24px",
            width: "100%", maxWidth: 520,
            maxHeight: isMobile ? "90vh" : "auto",
            overflowY: isMobile ? "auto" : "visible",
            animation: isMobile ? "slideUp 0.3s ease-out" : "none",
          }} onClick={(e) => e.stopPropagation()}>
            <style>{`
              @keyframes slideUp {
                from { transform: translateY(100%); }
                to { transform: translateY(0); }
              }
            `}</style>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 600 }}>
                {editing ? "Edit address" : "Add new address"}
              </h3>
              <button onClick={resetForm} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                <X size={24} />
              </button>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: isMobile ? "10px" : "10px",
            }}>
              <input
                style={{ ...inputStyle, gridColumn: "1/-1" }}
                placeholder="Full address / street *"
                value={form.street}
                onChange={(e) => setForm({ ...form, street: e.target.value })}
              />
              <input
                style={{ ...inputStyle, gridColumn: "1/-1" }}
                placeholder="Landmark (optional)"
                value={form.landmark}
                onChange={(e) => setForm({ ...form, landmark: e.target.value })}
              />
              <div style={{ gridColumn: "1/-1" }}>
                <input
                  style={inputStyle}
                  placeholder="Pincode *"
                  value={form.postal_code}
                  onChange={(e) => handlePostalChange(e.target.value)}
                />
                {pincodeVerifying && (
                  <p style={{ fontSize: 12, color: "#7c9b2a", marginTop: 4 }}>Autofilling location...</p>
                )}
              </div>

              <select
                style={inputStyle}
                value={form.country_id}
                onChange={(e) => setForm({ ...form, country_id: Number(e.target.value) })}
              >
                <option value={0}>Country *</option>
                {countries.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
              </select>

              <select
                style={inputStyle}
                value={form.state_id}
                onChange={(e) => setForm({ ...form, state_id: Number(e.target.value) })}
              >
                <option value={0}>State *</option>
                {states.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
              </select>

              <select
                style={inputStyle}
                value={form.city_id}
                onChange={(e) => setForm({ ...form, city_id: Number(e.target.value) })}
              >
                <option value={0}>City *</option>
                {cities.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
              </select>

              <select
                style={inputStyle}
                value={form.address_type}
                onChange={(e) => setForm({ ...form, address_type: e.target.value })}
              >
                <option value="home">Home</option>
                <option value="work">Work</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div style={{
              display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20,
              flexDirection: isMobile ? "column-reverse" : "row",
            }}>
              <button
                onClick={resetForm}
                style={{
                  flex: isMobile ? "1" : "auto",
                  border: "0.5px solid #d6d1c4", background: "transparent",
                  borderRadius: 8, padding: "10px 20px", fontSize: 14, cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={adding}
                style={{
                  flex: isMobile ? "1" : "auto",
                  background: "#C5D82D", border: "none", borderRadius: 8,
                  padding: "10px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer",
                  opacity: adding ? 0.7 : 1,
                  color: "#1b1b1b",
                }}
              >
                {adding ? "Saving..." : editing ? "Update" : "Save address"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
