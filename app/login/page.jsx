"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const credentials = {
  Admin: { id: "admin123", password: "adminpass" },
  Receptionist: { id: "reception123", password: "receptionpass" },
  Caterer: { id: "caterer123", password: "catererpass" },
};

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState("Receptionist");
  const [loginId, setLoginId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    const expected = credentials[selectedRole];
    if (loginId === expected.id && loginPassword === expected.password) {
      localStorage.setItem("role", selectedRole);
      router.push(`/${selectedRole.toLowerCase()}-page`); 
      
    } else {
      setLoginError("Invalid credentials or unauthorized role");
    }
  };

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
