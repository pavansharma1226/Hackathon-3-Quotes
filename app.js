require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;


// Connect to MongoDB
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a Quote schema
const quoteSchema = new mongoose.Schema({
  author: String,
  quote: String,
});

const Quote = mongoose.model("Quote", quoteSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve the frontend files (index.html and script.js)
app.use(express.static(path.join(__dirname, "public")));

// API endpoints
app.get("/api/quotes", async (req, res) => {
  try {
    const quotes = await Quote.find({});
    res.json({ success: true, quotes });
  } catch (err) {
    res.json({ success: false, message: "Failed to get quotes." });
  }
});

app.post("/api/quotes", async (req, res) => {
  const { author, quote } = req.body;

  if (!author || !quote) {
    res.json({ success: false, message: "Both author and quote are required." });
  } else {
    try {
      const newQuote = new Quote({ author, quote });
      await newQuote.save();
      res.json({ success: true, message: "Quote added successfully." });
    } catch (err) {
      res.json({ success: false, message: "Failed to add the quote." });
    }
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});


// API endpoint to get a single quote by ID
app.get("/api/quotes/:quoteId", async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.quoteId);
    res.json({ success: true, quote });
  } catch (err) {
    res.json({ success: false, message: "Failed to get the quote." });
  }
});

// ... (Other API endpoints)

// Catch-all route to handle all other requests and serve the frontend files
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
