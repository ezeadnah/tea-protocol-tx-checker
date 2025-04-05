import React, { useState } from "react";
import { ethers } from "ethers";
import WalletProvider from "./walletConnect";

export default function App() {
  const [address, setAddress] = useState("");
  const [txCount, setTxCount] = useState(null);
  const [error, setError] = useState("");

  const checkTransactions = async () => {
    try {
      setError("");
      setTxCount(null);
      if (!ethers.utils.isAddress(address)) {
        setError("Invalid wallet address.");
        return;
      }

      const provider = new ethers.providers.JsonRpcProvider("https://tea-sepolia.g.alchemy.com/public");

      const count = await provider.getTransactionCount(address);
      setTxCount(count);
    } catch (err) {
      setError("Failed to fetch transaction count.");
    }
  };

  return (
    <WalletProvider setAddress={setAddress}>
      <div className="max-w-md mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Tea Protocol Tx Checker</h1>
        <input
          type="text"
          placeholder="Enter wallet address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded mb-2"
        />
        <button
          onClick={checkTransactions}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Check Transactions
        </button>
        {txCount !== null && (
          <p className="mt-4 text-green-600">Total transactions: {txCount}</p>
        )}
        {error && <p className="mt-4 text-red-600">{error}</p>}
      </div>
    </WalletProvider>
  );
}