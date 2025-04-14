"use client";
import { useState, useEffect } from "react";
import { createReservation, createGuest, getRooms } from "@/lib/api";

const credentials = {
  Admin: { id: "admin123", password: "adminpass" },
  Receptionist: { id: "reception123", password: "receptionpass" },
  Caterer: { id: "caterer123", password: "catererpass" },
};

export default function ReservationPage() {
  const [role, setRole] = useState(null);
  const [loginId, setLoginId] = useState("reception123");
  const [loginPassword, setLoginPassword] = useState("receptionpass");
  const [loginError, setLoginError] = useState("");
  const [selectedRole, setSelectedRole] = useState("Receptionist");

  const [guestName, setGuestName] = useState("");
  const [guestContact, setGuestContact] = useState("");
  const [frequentGuestId, setFrequentGuestId] = useState("");
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [roomId, setRoomId] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [tokenNumber, setTokenNumber] = useState("");
  const [message, setMessage] = useState("");
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole === "Receptionist") {
      setRole(storedRole);
    }
  }, []);

  useEffect(() => {
    if (role === "Receptionist") {
      const fetchRooms = async () => {
        const result = await getRooms();
        if (result.rooms) {
          setRooms(result.rooms);
        } else {
          setMessage(result.message);
        }
      };
      fetchRooms();
    }
  }, [role]);

  const handleLogin = () => {
    const expected = credentials[selectedRole];
    if (
      selectedRole === "Receptionist" &&
      loginId === expected.id &&
      loginPassword === expected.password
    ) {
      localStorage.setItem("role", selectedRole);
      setRole(selectedRole);
    } else {
      setLoginError("Invalid credentials or unauthorized role");
    }
  };

  if (role !== "Receptionist") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-black">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-4">Login</h1>
          <label className="block mb-2">Select Role</label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full border p-2 mb-4 rounded"
          >
            <option value="Admin">Admin</option>
            <option value="Receptionist">Receptionist</option>
            <option value="Caterer">Caterer</option>
          </select>

          <input
            type="text"
            placeholder="ID"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            className="w-full border p-2 mb-4 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            className="w-full border p-2 mb-4 rounded"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
          {loginError && (
            <p className="text-red-500 text-center mt-4">{loginError}</p>
          )}
        </div>
      </div>
    );
  }

  const handleCheckIn = async () => {
    const guestData = {
      name: guestName,
      contact: guestContact,
      frequent_guest_id: frequentGuestId,
      loyalty_points: loyaltyPoints,
    };
    const guestResult = await createGuest(guestData);

    if (guestResult.guestId) {
      const reservationData = {
        guest_id: guestResult.guestId,
        room_id: roomId,
        check_in_date: checkInDate,
        token_number: tokenNumber,
      };
      const result = await createReservation(reservationData);
      setMessage(result.message);
    } else {
      setMessage(guestResult.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-black">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => {
            localStorage.removeItem("role");
            setRole(null);
          }}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">
          Check-in
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block mb-2 font-semibold">Guest Name</label>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="p-4 rounded border w-full"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">Guest Contact</label>
            <input
              type="text"
              value={guestContact}
              onChange={(e) => setGuestContact(e.target.value)}
              className="p-4 rounded border w-full"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">
              Frequent Guest ID
            </label>
            <input
              type="text"
              value={frequentGuestId}
              onChange={(e) => setFrequentGuestId(e.target.value)}
              className="p-4 rounded border w-full"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">Loyalty Points</label>
            <input
              type="number"
              value={loyaltyPoints}
              onChange={(e) => setLoyaltyPoints(Number(e.target.value))}
              className="p-4 rounded border w-full"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">Room ID</label>
            <input
              type="number"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="p-4 rounded border w-full"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">Check-in Date</label>
            <input
              type="date"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              className="p-4 rounded border w-full"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">Token Number</label>
            <input
              type="text"
              value={tokenNumber}
              onChange={(e) => setTokenNumber(e.target.value)}
              className="p-4 rounded border w-full"
            />
          </div>
        </div>

        <button
          onClick={handleCheckIn}
          className="w-full py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Check-in
        </button>

        {message && <p className="mt-4 text-center text-red-500">{message}</p>}
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-center text-indigo-600 mb-6">
          Available Rooms
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white p-6 rounded shadow hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold text-indigo-600">
                Room Number: {room.id}
              </h3>
              <p className="text-gray-700">AC: {room.is_ac ? "Yes" : "No"}</p>
              <p className="text-gray-700">Base Rate: ${room.base_rate}</p>
              <p
                className={`mt-2 border-2 rounded-lg p-2 text-center font-semibold ${
                  room.is_occupied
                    ? "border-red-500 text-red-500"
                    : "border-green-500 text-green-500"
                }`}
              >
                {room.is_occupied ? "Occupied" : "Available"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
