import { useEffect, useState } from "react";

function StockCard({ ticker, onRemove }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStock() {
      try {
        const res = await fetch(`http://localhost:5000/api/stock/${ticker}`);
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Error fetching stock:", err);
        setError(err.message);
      }
    }
    fetchStock();
  }, [ticker]);

  if (error) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-md p-4 w-full text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-4 flex justify-between items-center w-full">
      <div>
        <h2 className="text-xl font-bold">{data?.info?.name || ticker}</h2>
        {data ? (
          <ul className="text-sm text-gray-300">
            <li>📌 Price: {data.info?.currentPrice ?? "N/A"} USD</li>
            <li>📊 P/E: {data.info?.peRatio ?? "N/A"}</li>
            <li>🏦 Market Cap: {data.info?.marketCap ?? "N/A"}</li>
            <li>🏷️ Sector: {data.info?.sector ?? "N/A"}</li>
          </ul>
        ) : (
          <p className="text-gray-400">Loading...</p>
        )}
      </div>

      {/* ❌ Remove button */}
      <button
        onClick={() => onRemove(ticker)}
        className="ml-4 bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
      >
        ❌
      </button>
    </div>
  );
}

export default StockCard;
