"use client";
import { checkout, getBillDetails, togglePaidStatus } from "@/lib/api";
import { useState, useEffect } from "react";

const credentials = {
  Admin: { id: "admin123", password: "adminpass" },
  Caterer: { id: "caterer123", password: "catererpass" },
  Receptionist: { id: "reception123", password: "receptionpass" },
};

const BillingPage = () => {
  const [role, setRole] = useState(null);
  const [selectedRole, setSelectedRole] = useState("Receptionist");
  const [loginId, setLoginId] = useState("reception123");
  const [loginPassword, setLoginPassword] = useState("receptionpass");
  const [loginError, setLoginError] = useState("");

  const [tokenNumber, setTokenNumber] = useState("");
  const [billDetails, setBillDetails] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole === "Receptionist") {
      setRole(storedRole);
    }
  }, []);

  const handleLogin = () => {
    const expected = credentials[selectedRole];
    if (loginId === expected.id && loginPassword === expected.password) {
      if (selectedRole === "Receptionist") {
        localStorage.setItem("role", "Receptionist");
        setRole("Receptionist");
      } else {
        setLoginError("Only Receptionist can access this page");
      }
    } else {
      setLoginError("Invalid credentials");
    }
  };

  const handleFetchBill = async () => {
    const result = await getBillDetails(tokenNumber);
    if (result.billing) {
      setBillDetails(result.billing);
    } else {
      setMessage(result.message);
    }
  };

  const handleTogglePaidStatus = async (isPaid) => {
    const result = await togglePaidStatus({
      token_number: tokenNumber,
      isPaid,
    });
    setMessage(result.message);

    const currentDate = new Date().toISOString().split("T")[0];
    const checkoutMessage = await checkout({
      token_number: tokenNumber,
      check_out_date: currentDate,
    });
    setMessage(checkoutMessage.message);
  };

  if (role !== "Receptionist") {
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

      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">
          Billing
        </h1>

        <div className="mb-6">
          <label
            className="block text-gray-700 font-semibold mb-2"
            htmlFor="tokenNumber"
          >
            Token Number
          </label>
          <input
            type="text"
            id="tokenNumber"
            placeholder="Enter Token Number"
            value={tokenNumber}
            onChange={(e) => setTokenNumber(e.target.value)}
            className="p-4 w-full rounded-lg border-2 border-gray-300 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <button
          onClick={handleFetchBill}
          className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none"
        >
          Fetch Bill
        </button>

        {billDetails && (
          <div className="mt-6 p-6 bg-gray-50 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Bill Details</h2>
            <p className="text-lg text-gray-700">
              Total Amount:{" "}
              <span className="font-bold">₹{billDetails.total_amount}</span>
            </p>
            <p className="text-lg text-gray-700">
              Feedback: {billDetails.feedback || "N/A"}
            </p>
            <p className="text-lg text-gray-700">
              Status:{" "}
              <span
                className={`font-bold ${
                  billDetails.isPaid ? "text-green-600" : "text-red-600"
                }`}
              >
                {billDetails.isPaid ? "Paid" : "Unpaid"}
              </span>
            </p>

            <button
              onClick={() => handleTogglePaidStatus(!billDetails.isPaid)}
              className={`mt-4 w-full px-6 py-3 rounded-lg text-white ${
                billDetails.isPaid
                  ? "bg-red-600 hover:bg-red-700 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
              disabled={billDetails.isPaid}
            >
              Mark as {billDetails.isPaid ? "Unpaid" : "Paid"}
            </button>
          </div>
        )}

        {message && <p className="text-center text-red-500 mt-4">{message}</p>}
      </div>
    </div>
  );
};

export default BillingPage;
