// backend/server.js
import express from "express";
import cors from "cors";
import yahooFinance from "yahoo-finance2";

const app = express();
app.use(cors());

app.get("/api/stock/:ticker", async (req, res) => {
  const { ticker } = req.params;

  try {
    const today = new Date();
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(today.getDate() - 10);

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

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
