import { useState } from "react";

function AddStock({ onAdd }) {
  const [newTicker, setNewTicker] = useState("");
  const [error, setError] = useState("");

  const handleAdd = async () => {
    const ticker = newTicker.trim().toUpperCase();
    if (!ticker) return;

    // Validate ticker by checking backend
    try {
      const res = await fetch(`http://localhost:5000/api/stock/${ticker}`);
      if (!res.ok) {
        setError("Ticker not found.");
        return;
      }
      setError("");
      onAdd(ticker);
      setNewTicker("");
    } catch {
      setError("Network error.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  };

  return (
    <div className="flex flex-col items-center mb-8">
      <div className="flex">
        <input
          type="text"
          value={newTicker}
          onChange={(e) => setNewTicker(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Add stock ticker (e.g. NVDA)"
          className="px-4 py-2 w-64 rounded-l-md text-white bg-gray-800 focus:outline-none"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r-md font-bold"
        >
          Add
        </button>
      </div>
      {error && <div className="text-red-400 mt-2">{error}</div>}
    </div>
  );
}

export default AddStock;
