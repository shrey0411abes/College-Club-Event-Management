import { NextResponse } from "next/server";
import { createAdminToken, COOKIE_NAME } from "@/lib/auth";
import crypto from "crypto";

// ---------------------------------------------------------------------------
// Simple in-memory rate limiter: 5 failed attempts per 15 minutes per IP.
// Resets on successful login. Stored in module-level Map (survives hot reloads
// within the same process, but resets on server restart — acceptable for MVP).
// ---------------------------------------------------------------------------
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

/** @type {Map<string, { count: number; resetAt: number }>} */
const loginAttempts = new Map();

function getClientIp(request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isTooManyRequests(ip) {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry || now > entry.resetAt) {
    // Window expired — start fresh
    loginAttempts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT_MAX) return true;
  entry.count += 1;
  return false;
}

function clearAttempts(ip) {
  loginAttempts.delete(ip);
}

// ---------------------------------------------------------------------------

export async function POST(request) {
  const ip = getClientIp(request);

  // Check rate limit before doing any processing
  if (isTooManyRequests(ip)) {
    return NextResponse.json(
      {
        success: false,
        error: "Too many login attempts. Please try again in 15 minutes.",
      },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { password } = body || {};

    const expectedPassword = process.env.ADMIN_PASSWORD;

    if (!expectedPassword) {
      console.error("ADMIN_PASSWORD is not configured in environment variables");
      return NextResponse.json(
        { success: false, error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Compare passwords with timingSafeEqual to prevent timing attacks.
    // Both buffers must be the same byte length, so we hash them first.
    const providedBuf = Buffer.from(
      crypto.createHash("sha256").update(String(password ?? "")).digest("hex")
    );
    const expectedBuf = Buffer.from(
      crypto.createHash("sha256").update(expectedPassword).digest("hex")
    );

    const isMatch = crypto.timingSafeEqual(providedBuf, expectedBuf);

    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Invalid admin password" },
        { status: 401 }
      );
    }

    // Successful login — clear rate-limit counter for this IP
    clearAttempts(ip);

    // Issue signed JWT valid for 24h
    const token = await createAdminToken();

    const response = NextResponse.json({
      success: true,
      data: { message: "Logged in successfully" },
    });

    // Set secure httpOnly cookie
    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error) {
    console.error("POST /api/admin/login error:", error);
    return NextResponse.json(
      { success: false, error: "Authentication failed" },
      { status: 500 }
    );
  }
}
