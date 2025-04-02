const API_URL = "http://localhost:3000/api";

// Create guest
export const createGuest = async (data) => {
  const response = await fetch(`${API_URL}/guests`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await response.json();
};

// Create a room
export const createRoom = async (data) => {
  const response = await fetch(`${API_URL}/rooms`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await response.json();
};

// Get all rooms
export const getRooms = async () => {
  const response = await fetch(`${API_URL}/rooms`);
  return await response.json();
};

// Delete a room
export const deleteRoom = async (id) => {
  const response = await fetch(`${API_URL}/rooms`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  return await response.json();
};

// Check-in (Create a reservation and corresponding billing entry)
export const createReservation = async (data) => {
  const response = await fetch(`${API_URL}/reservations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await response.json();
};

// Check-out (Update check-out date)
export const checkOut = async (data) => {
  const response = await fetch(`${API_URL}/reservations`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await response.json();
};

// Add catering entry and update billing
export const addCatering = async (data) => {
  const response = await fetch(`${API_URL}/catering`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await response.json();
};

// Get final bill details
export const getBillDetails = async (token_number) => {
  const response = await fetch(
    `${API_URL}/billing?token_number=${token_number}`
  );
  return await response.json();
};

// Update isPaid status in billing
export const togglePaidStatus = async (data) => {
  const response = await fetch(`${API_URL}/billing`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await response.json();
};

// Check-out route call after marking as paid
export const checkout = async (data) => {
  const response = await fetch(`${API_URL}/reservations`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await response.json();
};
