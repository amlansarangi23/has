"use client";
import { addCatering } from "@/lib/api";
import { useState, useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Image from "next/image";

const credentials = {
  Admin: { id: "admin123", password: "adminpass" },
  Receptionist: { id: "reception123", password: "receptionpass" },
  Caterer: { id: "caterer123", password: "catererpass" },
};

export default function CateringPage() {
  const [role, setRole] = useState(null);
  const [selectedRole, setSelectedRole] = useState("Caterer");
  const [loginId, setLoginId] = useState("caterer123");
  const [loginPassword, setLoginPassword] = useState("catererpass");
  const [loginError, setLoginError] = useState("");

  const [tokenNumber, setTokenNumber] = useState("");
  const [cateringItems, setCateringItems] = useState([
    { item_name: "", quantity: 1, price: 0 },
  ]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole === "Caterer") {
      setRole(storedRole);
    }
  }, []);

  const handleLogin = () => {
    const expected = credentials[selectedRole];
    if (
      selectedRole === "Caterer" &&
      loginId === expected.id &&
      loginPassword === expected.password
    ) {
      localStorage.setItem("role", selectedRole);
      setRole(selectedRole);
    } else {
      setLoginError("Invalid credentials or unauthorized role");
    }
  };

  const handleCateringChange = (index, e) => {
    const updated = [...cateringItems];
    updated[index][e.target.name] = e.target.value;
    setCateringItems(updated);
  };

  const handleAddCateringItem = () => {
    setCateringItems([
      ...cateringItems,
      { item_name: "", quantity: 1, price: 0 },
    ]);
  };

  const handleSubmitCatering = async () => {
    const data = { token_number: tokenNumber, items: cateringItems };
    const result = await addCatering(data);
    setMessage(result.message);
  };

  if (role !== "Caterer") {
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
          Add Catering
        </h1>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Token Number
          </label>
          <input
            type="text"
            value={tokenNumber}
            onChange={(e) => setTokenNumber(e.target.value)}
            className="p-4 w-full rounded-lg border-2 border-gray-300"
          />
        </div>

        <h2 className="text-2xl font-semibold text-center text-indigo-600 mb-6">
          Catering Items
        </h2>

        {cateringItems.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4"
          >
            <input
              type="text"
              name="item_name"
              value={item.item_name}
              placeholder="Item Name"
              onChange={(e) => handleCateringChange(index, e)}
              className="p-4 rounded-lg border-2 border-gray-300"
            />
            <input
              type="number"
              name="quantity"
              value={item.quantity}
              placeholder="Quantity"
              onChange={(e) => handleCateringChange(index, e)}
              className="p-4 rounded-lg border-2 border-gray-300"
            />
            <input
              type="number"
              name="price"
              value={item.price}
              placeholder="Price"
              onChange={(e) => handleCateringChange(index, e)}
              className="p-4 rounded-lg border-2 border-gray-300"
            />
          </div>
        ))}

        <div className="flex justify-between mb-6">
          <button
            onClick={handleAddCateringItem}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Add Another Item
          </button>
          <button
            onClick={handleSubmitCatering}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Submit Catering
          </button>
        </div>

        {message && <p className="text-center text-red-500">{message}</p>}
      </div>

      <div className="mt-12 w-1/2 mx-auto">
        <h2 className="text-2xl font-semibold text-center text-indigo-600 mb-6">
          Menu Pages
        </h2>

        <Carousel
          showThumbs={false}
          infiniteLoop
          autoPlay
          interval={3000}
          transitionTime={500}
          className="rounded-lg shadow-lg"
        >
          <div>
            <Image
              src="/menuimg1.jpg"
              alt="Menu Page 1"
              width={500}
              height={300}
            />
            <p className="legend">Menu Page 1</p>
          </div>
          <div>
            <Image
              src="/menuimg2.jpg"
              alt="Menu Page 2"
              width={500}
              height={300}
            />
            <p className="legend">Menu Page 2</p>
          </div>
        </Carousel>
      </div>
    </div>
  );
}
