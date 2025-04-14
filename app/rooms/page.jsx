"use client";
import { useState, useEffect } from "react";
import { createRoom, getRooms, deleteRoom } from "@/lib/api";

const credentials = {
  Admin: { id: "admin123", password: "adminpass" },
  Caterer: { id: "caterer123", password: "catererpass" },
  Receptionist: { id: "reception123", password: "receptionpass" },
};

const RoomsPage = () => {
  const [role, setRole] = useState(null);
  const [selectedRole, setSelectedRole] = useState("Admin");
  const [loginId, setLoginId] = useState("admin123");
  const [loginPassword, setLoginPassword] = useState("adminpass");
  const [loginError, setLoginError] = useState("");

  const [rooms, setRooms] = useState([]);
  const [roomType, setRoomType] = useState("Single");
  const [isAc, setIsAc] = useState(false);
  const [baseRate, setBaseRate] = useState("");
  const [message, setMessage] = useState("");

  const fetchRooms = async () => {
    const data = await getRooms();
    setRooms(data.rooms);
  };

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole === "Admin") {
      setRole(storedRole);
      fetchRooms();
    }
  }, []);

  const handleLogin = () => {
    const expected = credentials[selectedRole];
    if (loginId === expected.id && loginPassword === expected.password) {
      if (selectedRole === "Admin") {
        localStorage.setItem("role", "Admin");
        setRole("Admin");
        fetchRooms();
      } else {
        setLoginError("Only Admin can access this page");
      }
    } else {
      setLoginError("Invalid credentials");
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    const data = await createRoom({
      room_type: roomType,
      is_ac: isAc,
      base_rate: baseRate,
    });
    setMessage(data.message);
    fetchRooms();
  };

  const handleDeleteRoom = async (id) => {
    await deleteRoom(id);
    fetchRooms();
  };

  if (role !== "Admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-black">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-4">Login</h1>

          <label className="block mb-1 font-medium">Role</label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full border p-2 mb-4 rounded"
          >
            <option>Admin</option>
            <option>Caterer</option>
            <option>Receptionist</option>
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

  return (
    <div className="container mx-auto p-6 text-black">
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

      <h1 className="text-3xl font-bold mb-4">Room Management</h1>

      <form
        className="bg-white p-6 shadow-md rounded mb-6"
        onSubmit={handleCreateRoom}
      >
        <div className="mb-4">
          <label className="block text-gray-700">Room Type</label>
          <select
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            className="w-full border p-2 rounded"
            required
          >
            <option value="Single">Single</option>
            <option value="Double">Double</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">AC Available</label>
          <input
            type="checkbox"
            checked={isAc}
            onChange={(e) => setIsAc(e.target.checked)}
            className="ml-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Base Rate</label>
          <input
            type="number"
            value={baseRate}
            onChange={(e) => setBaseRate(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Room
        </button>
      </form>

      {message && <p className="text-green-500 mb-4">{message}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {rooms.map((room) => (
          <div key={room.id} className="p-4 bg-white shadow-md rounded">
            <h2 className="text-2xl font-bold">Room Number: {room.id}</h2>
            <h2 className="text-xl">{room.room_type}</h2>
            <p>{room.is_ac ? "AC Available" : "Non-AC"}</p>
            <p>Base Rate: ₹{room.base_rate}</p>
            {/* Uncomment to enable delete
            <button
              onClick={() => handleDeleteRoom(room.id)}
              className="mt-2 bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
            */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomsPage;
