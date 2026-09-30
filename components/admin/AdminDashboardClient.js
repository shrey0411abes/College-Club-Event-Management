"use client";

/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import EventFormModal from "./EventFormModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { useStore } from "@/context/StoreProvider";
import { isEventPast } from "@/lib/eventTime";

export default function AdminDashboardClient() {
  const router = useRouter();
  const { events, isLoading, resetDemoData, getRegistrationsForEvent, getEvent } = useStore();

  // Active Tab: "events" or "registrations"
  const [activeTab, setActiveTab] = useState("events");

  // Events State
  const [editingEvent, setEditingEvent] = useState(null);
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [deletingEvent, setDeletingEvent] = useState(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Registrations State
  const [registrations, setRegistrations] = useState([]);
  const [regSearch, setRegSearch] = useState("");
  const [selectedEventFilter, setSelectedEventFilter] = useState("all");

  // Logout Handler
  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      toast.success("Logged out successfully");
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Logout failed. Please try again.");
    }
  };

  const handleResetDemoData = () => {
    setIsResetConfirmOpen(false);
    resetDemoData();
    toast.success("Data reset to demo defaults");
  };

  // Event handlers
  const handleCreateNew = () => {
    setEditingEvent(null);
    setIsEventFormOpen(true);
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setIsEventFormOpen(true);
  };

  const handleSaveSuccess = () => {
    // Reactive store handles data updates
  };

  const handleDeleteSuccess = () => {
    // Reactive store handles data updates
  };

  // Fetch updated registrations with filter / search
  useEffect(() => {
    const timer = setTimeout(() => {
      const filteredRegs = getRegistrationsForEvent(
        selectedEventFilter === "all" ? null : selectedEventFilter,
        regSearch
      );
      setRegistrations(filteredRegs);
    }, 250);
    return () => clearTimeout(timer);
  }, [regSearch, selectedEventFilter, events, getRegistrationsForEvent]);

  // CSV Export
  const exportToCSV = () => {
    if (registrations.length === 0) {
      toast.error("No registrations to export");
      return;
    }

    const csvCell = (raw) => {
      let val = String(raw ?? "");
      if (/^[=+\-@]/.test(val)) val = `'${val}`;
      return `"${val.replace(/"/g, '""')}"`;
    };

    const headers = [
      "Registration ID",
      "Participant Name",
      "Email",
      "College / Year",
      "Phone",
      "Event Title",
      "Event Date",
      "Event Venue",
      "Registered At",
    ];

    const rows = registrations.map((r) => {
      const ev = getEvent(r.eventId);
      return [
        r.id,
        r.name,
        r.email,
        r.collegeYear,
        r.phone,
        ev ? (ev.title || "Deleted event") : "Deleted event",
        ev?.date ? new Date(ev.date).toISOString().split("T")[0] : "N/A",
        ev?.venue || "N/A",
        r.createdAt ? new Date(r.createdAt).toLocaleString("en-US") : "N/A",
      ];
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        headers.map(csvCell).join(","),
        ...rows.map((row) => row.map(csvCell).join(",")),
      ].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `codechef_event_registrations_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${registrations.length} registrations to CSV!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Banner & Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Admin Operations Panel
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Club Event Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Create and edit campus events, monitor registrations, and export attendee data.
          </p>
          <p className="text-xs font-semibold text-emerald-400 mt-2 bg-emerald-500/10 border border-emerald-500/20 inline-block px-2.5 py-1 rounded-lg">
            Demo mode: data is stored in this browser
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsResetConfirmOpen(true)}
            aria-label="Reset demo data to defaults"
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-amber-300 hover:text-white hover:bg-slate-800 border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
          >
            Reset demo data
          </button>
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Sign out from admin session"
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-200 hover:text-white hover:bg-slate-800 border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 gap-4" role="tablist">
        <button
          role="tab"
          aria-selected={activeTab === "events"}
          onClick={() => setActiveTab("events")}
          className={`pb-3 px-2 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none ${
            activeTab === "events"
              ? "border-indigo-500 text-indigo-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <span>Events Catalog</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-slate-800 text-slate-200 font-semibold">
            {events.length}
          </span>
        </button>

        <button
          role="tab"
          aria-selected={activeTab === "registrations"}
          onClick={() => setActiveTab("registrations")}
          className={`pb-3 px-2 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none ${
            activeTab === "registrations"
              ? "border-indigo-500 text-indigo-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <span>Participant Registrations</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-slate-800 text-slate-200 font-semibold">
            {registrations.length}
          </span>
        </button>
      </div>

      {/* TAB 1: EVENTS MANAGEMENT */}
      {activeTab === "events" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">Live Events</h2>
              <p className="text-xs text-slate-400">
                Manage upcoming and past hackathons, contests, and workshops.
              </p>
            </div>
            <button
              onClick={handleCreateNew}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-600/30 transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Add New Event
            </button>
          </div>

          {/* Desktop Table View (>= 768px) with Sticky Header */}
          <div className="hidden md:block rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl overflow-hidden">
            <div className="overflow-x-auto max-h-[580px] overflow-y-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="sticky top-0 z-10 bg-slate-950 text-xs uppercase tracking-wider text-slate-300 border-b border-slate-800 shadow-sm">
                  <tr>
                    <th scope="col" className="px-6 py-4">Event Details</th>
                    <th scope="col" className="px-6 py-4">Category</th>
                    <th scope="col" className="px-6 py-4">Date &amp; Time</th>
                    <th scope="col" className="px-6 py-4">Venue</th>
                    <th scope="col" className="px-6 py-4">Status</th>
                    <th scope="col" className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {events.length > 0 ? (
                    events.map((event) => {
                      const past = isEventPast(event.date, event.time);
                      return (
                        <tr
                          key={event.id}
                          className="hover:bg-slate-800/40 transition-colors group"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {event.imageUrl ? (
                                <img
                                  src={event.imageUrl}
                                  alt=""
                                  className="w-12 h-12 rounded-xl object-cover border border-slate-700 flex-shrink-0"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-xs font-mono font-bold text-slate-400 border border-slate-700 flex-shrink-0">
                                  &lt;/&gt;
                                </div>
                              )}
                              <div>
                                <p className="font-bold text-white group-hover:text-indigo-300 transition-colors">
                                  {event.title}
                                </p>
                                <p className="text-xs text-slate-400 line-clamp-1 max-w-xs mt-0.5">
                                  {event.description}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-950/80 text-indigo-300 border border-indigo-800/60">
                              {event.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs">
                            <p className="font-semibold text-slate-200">
                              {new Date(event.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>
                            <p className="text-slate-400">{event.time}</p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-300">
                            {event.venue}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col gap-1.5 items-start">
                              {event.featured && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                  Featured
                                </span>
                              )}
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                  past
                                    ? "bg-slate-800 text-slate-300 border border-slate-700"
                                    : "bg-emerald-950/80 text-emerald-300 border border-emerald-800/60"
                                }`}
                              >
                                {past ? "Past" : "Upcoming"}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                            <button
                              onClick={() => handleEdit(event)}
                              aria-label={`Edit ${event.title}`}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => setDeletingEvent(event)}
                              aria-label={`Delete ${event.title}`}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900 border border-rose-800/50 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                        {isLoading ? "Loading events..." : "No events found. Click \"Add New Event\" to create one."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card Layout (< 768px) */}
          <div className="md:hidden space-y-4">
            {events.length > 0 ? (
              events.map((event) => {
                const past = isEventPast(event.date, event.time);
                return (
                  <div
                    key={event.id}
                    className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 inline-block mb-1.5">
                          {event.category}
                        </span>
                        <h3 className="font-bold text-white text-base leading-snug">
                          {event.title}
                        </h3>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            past
                              ? "bg-slate-800 text-slate-300 border border-slate-700"
                              : "bg-emerald-950/80 text-emerald-300 border border-emerald-800/60"
                          }`}
                        >
                          {past ? "Past" : "Upcoming"}
                        </span>
                        {event.featured && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-xs text-slate-300 space-y-1 pt-1 border-t border-slate-800/60">
                      <p>
                        📅 <span className="font-medium text-slate-200">{new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span> • {event.time}
                      </p>
                      <p>📍 {event.venue}</p>
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800/60">
                      <button
                        onClick={() => handleEdit(event)}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeletingEvent(event)}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-rose-300 bg-rose-950/40 hover:bg-rose-900 border border-rose-800/50 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 text-center text-slate-400 text-sm">
                {isLoading ? "Loading events..." : "No events found."}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: REGISTRATIONS MANAGEMENT */}
      {activeTab === "registrations" && (
        <div className="space-y-6">
          {/* Controls: Search, Filter, Export */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-5 rounded-3xl backdrop-blur-md">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
              {/* Search by Name/Email */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={regSearch}
                  onChange={(e) => setRegSearch(e.target.value)}
                  placeholder="Search by participant name or email..."
                  aria-label="Search participant registrations"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Filter by Event */}
              <select
                value={selectedEventFilter}
                onChange={(e) => setSelectedEventFilter(e.target.value)}
                aria-label="Filter registrations by event"
                className="px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all" className="bg-slate-900">All Events</option>
                {events.map((e) => (
                  <option key={e.id} value={e.id} className="bg-slate-900">
                    {e.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Total count & Export CSV */}
            <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 md:pt-0">
              <span className="text-xs text-slate-300">
                Count: <span className="font-bold text-white">{registrations.length}</span>
              </span>

              <button
                onClick={exportToCSV}
                disabled={registrations.length === 0}
                aria-label="Export registrations to CSV file"
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export CSV
              </button>
            </div>
          </div>

          {/* Desktop Table View (>= 768px) with Sticky Header */}
          <div className="hidden md:block rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl overflow-hidden">
            <div className="overflow-x-auto max-h-[580px] overflow-y-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="sticky top-0 z-10 bg-slate-950 text-xs uppercase tracking-wider text-slate-300 border-b border-slate-800 shadow-sm">
                  <tr>
                    <th scope="col" className="px-6 py-4">Participant</th>
                    <th scope="col" className="px-6 py-4">Contact</th>
                    <th scope="col" className="px-6 py-4">College / Year</th>
                    <th scope="col" className="px-6 py-4">Registered Event</th>
                    <th scope="col" className="px-6 py-4">Date Submitted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                        <div className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Loading registrations...
                        </div>
                      </td>
                    </tr>
                  ) : registrations.length > 0 ? (
                    registrations.map((reg) => {
                      const ev = getEvent(reg.eventId);
                      return (
                        <tr key={reg.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-bold text-white">{reg.name}</p>
                            <p className="text-xs text-slate-400 font-mono mt-0.5">{reg.email}</p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-slate-300">
                            {reg.phone}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-300">
                            {reg.collegeYear}
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-semibold text-indigo-300 text-xs">
                              {ev ? ev.title : "Deleted event"}
                            </p>
                            {ev && ev.date && (
                              <p className="text-[11px] text-slate-400">
                                {new Date(ev.date).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </p>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-400">
                            {reg.createdAt
                              ? new Date(reg.createdAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "N/A"}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                        No registrations match your search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card Layout (< 768px) */}
          <div className="md:hidden space-y-4">
            {registrations.length > 0 ? (
              registrations.map((reg) => {
                const ev = getEvent(reg.eventId);
                return (
                  <div
                    key={reg.id}
                    className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-white text-base">{reg.name}</h4>
                        <p className="text-xs text-slate-400 font-mono">{reg.email}</p>
                      </div>
                      <span className="text-[11px] text-slate-400 whitespace-nowrap">
                        {reg.createdAt
                          ? new Date(reg.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })
                          : ""}
                      </span>
                    </div>

                    <div className="text-xs text-slate-300 space-y-1 pt-1.5 border-t border-slate-800/60">
                      <p>
                        <span className="text-slate-400">Event:</span>{" "}
                        <span className="font-semibold text-indigo-300">
                          {ev ? ev.title : "Deleted event"}
                        </span>
                      </p>
                      <p>
                        <span className="text-slate-400">College / Year:</span> {reg.collegeYear}
                      </p>
                      <p>
                        <span className="text-slate-400">Phone:</span>{" "}
                        <span className="font-mono">{reg.phone}</span>
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 text-center text-slate-400 text-sm">
                No registrations found matching criteria.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reset Demo Data Confirmation Dialog */}
      {isResetConfirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-confirm-title"
        >
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
            onClick={() => setIsResetConfirmOpen(false)}
          />
          <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl p-6 sm:p-8 z-10 my-auto text-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <h3 id="reset-confirm-title" className="text-xl font-bold text-white">
              Reset Demo Data?
            </h3>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              This will reset all events and registrations in your browser storage back to the 6 default demo events and initial registrations.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetDemoData}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-amber-600 hover:bg-amber-500 shadow-md shadow-amber-600/30 transition-all cursor-pointer"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {isEventFormOpen && (
        <EventFormModal
          isOpen={isEventFormOpen}
          onClose={() => setIsEventFormOpen(false)}
          event={editingEvent}
          onSuccess={handleSaveSuccess}
        />
      )}

      {deletingEvent && (
        <DeleteConfirmModal
          isOpen={Boolean(deletingEvent)}
          onClose={() => setDeletingEvent(null)}
          event={deletingEvent}
          onDeleteSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
}
