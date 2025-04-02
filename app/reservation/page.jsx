"use client";
import { createReservation, createGuest, getRooms } from "@/lib/api";
import { useState, useEffect } from "react";

const ReservationPage = () => {
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
    // Fetch all rooms when the page loads
    const fetchRooms = async () => {
      const result = await getRooms();
      if (result.rooms) {
        setRooms(result.rooms);
      } else {
        setMessage(result.message);
      }
    };
    fetchRooms();
  }, []);

  const handleCheckIn = async () => {
    // Create the guest first and get guest_id
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
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">
          Check-in
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="guestName">
              Guest Name
            </label>
            <input
              type="text"
              id="guestName"
              placeholder="Guest Name"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="p-4 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-indigo-500 w-full"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="guestContact">
              Guest Contact
            </label>
            <input
              type="text"
              id="guestContact"
              placeholder="Guest Contact"
              value={guestContact}
              onChange={(e) => setGuestContact(e.target.value)}
              className="p-4 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-indigo-500 w-full"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="frequentGuestId">
              Frequent Guest ID
            </label>
            <input
              type="text"
              id="frequentGuestId"
              placeholder="Frequent Guest ID"
              value={frequentGuestId}
              onChange={(e) => setFrequentGuestId(e.target.value)}
              className="p-4 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-indigo-500 w-full"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="loyaltyPoints">
              Loyalty Points
            </label>
            <input
              type="number"
              id="loyaltyPoints"
              placeholder="Loyalty Points"
              value={loyaltyPoints}
              onChange={(e) => setLoyaltyPoints(Number(e.target.value))}
              className="p-4 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-indigo-500 w-full"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="roomId">
              Room ID
            </label>
            <input
              type="number"
              id="roomId"
              placeholder="Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="p-4 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-indigo-500 w-full"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="checkInDate">
              Check-in Date
            </label>
            <input
              type="date"
              id="checkInDate"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              className="p-4 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-indigo-500 w-full"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="tokenNumber">
              Token Number
            </label>
            <input
              type="text"
              id="tokenNumber"
              placeholder="Token Number"
              value={tokenNumber}
              onChange={(e) => setTokenNumber(e.target.value)}
              className="p-4 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-indigo-500 w-full"
            />
          </div>
        </div>

        <button
          onClick={handleCheckIn}
          className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none"
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
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              <h3 className="text-xl font-semibold text-indigo-600">
                Room Number: {room.id}
              </h3>
              <p className="text-gray-700">AC: {room.is_ac ? "Yes" : "No"}</p>
              <p className="text-gray-700">Base Rate: ${room.base_rate}</p>
              <p
                className={`${
                  room.is_occupied
                    ? "border-red-500 text-red-500"
                    : "border-green-500 text-green-500"
                } border-2 rounded-lg p-2 text-center font-semibold`}
              >
                {room.is_occupied ? "Occupied" : "Available"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReservationPage;
