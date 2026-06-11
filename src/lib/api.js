let API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:5000/api" : "https://amruth.onrender.com/api");

if (API_URL.endsWith('/')) {
  API_URL = API_URL.slice(0, -1);
}
if (!API_URL.endsWith('/api')) {
  API_URL = `${API_URL}/api`;
}

async function request(path, options = {}) {
  const token = localStorage.getItem("amrut_token");
  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
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

export function updateBookingStatus(id, status) {
  return request(`/owner/bookings/${id}`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}

export function getClientBookings() {
  return request("/client/bookings");
}

export function getOwnerClients() {
  return request("/owner/clients");
}

export function getOwnerEnrollments() {
  return request("/owner/enrollments");
}

export function getTransformations() {
  return request("/transformations");
}

export function createTransformation(payload) {
  return request("/owner/transformations", {
    method: "POST",
    body: payload,
  });
}

export function updateTransformation(id, payload) {
  return request(`/owner/transformations/${id}`, {
    method: "PUT",
    body: payload,
  });
}

export function deleteTransformation(id) {
  return request(`/owner/transformations/${id}`, {
    method: "DELETE",
  });
}

export function createProgram(payload) {
  return request("/owner/programs", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateProgram(id, payload) {
  return request(`/owner/programs/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteProgram(id) {
  return request(`/owner/programs/${id}`, {
    method: "DELETE",
  });
}
