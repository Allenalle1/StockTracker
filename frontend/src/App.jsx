// frontend/src/App.jsx
import { useState } from "react";
import Login from "./components/Login";
import StockCard from "./components/StockCard";
import StockGraph from "./components/StockGraph";
import AddStock from "./components/AddStock";
import MenuList from "./components/MenuList";

// Utility function to format large numbers (e.g., Market Cap)
const formatNumber = (num) => {
  if (num === null || num === undefined) return "N/A";
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(num);
};

function App() {
  const [user, setUser] = useState(null);
  const [tickers, setTickers] = useState(["AAPL", "MSFT", "TSLA"]);

  if (!user) {
    return <Login onLogin={(email) => setUser({ email })} />;
  }

  const handleAddTicker = (ticker) => {
    if (!tickers.includes(ticker)) {
      setTickers([...tickers, ticker]);
    }
  };

  const handleRemoveTicker = (ticker) => {
    setTickers(tickers.filter((t) => t !== ticker));
  };

  const handleLogout = () => setUser(null);
  const handleAbout = () =>
    alert("📊 Stock Tracker by Alexander Pålsson\nVersion 1.0");

  return (
    <div className="bg-gray-900 min-h-screen w-screen p-6 text-white">
      {/* Fixed top bar */}
      <div className="fixed top-4 left-0 w-full z-50 bg-gray-900 shadow-lg">
        <div className="relative flex items-center justify-center px-6 py-4">
          <h1 className="text-3xl font-bold text-center w-full">
            📊 Stock Tracker - By Alexander Pålsson
          </h1>
          <div className="absolute right-0 top-1/2 -translate-y-1/2">
            <MenuList onLogout={handleLogout} onAbout={handleAbout} />
          </div>
        </div>
      </div>

      {/* Add padding-top to prevent content being hidden behind the fixed bar */}
      <div className="pt-28">
        <p className="text-center mb-6">Welcome, {user.email} 👋</p>
        <AddStock onAdd={handleAddTicker} />

        {/* Full-width grid */}
        <div className="grid grid-cols-12 gap-6 w-full mx-auto">
          {/* Sidebar: stock cards */}
          <div className="col-span-4 flex flex-col gap-6">
            {tickers.map((ticker) => (
              <StockCard
                key={ticker}
                ticker={ticker}
                onRemove={handleRemoveTicker}
                formatNumber={formatNumber}
              />
            ))}
          </div>

          {/* Main: graphs */}
          <div className="col-span-8 flex flex-col gap-6">
            {tickers.map((ticker) => (
              <StockGraph key={ticker} ticker={ticker} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
git push