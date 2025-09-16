import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function StockGraph({ ticker }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStock() {
      try {
        const res = await fetch(`http://localhost:5000/api/stock/${ticker}`);
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchStock();
  }, [ticker]);

  if (loading) return <div className="text-gray-400">Loading graph for {ticker}…</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  // Find min and max close price in the last 30 days
  const prices = data?.prices ?? [];
  const closes = prices.map(p => p.close);
  const minClose = Math.min(...closes);
  const maxClose = Math.max(...closes);

  let yMin = minClose * 0.98;
  let yMax = maxClose * 1.02;

  // Round to closest int if above 10
  if (yMin > 10) yMin = Math.round(yMin);
  if (yMax > 10) yMax = Math.round(yMax);

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-md w-full max-w-4xl">
      <h3 className="text-lg font-bold mb-4">{ticker} – {data?.info?.name || ticker}</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={prices}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis
              dataKey="date"
              stroke="#ccc"
              tickFormatter={(str) => {
                const d = new Date(str);
                return `${d.getMonth() + 1}/${d.getDate()}`; // MM/DD
              }}
            />
            <YAxis
              stroke="#ccc"
              domain={[yMin, yMax]}
            />
            <Tooltip
              contentStyle={{ backgroundColor: "#222", border: "none" }}
              labelFormatter={(str) =>
                new Date(str).toLocaleDateString("sv-SE")
              }
            />
            <Line
              type="monotone"
              dataKey="close"
              stroke="#00ccff"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
