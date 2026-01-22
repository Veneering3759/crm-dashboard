const BASE = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

export function apiUrl(path) {
  if (!BASE) throw new Error("VITE_API_URL is not set (check Vercel env vars).");
  return `${BASE}${path}`;
}

export async function apiFetch(path, options = {}) {
  const res = await fetch(apiUrl(path), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const message =
      (data && data.error) ||
      (typeof data === "string" && data) ||
      `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data;
}

