import { isEventPast } from "./eventTime.js";
import { initialEvents, initialRegistrations } from "./seedData.js";

const EVENTS_KEY = "cc_events_v1";
const REGS_KEY = "cc_regs_v1";

// In-memory fallback if localStorage is unavailable
let memoryEvents = null;
let memoryRegs = null;
const listeners = new Set();

function notify() {
  for (const listener of listeners) {
    try {
      listener();
    } catch (err) {
      console.error("Store listener error:", err);
    }
  }
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getStorage() {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const testKey = "__storage_test__";
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return window.localStorage;
  } catch (e) {
    return null;
  }
}

function clone(data) {
  return JSON.parse(JSON.stringify(data));
}

function loadData() {
  const storage = getStorage();
  if (storage) {
    try {
      const storedEvents = storage.getItem(EVENTS_KEY);
      const storedRegs = storage.getItem(REGS_KEY);

      let evts = storedEvents !== null ? JSON.parse(storedEvents) : null;
      let regs = storedRegs !== null ? JSON.parse(storedRegs) : null;

      // Seed only when storage is empty
      if (evts === null) {
        evts = clone(initialEvents);
        storage.setItem(EVENTS_KEY, JSON.stringify(evts));
      }
      if (regs === null) {
        regs = clone(initialRegistrations);
        storage.setItem(REGS_KEY, JSON.stringify(regs));
      }

      memoryEvents = evts;
      memoryRegs = regs;
    } catch (err) {
      console.error("localStorage error, falling back to memory:", err);
      if (memoryEvents === null) memoryEvents = clone(initialEvents);
      if (memoryRegs === null) memoryRegs = clone(initialRegistrations);
    }
  } else {
    if (memoryEvents === null) memoryEvents = clone(initialEvents);
    if (memoryRegs === null) memoryRegs = clone(initialRegistrations);
  }
}

function saveData() {
  const storage = getStorage();
  if (storage) {
    try {
      storage.setItem(EVENTS_KEY, JSON.stringify(memoryEvents));
      storage.setItem(REGS_KEY, JSON.stringify(memoryRegs));
    } catch (e) {
      console.error("localStorage write error:", e);
    }
  }
}

export function initializeStore() {
  if (memoryEvents === null || memoryRegs === null) {
    loadData();
  }
}

function validateImageUrl(url) {
  if (!url) return "";
  const trimmed = url.trim();
  if (!trimmed) return "";
  
  if (trimmed.startsWith("https://")) return trimmed;
  if (trimmed.startsWith("/events/")) return trimmed;
  
  if (trimmed.startsWith("data:image/")) {
    const validTypes = ["data:image/jpeg;base64,", "data:image/png;base64,", "data:image/webp;base64,"];
    if (validTypes.some(type => trimmed.startsWith(type))) {
      // 400 KB limit (~550,000 base64 chars)
      if (trimmed.length <= 550000) return trimmed;
      throw new Error("Image data too large (max 400 KB allowed for local storage)");
    }
  }
  
  throw new Error("Invalid image format or source. Only HTTPS URLs, /events/ paths, or valid image uploads are allowed.");
}

export function resetDemoData() {
  initializeStore();
  memoryEvents = clone(initialEvents);
  memoryRegs = clone(initialRegistrations);
  saveData();
  notify();
  return { events: memoryEvents, registrations: memoryRegs };
}

export function getEvents() {
  initializeStore();
  return memoryEvents;
}

export function getEvent(id) {
  initializeStore();
  return memoryEvents.find((e) => e.id === id) || null;
}

export function createEvent(data) {
  initializeStore();
  const newEvent = {
    ...data,
    imageUrl: validateImageUrl(data.imageUrl),
    id: crypto.randomUUID(),
  };
  memoryEvents = [...memoryEvents, newEvent];
  saveData();
  notify();
  return newEvent;
}

export function updateEvent(id, data) {
  initializeStore();
  const idx = memoryEvents.findIndex((e) => e.id === id);
  if (idx === -1) {
    throw new Error("Event not found");
  }

  const updatedImageUrl = data.imageUrl !== undefined 
    ? validateImageUrl(data.imageUrl) 
    : memoryEvents[idx].imageUrl;

  const updated = { ...memoryEvents[idx], ...data, imageUrl: updatedImageUrl };
  memoryEvents = [
    ...memoryEvents.slice(0, idx),
    updated,
    ...memoryEvents.slice(idx + 1),
  ];
  saveData();
  notify();
  return updated;
}

export function deleteEvent(id) {
  initializeStore();
  memoryEvents = memoryEvents.filter((e) => e.id !== id);
  // Cascade delete registrations associated with this event
  memoryRegs = memoryRegs.filter((r) => r.eventId !== id);
  saveData();
  notify();
  return true;
}

export function getRegistrations(options) {
  initializeStore();
  if (!options || (!options.eventId && !options.q)) {
    return memoryRegs;
  }

  let regs = memoryRegs;

  if (options.eventId && options.eventId !== "all") {
    regs = regs.filter((r) => r.eventId === options.eventId);
  }

  if (options.q) {
    const lowerQ = options.q.trim().toLowerCase();
    regs = regs.filter(
      (r) =>
        r.name.toLowerCase().includes(lowerQ) ||
        r.email.toLowerCase().includes(lowerQ)
    );
  }

  return regs;
}

export function addRegistration(data) {
  initializeStore();

  const { eventId, name, email, phone, collegeYear } = data || {};

  if (!eventId || !name?.trim() || !email?.trim() || !phone?.trim() || !collegeYear?.trim()) {
    return { success: false, error: "All fields are required" };
  }

  const trimmedEmail = email.trim().toLowerCase();

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    return { success: false, error: "Invalid email format" };
  }

  // Validate 10-digit phone number
  const phoneClean = phone.trim();
  const phoneRegex = /^\d{10}$/;
  if (!phoneRegex.test(phoneClean)) {
    return { success: false, error: "Phone number must be exactly 10 digits" };
  }

  const event = getEvent(eventId);
  if (!event) {
    return { success: false, error: "Event not found" };
  }

  // Reject past events using isEventPast (Asia/Kolkata)
  if (isEventPast(event.date, event.time)) {
    return { success: false, error: "Registration is closed for this past event" };
  }

  // Reject duplicate (eventId + email)
  const isDuplicate = memoryRegs.some(
    (r) => r.eventId === eventId && r.email.toLowerCase() === trimmedEmail
  );
  if (isDuplicate) {
    return {
      success: false,
      error: "You have already registered for this event with this email address",
    };
  }

  const newReg = {
    id: crypto.randomUUID(),
    eventId,
    name: name.trim(),
    email: trimmedEmail,
    phone: phoneClean,
    collegeYear: collegeYear.trim(),
    createdAt: new Date().toISOString(),
  };

  memoryRegs = [...memoryRegs, newReg];
  saveData();
  notify();

  return { success: true, data: newReg };
}
