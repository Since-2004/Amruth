const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:5000/api" : "https://amruth.onrender.com/api");

async function request(path, options = {}) {
  const token = localStorage.getItem("amrut_token");
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong");
  }

  return data;
}

export function loginUser(payload) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function registerUser(payload) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function sendContactMessage(payload) {
  return request("/contact", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function submitFeedback(payload) {
  return request("/feedback", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function createEnrollment(payload) {
  return request("/enrollments", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getPrograms() {
  return request("/programs");
}

export function getTheme() {
  return request("/theme");
}

export function getSlots() {
  return request("/slots");
}

export function createBooking(payload) {
  return request("/bookings", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getOwnerSummary() {
  return request("/owner/summary");
}

export function getOwnerBookings() {
  return request("/owner/bookings");
}

export function getOwnerNotifications() {
  return request("/owner/notifications");
}

export function markNotificationsRead() {
  return request("/owner/notifications/read", {
    method: "POST",
    body: JSON.stringify({}),
  });
}

export function createSlot(payload) {
  return request("/owner/slots", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateTheme(payload) {
  return request("/owner/theme", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function getOwnerSettings() {
  return request("/owner/settings");
}

export function updateOwnerSettings(payload) {
  return request("/owner/settings", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function updateBookingDiet(id, dietPlan) {
  return request(`/owner/bookings/${id}`, {
    method: "PUT",
    body: JSON.stringify({ dietPlan }),
  });
}

export function getClientBookings() {
  return request("/client/bookings");
}
