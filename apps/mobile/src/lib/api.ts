import Constants from "expo-constants";
import { getToken } from "./session";

export function apiBaseUrl() {
  const extra: any = Constants.expoConfig?.extra ?? {};
  return (extra.EXPO_PUBLIC_API_BASE_URL as string) || "http://localhost:3000";
}

export async function apiFetch(path: string, init: RequestInit = {}) {
  const token = await getToken();
  const headers = new Headers(init.headers ?? {});
  headers.set("content-type", "application/json");
  if (token) headers.set("authorization", `Bearer ${token}`);
  const res = await fetch(apiBaseUrl() + path, { ...init, headers });
  const text = await res.text();
  const json = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(json?.error ?? `HTTP ${res.status}`);
  return json;
}
