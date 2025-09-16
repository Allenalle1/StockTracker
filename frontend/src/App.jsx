// frontend/src/App.jsx
import { useState, useEffect } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import StockCard from "./components/StockCard";
import StockGraph from "./components/StockGraph";
import AddStock from "./components/AddStock";
import MenuList from "./components/MenuList";
import StockNews from "./components/StockNews"; // <-- Import the news component

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
  const [tickers, setTickers] = useState([]);
  const [showSignup, setShowSignup] = useState(true);
  const [selectedTicker, setSelectedTicker] = useState(null); // For showing news

  // Fetch user's stocks after login
  useEffect(() => {
    if (user && user.email) {
      fetch(`http://localhost:5000/api/user/stocks/${user.email}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data.stocks)) {
            setTickers(data.stocks);
            if (data.stocks.length > 0) setSelectedTicker(data.stocks[0]);
          } else {
            setTickers([]);
            setSelectedTicker(null);
          }
        })
        .catch(() => {
          setTickers([]);
          setSelectedTicker(null);
        });
    }
  }, [user]);

  // Handle login with backend
  async function handleLogin(email, password) {
    try {
      const res = await fetch("http://localhost:5000/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser({ email: data.email });
      } else {
        alert(data.error || "Login failed");
      }
    } catch (err) {
      alert("Network error");
    }
  }

  // Handle signup with backend
  async function handleSignup(email, password) {
    try {
      const res = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Signup successful! You can now log in.");
        setShowSignup(false);
      } else {
        alert(data.error || "Signup failed");
      }
    } catch (err) {
      alert("Network error");
    }
  }

  // Add ticker and save to backend
  async function handleAddTicker(ticker) {
    if (!tickers.includes(ticker) && user && user.email) {
      // Save to backend
      try {
        const res = await fetch("http://localhost:5000/api/user/add-stock", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email, ticker }),
        });
        const data = await res.json();
        if (res.ok) {
          setTickers([...tickers, ticker]);
          setSelectedTicker(ticker); // Show news for newly added ticker
        } else {
          alert(data.error || "Could not add stock");
        }
      } catch {
        alert("Network error");
      }
    }
  }

  const handleRemoveTicker = (ticker) => {
    setTickers(tickers.filter((t) => t !== ticker));
    // If the removed ticker was selected, select another or null
    if (selectedTicker === ticker) {
      const remaining = tickers.filter((t) => t !== ticker);
      setSelectedTicker(remaining.length > 0 ? remaining[0] : null);
    }
    // Optionally, add a backend route to remove a stock and call it here
  };

  const handleLogout = () => setUser(null);
  const handleAbout = () =>
    alert("📊 Stock Tracker by Alexander Pålsson\nVersion 1.0");

  if (!user) {
    return showSignup ? (
      <Signup
        onSignup={handleSignup}
        onShowLogin={() => setShowSignup(false)}
      />
    ) : (
      <Login
        onLogin={handleLogin}
        onShowSignup={() => setShowSignup(true)}
      />
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen w-screen p-6 text-white">
      {/* Fixed top bar */}
      <div className="fixed top-0 left-0 w-full z-50 bg-gray-900 shadow-lg">
        <div className="relative flex items-center justify-center px-6 py-4">
          <h1 className="text-3xl font-bold text-center w-full">
            📊 Stock Tracker - By Alexander Pålsson
          </h1>
          <div className="absolute right-0 top-[10px]">
            <MenuList onLogout={handleLogout} onAbout={handleAbout} />
          </div>
        </div>
      </div>

      {/* Add padding-top to prevent content being hidden behind the fixed bar */}
      <div className="pt-28">
        <p className="text-center mb-6">Welcome, {user.email} 👋</p>
        <AddStock onAdd={handleAddTicker} />

        {/* 3-column grid: cards | graphs | news */}
        <div className="grid grid-cols-12 gap-6 w-full mx-auto">
          {/* Sidebar: stock cards */}
          <div className="col-span-3 flex flex-col gap-6">
            {tickers.map((ticker) => (
              <StockCard
                key={ticker}
                ticker={ticker}
                onRemove={handleRemoveTicker}
                userEmail={user.email}
                onClick={() => setSelectedTicker(ticker)}
                isSelected={selectedTicker === ticker}
              />
            ))}
          </div>

          {/* Center: all graphs */}
          <div className="col-span-6 flex flex-col gap-6 h-full">
            {tickers.map((ticker) => (
              <div
                key={ticker}
                className={`cursor-pointer transition-all duration-150 w-full h-80 bg-transparent outline-none ${
                  selectedTicker === ticker
                    ? "ring-2 ring-blue-400 ring-offset-2 shadow-lg shadow-blue-400/40 glow-ring"
                    : ""
                }`}
                onClick={() => setSelectedTicker(ticker)}
                style={{ minHeight: "20rem" }}
                tabIndex={0} // Optional: if you want keyboard accessibility
              >
                <StockGraph ticker={ticker} />
              </div>
            ))}
          </div>

          {/* Right: news for selected ticker */}
          <div className="col-span-3">
            {selectedTicker && <StockNews ticker={selectedTicker} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;