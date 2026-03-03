import { SignJWT, jwtVerify } from "jose";
const enc = new TextEncoder();
export type AuthToken = { sub: string };
export const cookieName = () => process.env.JWT_COOKIE_NAME ?? "movie_auth";

export async function signToken(payload: AuthToken) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET missing");
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(enc.encode(secret));
}

export async function verifyToken(token: string) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET missing");
  const { payload } = await jwtVerify(token, enc.encode(secret));
  return payload as unknown as AuthToken;
}
