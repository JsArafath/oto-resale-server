const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "https://oto-resale-server-main.vercel.app"],
    credentials: true,
  })
);

app.use(express.json());

const uri = process.env.DB_URI;

let client;
let db;

async function connectDB() {
  if (!uri) throw new Error("DB_URI is missing");

  if (!db) {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db("otoDeals");
    console.log("MongoDB connected");
  }

  return db;
}

app.get("/", (req, res) => {
  res.send("Oto Resale Server is running");
});

app.get("/test", (req, res) => {
  res.send("server ok");
});

app.get("/categories", async (req, res) => {
  try {
    const database = await connectDB();
    const result = await database.collection("categories").find({}).toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to load categories", error: error.message });
  }
});

app.get("/allcategories", async (req, res) => {
  try {
    const database = await connectDB();
    const result = await database.collection("categories").find({}).toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to load all categories", error: error.message });
  }
});

app.get("/products", async (req, res) => {
  try {
    const database = await connectDB();
    const result = await database.collection("products").find({}).toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to load products", error: error.message });
  }
});

app.get("/products/category/:categoryId", async (req, res) => {
  try {
    const database = await connectDB();
    const categoryId = req.params.categoryId;

    const result = await database
      .collection("products")
      .find({ category_id: categoryId })
      .toArray();

    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: "Failed to load category products",
      error: error.message,
    });
  }
});

app.get("/advertised", async (req, res) => {
  try {
    const database = await connectDB();
    const result = await database
      .collection("products")
      .find({ advertised: true })
      .toArray();

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to load advertised products", error: error.message });
  }
});

app.get("/users/admin/:email", async (req, res) => {
  try {
    const database = await connectDB();
    const email = req.params.email;

    const user = await database.collection("users").findOne({ email });

    res.json({
      isAdmin: user?.role === "admin",
    });
  } catch (error) {
    res.status(500).json({ message: "Admin check failed", error: error.message });
  }
});

module.exports = app;