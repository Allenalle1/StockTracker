// backend/server.js
import express from "express";
import cors from "cors";
import yahooFinance from "yahoo-finance2";
import { connectDB } from "./db.js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/stock/:ticker", async (req, res) => {
  const { ticker } = req.params;

  try {
    const today = new Date();
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(today.getDate() - 30);

    // Historical chart
    const history = await yahooFinance.chart(ticker, {
      period1: tenDaysAgo,
      period2: today,
      interval: "1d",
    });

    // Quote (this has current price, market cap, etc.)
    const quote = await yahooFinance.quote(ticker);

    // Profile (for sector)
    const profile = await yahooFinance.quoteSummary(ticker, {
      modules: ["assetProfile"],
    });

    const data = {
      ticker,
      prices: history.quotes.map((q) => ({
        date: q.date,
        close: q.close,
      })),
      info: {
        name: quote.shortName || ticker,
        currentPrice: quote.regularMarketPrice || null,
        marketCap: quote.marketCap || null,
        peRatio: quote.trailingPE || null,
        sector: profile.assetProfile?.sector || "N/A",
      },
    };

    res.json(data);
  } catch (error) {
    console.error("Backend error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/signup", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }
  try {
    const client = await connectDB();
    const db = client.db("stocktracker");
    const existing = await db.collection("users").findOne({ email });
    if (existing) {
      return res.status(409).json({ error: "User already exists" });
    }
    await db.collection("users").insertOne({ email, password });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/signin", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }
  try {
    const client = await connectDB();
    const db = client.db("stocktracker");
    const user = await db.collection("users").findOne({ email, password });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    res.json({ success: true, email: user.email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/user/add-stock", async (req, res) => {
  const { email, ticker } = req.body;
  if (!email || !ticker) {
    return res.status(400).json({ error: "Email and ticker required" });
  }
  try {
    const client = await connectDB();
    const db = client.db("stocktracker");
    const result = await db.collection("users").updateOne(
      { email },
      { $addToSet: { stocks: ticker } } // $addToSet prevents duplicates
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/user/remove-stock", async (req, res) => {
  const { email, ticker } = req.body;
  if (!email || !ticker) {
    return res.status(400).json({ error: "Email and ticker required" });
  }
  try {
    const client = await connectDB();
    const db = client.db("stocktracker");
    const result = await db.collection("users").updateOne(
      { email },
      { $pull: { stocks: ticker } }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/user/stocks/:email", async (req, res) => {
  const { email } = req.params;
  if (!email) {
    return res.status(400).json({ error: "Email required" });
  }
  try {
    const client = await connectDB();
    const db = client.db("stocktracker");
    const user = await db.collection("users").findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ stocks: user.stocks || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/news/:ticker", async (req, res) => {
  const { ticker } = req.params;
  const apiKey = process.env.MARKETAUX_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Marketaux API key not set" });
  }
  try {
    const response = await axios.get("https://api.marketaux.com/v1/news/all", {
      params: {
        symbols: ticker,
        filter_entities: true,
        language: "en",
        api_token: apiKey,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Marketaux error:", error.message);
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
