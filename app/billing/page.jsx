"use client";
import { checkout, getBillDetails, togglePaidStatus } from "@/lib/api";
import { useState } from "react";

const BillingPage = () => {
  const [tokenNumber, setTokenNumber] = useState("");
  const [billDetails, setBillDetails] = useState(null);
  const [message, setMessage] = useState("");

  // Fetch bill details based on the token number
  const handleFetchBill = async () => {
    const result = await getBillDetails(tokenNumber);
    if (result.billing) {
      setBillDetails(result.billing);
    } else {
      setMessage(result.message);
    }
  };

  // Toggle the paid status and call the checkout route
  const handleTogglePaidStatus = async (isPaid) => {
    const result = await togglePaidStatus({
      token_number: tokenNumber,
      isPaid,
    });
    setMessage(result.message);

    // Get the current date in ISO format (YYYY-MM-DD)
    const currentDate = new Date().toISOString().split("T")[0];

    // Call the checkout route after marking as paid
    const checkoutMessage = await checkout({
      token_number: tokenNumber,
      check_out_date: currentDate, // Pass current date
    });

    setMessage(checkoutMessage.message); // Set message from checkout response
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-black">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">Billing</h1>
        
        {/* Token Number Input */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="tokenNumber">
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

        {/* Fetch Bill Button */}
        <button
          onClick={handleFetchBill}
          className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none"
        >
          Fetch Bill
        </button>

        {/* Bill Details */}
        {billDetails && (
          <div className="mt-6 p-6 bg-gray-50 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Bill Details</h2>
            <p className="text-lg text-gray-700">Total Amount: <span className="font-bold">₹{billDetails.total_amount}</span></p>
            <p className="text-lg text-gray-700">Feedback: {billDetails.feedback || "N/A"}</p>
            <p className="text-lg text-gray-700">Status: <span className={`font-bold ${billDetails.isPaid ? "text-green-600" : "text-red-600"}`}>{billDetails.isPaid ? "Paid" : "Unpaid"}</span></p>

            {/* Toggle Paid/Unpaid Status Button */}
            <button
              onClick={() => handleTogglePaidStatus(!billDetails.isPaid)}
              className={`mt-4 w-full px-6 py-3 rounded-lg text-white ${billDetails.isPaid ? "bg-red-600 hover:bg-red-700 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
              disabled={billDetails.isPaid}
            >
              Mark as {billDetails.isPaid ? "Unpaid" : "Paid"}
            </button>
          </div>
        )}

        {/* Message */}
        {message && <p className="text-center text-red-500 mt-4">{message}</p>}
      </div>
    </div>
  );
};

export default BillingPage;
