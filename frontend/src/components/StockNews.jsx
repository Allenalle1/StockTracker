import { useEffect, useState } from "react";

export default function StockNews({ ticker }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!ticker) return;
    setLoading(true);
    setError(null);
    fetch(`http://localhost:5000/api/news/${ticker}`)
      .then((res) => res.json())
      .then((data) => {
        setNews(data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        setError("Could not fetch news.");
        setLoading(false);
      });
  }, [ticker]);

  if (loading) return <div className="text-gray-400">Loading news…</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!news.length) return <div className="text-gray-400">No news found.</div>;

  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow-md mt-4">
      <h3 className="text-lg font-bold mb-2">Latest News for {ticker}</h3>
      <ul className="space-y-3">
        {news.slice(0, 5).map((item) => (
          <li key={item.uuid} className="border-b border-gray-700 pb-2">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline font-semibold"
            >
              {item.title}
            </a>
            <div className="text-xs text-gray-400">
              {item.source} &middot; {new Date(item.published_at).toLocaleString()}
            </div>
            <div className="text-sm mt-1">{item.description}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}