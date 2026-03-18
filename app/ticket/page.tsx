"use client";

import { useEffect, useState, FormEvent } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/* ---------------- COOKIE READER (safe inside useEffect) ---------------- */
const readCookie = (name: string) => {
  if (typeof document === "undefined") return ""; // ❗ prevents SSR crash
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : "";
};

export default function SupportPage() {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [token, setToken] = useState(""); // ❗ token stored safely here

  /* ---------------- GET TOKEN ON CLIENT ONLY ---------------- */
  useEffect(() => {
    const t = readCookie("token");
    setToken(t);
  }, []);

  /* ---------------- FETCH TICKETS ---------------- */
  const fetchTickets = async () => {
    if (!token) return;
    try {
      const res = await axios.get("https://medicaps.cloud/api/support/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTickets(res.data);
    } catch (err) {
      alert("Failed to load tickets");
    }
  };

  useEffect(() => {
    if (token) fetchTickets();
  }, [token]);

  /* ---------------- CREATE TICKET ---------------- */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        "https://medicaps.cloud/api/support/",
        { subject, description, priority },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSubject("");
      setDescription("");
      setPriority("Low");
      setShowForm(false);
      fetchTickets();
      alert("Ticket created successfully!");
    } catch (error) {
      alert("Failed to create ticket");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto mt-10">

      {/* CREATE NEW TICKET BUTTON */}
      <Button
        onClick={() => setShowForm(true)}
        className="bg-blue-600 text-white px-6 py-3 mb-6"
      >
        Create Ticket
      </Button>

      {/* POPUP FORM */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">

            <h2 className="text-xl font-semibold mb-4">Create Support Ticket</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-3 border rounded"
                required
              />

              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border rounded"
                required
              ></textarea>

              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full p-3 border rounded"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>

              <div className="flex justify-between">
                <Button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-500 text-white px-4"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  className="bg-blue-600 text-white px-6"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Ticket"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TICKET LIST */}
      <h2 className="text-2xl font-semibold mb-4">Your Tickets</h2>

      {tickets.length === 0 ? (
        <p>No tickets found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tickets.map((ticket: any) => (
            <Card
              key={ticket.id}
              className="p-4 shadow-sm border hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer rounded-xl"
            >
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-semibold text-lg">{ticket.subject}</h3>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    ticket.priority === "High"
                      ? "bg-red-100 text-red-700"
                      : ticket.priority === "Medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {ticket.priority}
                </span>
              </div>

              <p className="text-sm text-gray-700 leading-tight mb-2">
                {ticket.description}
              </p>

              <div className="space-y-1 mt-2">
                <p className="text-xs text-gray-500">Status: {ticket.status}</p>
                <p className="text-xs text-gray-500">Created: {ticket.created_at}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
