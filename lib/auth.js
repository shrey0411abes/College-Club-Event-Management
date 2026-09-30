import * as jose from "jose";

export const COOKIE_NAME = "admin_token";

/**
 * Reads JWT_SECRET from the environment lazily and validates it.
 * Throws a clear error if the variable is missing or shorter than 32 characters.
 */
function getSecretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "JWT_SECRET environment variable is missing or shorter than 32 characters. " +
        "Set a strong JWT_SECRET in .env.local before running the server."
    );
  }
  return new TextEncoder().encode(secret);
}

/**
 * Creates a signed JWT for the admin session valid for 24 hours.
 */
export async function createAdminToken() {
  return await new jose.SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(getSecretKey());
}

/**
 * Verifies the JWT and returns the payload, or null if invalid.
 */
export async function verifyAdminToken(token) {
  if (!token) return null;
  try {
    const { payload } = await jose.jwtVerify(token, getSecretKey());
    return payload;
  } catch {
    return null;
  }
}

/**
 * Helper to verify admin authentication from a NextRequest.
 * Checks httpOnly cookie first, then Authorization Bearer header.
 */
export async function isAuthenticatedAdmin(request) {
  const token =
    request.cookies.get(COOKIE_NAME)?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) return false;

  const payload = await verifyAdminToken(token);
  return payload && payload.role === "admin";
}
