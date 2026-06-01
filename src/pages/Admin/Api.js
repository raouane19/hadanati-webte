const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
  "ngrok-skip-browser-warning": "true",
});

// Fetches the proof document for a daycare and returns a blob URL for display
export const fetchDaycareDocument = async (daycareId) => {
  const res = await fetch(`${BASE}/admin/daycares/${daycareId}/document`, {
    headers: authHeaders(),
  });

  if (res.status === 404) throw new Error("No document uploaded yet");
  if (!res.ok) throw new Error("Failed to fetch document");

  const blob = await res.blob();
  return { blobUrl: URL.createObjectURL(blob), type: blob.type };
};

// Generic GET helper (used for daycares, parents, requests, messages)
export const apiFetch = async (path) => {
  const res = await fetch(`${BASE}/admin${path}`, {
    headers: {
      ...authHeaders(),
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
};

// Generic PUT helper
export const apiPut = async (path, body) => {
  const res = await fetch(`${BASE}/admin${path}`, {
    method: "PUT",
    headers: {
      ...authHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
};