import { useState } from "react";
import Login from "./components/Login";
import StockCard from "./components/StockCard";
import StockGraph from "./components/StockGraph";
import AddStock from "./components/AddStock";
import MenuList from "./components/MenuList"; // <-- Add this import

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

  // Add these handlers
  const handleLogout = () => setUser(null);
  const handleAbout = () =>
    alert("Stock Tracker by Alexander Pålsson.\nVersion 1.0");

  return (
    <div className="bg-gray-900 min-h-screen w-screen p-6 text-white">
      {/* Top bar: menu and title side by side */}
      <div className="flex items-center mb-8">
        <div className="flex-1"></div>
        <h1 className="text-3xl font-bold text-center flex-1">
          📊 Stock Tracker - By Alexander Pålsson
        </h1>
        <div className="flex-1 flex justify-end">
          <MenuList onLogout={handleLogout} onAbout={handleAbout} />
        </div>
      </div>

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
  );
}

export default App;
