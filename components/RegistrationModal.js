"use client";

import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useStore } from "@/context/StoreProvider";

function downloadCalendarIcs(event) {
  if (!event) return;
  const d = new Date(event.date);
  const dateStr = !isNaN(d.getTime())
    ? d.toISOString().split("T")[0].replace(/-/g, "")
    : new Date().toISOString().split("T")[0].replace(/-/g, "");

  let startHour = "10";
  let startMin = "00";
  let endHour = "12";
  let endMin = "00";

  if (event.time) {
    const parts = event.time.split(/[-–]/);
    const startPart = parts[0]?.trim();
    const m = startPart.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
    if (m) {
      let h = parseInt(m[1], 10);
      const min = m[2];
      const mer = m[3]?.toUpperCase();
      if (mer === "PM" && h !== 12) h += 12;
      if (mer === "AM" && h === 12) h = 0;
      startHour = String(h).padStart(2, "0");
      startMin = min;
      endHour = String(Math.min(h + 2, 23)).padStart(2, "0");
      endMin = min;
    }
  }

  const dtStart = `${dateStr}T${startHour}${startMin}00`;
  const dtEnd = `${dateStr}T${endHour}${endMin}00`;
  const nowStr = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const icsLines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//CodeChef ABESEC//Club Event Portal//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.id || crypto.randomUUID()}@codechef-abesec`,
    `DTSTAMP:${nowStr}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${(event.title || "Club Event").replace(/[,;]/g, " ")}`,
    `DESCRIPTION:${(event.description || "").replace(/[,;\n]/g, " ")}`,
    `LOCATION:${(event.venue || "ABES Engineering College").replace(/[,;]/g, " ")}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  const icsContent = icsLines.join("\r\n");
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${(event.title || "event").toLowerCase().replace(/[^a-z0-9]/g, "-")}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast.success("Calendar invite (.ics) downloaded!");
}

function AnimatedCheckmark() {
  return (
    <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
      <svg className="w-8 h-8 text-emerald-400" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          className="animate-check"
          d="M5 13l4 4L19 7"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength="100"
        />
      </svg>
    </div>
  );
}

export default function RegistrationModal({ event, isOpen, onClose }) {
  const { addRegistration } = useStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    collegeYear: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [registeredData, setRegisteredData] = useState(null);
  const [shaking, setShaking] = useState(false);
  const [mounted, setMounted] = useState(false);

  const modalRef = useRef(null);
  const firstInputRef = useRef(null);

  // Entrance animation trigger
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      setMounted(true);
    }, 16);
    return () => {
      clearTimeout(timer);
      setMounted(false);
    };
  }, [isOpen]);

  // Lock body scroll and focus first input on mount
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => {
      firstInputRef.current?.focus();
    }, 100);

    return () => {
      document.body.style.overflow = "unset";
      clearTimeout(timer);
    };
  }, [isOpen]);

  // Handle Escape key and Focus Trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (!isSubmitting) onClose();
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen || !event) return null;

  // Validation function
  const validateField = (field, value) => {
    let err = "";
    if (field === "name") {
      if (!value.trim()) err = "Full name is required";
      else if (value.trim().length < 2) err = "Name must be at least 2 characters";
    } else if (field === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value.trim()) {
        err = "Email address is required";
      } else if (!emailRegex.test(value.trim())) {
        err = "Please enter a valid email address (e.g. name@abesec.ac.in)";
      }
    } else if (field === "collegeYear") {
      if (!value.trim()) err = "College and year are required (e.g. 2nd Year CSE)";
    } else if (field === "phone") {
      const phoneRegex = /^\d{10}$/;
      const cleaned = value.trim();
      if (!cleaned) {
        err = "Phone number is required";
      } else if (!phoneRegex.test(cleaned)) {
        err = "Phone number must be exactly 10 digits";
      }
    }
    return err;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setServerError("");

    if (touched[name]) {
      const err = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: err }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const err = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  const triggerShake = () => {
    setShaking(true);
    setTimeout(() => setShaking(false), 400);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {
      name: validateField("name", formData.name),
      email: validateField("email", formData.email),
      collegeYear: validateField("collegeYear", formData.collegeYear),
      phone: validateField("phone", formData.phone),
    };

    setTouched({
      name: true,
      email: true,
      collegeYear: true,
      phone: true,
    });
    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) {
      triggerShake();
      return;
    }

    setIsSubmitting(true);
    setServerError("");

    try {
      const result = addRegistration({
        eventId: event.id,
        name: formData.name.trim(),
        email: formData.email.trim(),
        collegeYear: formData.collegeYear.trim(),
        phone: formData.phone.trim(),
      });

      if (result.success) {
        toast.success(`Successfully registered for ${event.title}!`);
        setRegisteredData(result.data);
      } else {
        setServerError(result.error);
        toast.error(result.error);
        triggerShake();
      }
    } catch (err) {
      console.error("Registration error:", err);
      const errorMsg = err.message || "Registration failed. Please try again.";
      setServerError(errorMsg);
      toast.error(errorMsg);
      triggerShake();
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (field) =>
    `w-full px-4 py-2.5 rounded-xl bg-slate-950/80 text-sm text-white placeholder-slate-500 border transition-all focus:outline-none focus:ring-2 ${
      touched[field] && errors[field]
        ? "border-rose-500 focus:ring-rose-500/50"
        : "border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/50"
    }`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="registration-modal-title"
    >
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity duration-300 ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => {
          if (!isSubmitting) onClose();
        }}
      />

      {/* Modal Card with entrance animation */}
      <div
        ref={modalRef}
        className={`relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl shadow-indigo-950/50 p-6 sm:p-8 z-10 my-auto text-slate-100 transition-all duration-300 max-h-[90vh] overflow-y-auto ${
          mounted
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4"
        } ${shaking ? "animate-shake" : ""}`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isSubmitting}
          aria-label="Close registration dialog"
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer disabled:opacity-50"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {registeredData ? (
          /* SUCCESS SCREEN */
          <div className="text-center py-2 space-y-6">
            <AnimatedCheckmark />

            <div className="space-y-2">
              <h3 id="registration-modal-title" className="text-2xl font-extrabold text-white">
                Registration Confirmed!
              </h3>
              <p className="text-sm text-slate-300 max-w-sm mx-auto">
                You are confirmed for <span className="font-semibold text-indigo-300">{event.title}</span>.
              </p>
            </div>

            {/* Registration Details Summary */}
            <div className="bg-slate-950/80 rounded-2xl p-4 text-left border border-slate-800 text-xs sm:text-sm space-y-2.5">
              <div className="flex justify-between pb-2 border-b border-slate-800/80">
                <span className="text-slate-400">Event:</span>
                <span className="font-semibold text-white line-clamp-1">{event.title}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-800/80">
                <span className="text-slate-400">Date &amp; Time:</span>
                <span className="font-semibold text-slate-200">
                  {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} • {event.time}
                </span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-800/80">
                <span className="text-slate-400">Venue:</span>
                <span className="font-semibold text-indigo-300">{event.venue}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-800/80">
                <span className="text-slate-400">Participant:</span>
                <span className="font-semibold text-slate-200">{registeredData.name}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-800/80">
                <span className="text-slate-400">Email:</span>
                <span className="font-semibold text-slate-200 font-mono text-xs">{registeredData.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Phone:</span>
                <span className="font-semibold text-slate-200 font-mono text-xs">{registeredData.phone}</span>
              </div>
            </div>

            {/* Action Buttons: Add to Calendar & Done */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={() => downloadCalendarIcs(event)}
                className="w-full py-3 px-6 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 shadow-lg shadow-indigo-600/30 transition-all hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Add to Calendar (.ics)
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-6 rounded-2xl font-semibold text-sm text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-all hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          /* REGISTRATION FORM */
          <div>
            {/* Header */}
            <div className="pr-8 space-y-1">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-950/80 text-indigo-400 border border-indigo-800/60 mb-1">
                Event Registration
              </span>
              <h2 id="registration-modal-title" className="text-xl sm:text-2xl font-bold text-white">
                {event.title}
              </h2>
              <p className="text-xs text-slate-400 flex items-center gap-2 pt-1">
                <span>📅 {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                <span>•</span>
                <span>📍 {event.venue}</span>
              </p>
            </div>

            {/* Server Error Alert Banner */}
            {serverError && (
              <div
                role="alert"
                className="mt-4 p-3.5 rounded-2xl bg-rose-950/60 border border-rose-700/60 text-rose-300 text-xs sm:text-sm flex items-start gap-2.5"
              >
                <svg className="w-5 h-5 flex-shrink-0 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{serverError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
              {/* Name Field */}
              <div>
                <label htmlFor="reg-name" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <input
                  ref={firstInputRef}
                  id="reg-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                  aria-invalid={Boolean(touched.name && errors.name)}
                  aria-describedby={touched.name && errors.name ? "name-error" : undefined}
                  placeholder="e.g. Aarav Sharma"
                  className={inputClass("name")}
                />
                {touched.name && errors.name && (
                  <p id="name-error" className="text-rose-400 text-xs mt-1 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="reg-email" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Email Address <span className="text-rose-400">*</span>
                </label>
                <input
                  id="reg-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                  aria-invalid={Boolean(touched.email && errors.email)}
                  aria-describedby={touched.email && errors.email ? "email-error" : undefined}
                  placeholder="e.g. student@abesec.ac.in"
                  className={inputClass("email")}
                />
                {touched.email && errors.email && (
                  <p id="email-error" className="text-rose-400 text-xs mt-1 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* College / Year Field */}
              <div>
                <label htmlFor="reg-collegeYear" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  College &amp; Year <span className="text-rose-400">*</span>
                </label>
                <input
                  id="reg-collegeYear"
                  type="text"
                  name="collegeYear"
                  value={formData.collegeYear}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                  aria-invalid={Boolean(touched.collegeYear && errors.collegeYear)}
                  aria-describedby={touched.collegeYear && errors.collegeYear ? "collegeYear-error" : undefined}
                  placeholder="e.g. 3rd Year CSE, ABESEC"
                  className={inputClass("collegeYear")}
                />
                {touched.collegeYear && errors.collegeYear && (
                  <p id="collegeYear-error" className="text-rose-400 text-xs mt-1 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.collegeYear}
                  </p>
                )}
              </div>

              {/* Phone Field (10 digits) */}
              <div>
                <label htmlFor="reg-phone" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Phone Number (10 digits) <span className="text-rose-400">*</span>
                </label>
                <input
                  id="reg-phone"
                  type="tel"
                  name="phone"
                  maxLength={10}
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                  aria-invalid={Boolean(touched.phone && errors.phone)}
                  aria-describedby={touched.phone && errors.phone ? "phone-error" : undefined}
                  placeholder="e.g. 9876543210"
                  className={inputClass("phone")}
                />
                {touched.phone && errors.phone && (
                  <p id="phone-error" className="text-rose-400 text-xs mt-1 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-6 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-600/30 transition-all hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Submitting registration...
                    </>
                  ) : (
                    <>Confirm Registration</>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
