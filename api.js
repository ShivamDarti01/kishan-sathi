const API_URL = import.meta.env.VITE_API_URL || "";

async function request(path, { token, ...options } = {}) {
  const headers = new Headers(options.headers || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.detail || `Request failed (${response.status})`);
    error.status = response.status;
    throw error;
  }
  return payload;
}

export const api = {
  health: () => request("/api/health"),
  login: (email, password) => request("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }),
  register: (name, email, password) => request("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  }),
  scans: (token) => request("/api/scans", { token }),
  scan: (token, id) => request(`/api/scans/${id}`, { token }),
  deleteScan: (token, id) => request(`/api/scans/${id}`, { method: "DELETE", token }),
  analyze: (token, file, crop) => {
    const body = new FormData();
    body.append("file", file);
    body.append("crop", crop);
    return request("/api/analyze", { method: "POST", token, body });
  },
  diseases: () => request("/api/diseases"),
};
