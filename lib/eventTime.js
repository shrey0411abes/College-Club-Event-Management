/**
 * lib/eventTime.js
 *
 * Timezone-safe "is this event in the past?" helper.
 *
 * Problem: the server may run in UTC while the club is in Asia/Kolkata (UTC+5:30).
 * A naive `new Date(date) < new Date()` comparison can mark a 7 PM IST event as
 * past at 1:30 PM UTC — 5.5 hours early.
 *
 * Solution: treat the event date+time as IST wall-clock time. We know IST is
 * always UTC+5:30 (no DST), so we add 330 minutes to convert from IST to UTC ms.
 *
 * Works identically on server (Node.js 18+) and browser.
 */

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000; // 330 minutes in ms

/**
 * Parse "3:30 PM - 5:30 PM" → { hours: 15, minutes: 30 } (24-h, start only).
 * Returns null if the string can't be parsed.
 */
function parseStartTime(timeStr) {
  if (!timeStr) return null;
  const startPart = timeStr.split(/[-–]/)[0].trim(); // "3:30 PM"
  const m = startPart.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!m) return null;
  let h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  const mer = m[3]?.toUpperCase();
  if (mer === "PM" && h !== 12) h += 12;
  if (mer === "AM" && h === 12) h = 0;
  return { hours: h, minutes: min };
}

/**
 * Returns true when the event's start date+time, interpreted as IST, is in the
 * past relative to the current moment.
 *
 * Falls back to 23:59 IST on the event date when the time string is unparseable,
 * so same-day events are never incorrectly blocked.
 *
 * @param {string|Date} date  – event date (ISO string or Date object)
 * @param {string}      time  – event time string, e.g. "3:30 PM - 5:30 PM"
 * @returns {boolean}
 */
export function isEventPast(date, time) {
  if (!date) return false;
  const d = new Date(date);
  if (isNaN(d.getTime())) return false;

  // Extract the YYYY-MM-DD portion stored in the DB (UTC midnight, which equals
  // the IST calendar date the admin intended)
  const dateStr = d.toISOString().split("T")[0]; // "2026-11-08"

  const parsed = parseStartTime(time);
  const hours   = parsed?.hours   ?? 23;
  const minutes = parsed?.minutes ?? 59;

  // Treat "dateStr HH:MM" as a UTC timestamp, then subtract IST offset to get
  // the actual UTC ms when this IST wall-clock time occurs.
  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");
  const deadlineUtcMs = Date.parse(`${dateStr}T${hh}:${mm}:00Z`) - IST_OFFSET_MS;

  return deadlineUtcMs < Date.now();
}
