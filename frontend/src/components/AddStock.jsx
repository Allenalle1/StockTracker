import { useState } from "react";

function AddStock({ onAdd }) {
  const [newTicker, setNewTicker] = useState("");

  const handleAdd = () => {
    if (newTicker.trim() !== "") {
      onAdd(newTicker.toUpperCase());
      setNewTicker("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  };

  return (
    <div className="flex justify-center mb-8">
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
  );
}

export default AddStock;
