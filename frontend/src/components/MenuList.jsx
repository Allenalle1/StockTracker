import React from "react";

function MenuList({ onLogout, onAbout }) {
  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-4 w-60">
      <ul className="flex flex-col gap-2">
        <li>
          <button
            className="w-full text-left px-4 py-2 rounded hover:bg-gray-700"
            onClick={onAbout}
          >
            ℹ️ About
          </button>
        </li>
        <li>
          <button
            className="w-full text-left px-4 py-2 rounded hover:bg-gray-700 text-red-400"
            onClick={onLogout}
          >
            🚪 Logout
          </button>
        </li>
      </ul>
    </div>
  );
}

export default MenuList;