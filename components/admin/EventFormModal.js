"use client";

import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useStore } from "@/context/StoreProvider";

const DEFAULT_CATEGORIES = [
  "Hackathon",
  "Competitive Programming",
  "Web Development",
  "Artificial Intelligence",
  "Cybersecurity",
  "Open Source",
  "Workshop",
];

export default function EventFormModal({ isOpen, onClose, event = null, onSuccess }) {
  const { createEvent, updateEvent } = useStore();
  const isEditing = Boolean(event && event.id);

  // Format date to YYYY-MM-DD for standard date input
  const initialDateStr = event?.date
    ? new Date(event.date).toISOString().split("T")[0]
    : "";

  const [formData, setFormData] = useState({
    title: event?.title || "",
    description: event?.description || "",
    category: event?.category || DEFAULT_CATEGORIES[0],
    date: initialDateStr,
    time: event?.time || "",
    venue: event?.venue || "",
    featured: Boolean(event?.featured),
    imageUrl: event?.imageUrl || "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const modalRef = useRef(null);
  const firstInputRef = useRef(null);

  // Focus management and escape key
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => {
      firstInputRef.current?.focus();
    }, 50);

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !isSubmitting) {
        onClose();
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            last.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === last) {
            first.focus();
            e.preventDefault();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "unset";
      clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = "Title is required";
    if (!formData.description.trim()) errs.description = "Description is required";
    if (!formData.category.trim()) errs.category = "Category is required";
    if (!formData.date) errs.date = "Date is required";
    if (!formData.time.trim()) errs.time = "Time is required";
    if (!formData.venue.trim()) errs.venue = "Venue is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setServerError("");
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setServerError("");

    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category.trim(),
        date: new Date(formData.date).toISOString().split('T')[0], // keep just date part
        time: formData.time.trim(),
        venue: formData.venue.trim(),
        featured: formData.featured,
        imageUrl: formData.imageUrl.trim(),
      };

      if (isEditing) {
        updateEvent(event.id, payload);
      } else {
        createEvent(payload);
      }

      toast.success(
        isEditing
          ? `Event "${formData.title}" updated successfully!`
          : `Event "${formData.title}" created successfully!`
      );
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error("Save event failed:", err);
      const errorMsg = err.message || "Failed to save event";
      setServerError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-form-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        onClick={() => {
          if (!isSubmitting) onClose();
        }}
      />

      {/* Modal Box */}
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl p-6 sm:p-8 z-10 my-auto text-slate-100 max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 id="event-form-title" className="text-xl sm:text-2xl font-bold text-white">
            {isEditing ? "Edit Event" : "Create New Event"}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isEditing
              ? "Modify event details and update the campus directory."
              : "Add a new campus event to the live portal."}
          </p>
        </div>

        {serverError && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-950/60 border border-rose-700/60 text-rose-300 text-xs sm:text-sm flex items-center gap-2">
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Event Title <span className="text-rose-400">*</span>
            </label>
            <input
              ref={firstInputRef}
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. ByteForge Hackathon 2026"
              className={`w-full px-4 py-2.5 rounded-xl bg-slate-950/80 text-sm text-white border transition-all focus:outline-none focus:ring-2 ${
                errors.title ? "border-rose-500 focus:ring-rose-500/50" : "border-slate-700 focus:ring-indigo-500/50"
              }`}
            />
            {errors.title && <p className="text-rose-400 text-xs mt-1">{errors.title}</p>}
          </div>

          {/* Category & Date Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Category <span className="text-rose-400">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 text-sm text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                {DEFAULT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-slate-900">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Date <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-xl bg-slate-950/80 text-sm text-white border transition-all focus:outline-none focus:ring-2 ${
                  errors.date ? "border-rose-500 focus:ring-rose-500/50" : "border-slate-700 focus:ring-indigo-500/50"
                }`}
              />
              {errors.date && <p className="text-rose-400 text-xs mt-1">{errors.date}</p>}
            </div>
          </div>

          {/* Time & Venue Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Time <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="time"
                value={formData.time}
                onChange={handleChange}
                placeholder="e.g. 10:00 AM - 5:00 PM"
                className={`w-full px-4 py-2.5 rounded-xl bg-slate-950/80 text-sm text-white border transition-all focus:outline-none focus:ring-2 ${
                  errors.time ? "border-rose-500 focus:ring-rose-500/50" : "border-slate-700 focus:ring-indigo-500/50"
                }`}
              />
              {errors.time && <p className="text-rose-400 text-xs mt-1">{errors.time}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Venue <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                placeholder="e.g. Main Auditorium, ABESEC"
                className={`w-full px-4 py-2.5 rounded-xl bg-slate-950/80 text-sm text-white border transition-all focus:outline-none focus:ring-2 ${
                  errors.venue ? "border-rose-500 focus:ring-rose-500/50" : "border-slate-700 focus:ring-indigo-500/50"
                }`}
              />
              {errors.venue && <p className="text-rose-400 text-xs mt-1">{errors.venue}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Description <span className="text-rose-400">*</span>
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed description of the event..."
              className={`w-full px-4 py-2.5 rounded-xl bg-slate-950/80 text-sm text-white border transition-all focus:outline-none focus:ring-2 ${
                errors.description
                  ? "border-rose-500 focus:ring-rose-500/50"
                  : "border-slate-700 focus:ring-indigo-500/50"
              }`}
            />
            {errors.description && <p className="text-rose-400 text-xs mt-1">{errors.description}</p>}
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Image URL (optional)
            </label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 text-sm text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          {/* Featured Toggle */}
          <div className="flex items-center gap-3 pt-2">
            <input
              id="event-featured"
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-700 bg-slate-950 cursor-pointer"
            />
            <label htmlFor="event-featured" className="text-sm font-medium text-slate-200 cursor-pointer">
              Mark as Featured Event (Spotlight on Home Page)
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </>
              ) : isEditing ? (
                "Update Event"
              ) : (
                "Create Event"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
