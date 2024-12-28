// server.js
const express = require("express");
const cors = require("cors"); // เพิ่ม CORS
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const app = express();
const port = 5000;

// เปิดใช้งาน CORS
app.use(cors());

// MongoDB URI
const uri = "mongodb+srv://reactapp:PRIhSOeKL9joJ8CQ@moondustcafe.trjdyky.mongodb.net/?retryWrites=true&w=majority&appName=MoondustCafe";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Middleware
app.use(express.json());

// เชื่อมต่อ MongoDB
let menuCollection;
client.connect().then(() => {
  menuCollection = client.db("MoondustCafe").collection("menu");
  console.log("Connected to MongoDB Atlas");
}).catch((err) => {
  console.error("Error connecting to MongoDB:", err);
});

// API: เพิ่มสินค้าใหม่
app.post("/api/menu", async (req, res) => {
  try {
    const menuItem = req.body;
    const result = await menuCollection.insertOne(menuItem);
    res.status(201).json({ message: "Menu item added successfully", id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: "Failed to add menu item" });
  }
});

// API: ดึงข้อมูลสินค้า
app.get("/api/menu", async (req, res) => {
  try {
    const menu = await menuCollection.find().toArray();
    res.status(200).json(menu);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch menu" });
  }
});

// API: แก้ไขสินค้า
app.put("/api/menu/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedMenu = req.body;
    const result = await menuCollection.updateOne(
      { _id: new require("mongodb").ObjectId(id) },
      { $set: updatedMenu }
    );
    if (result.modifiedCount > 0) {
      res.status(200).json({ message: "Menu item updated successfully" });
    } else {
      res.status(404).json({ error: "Menu item not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update menu item" });
  }
});

// API: ลบสินค้า
app.delete("/api/menu/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await menuCollection.deleteOne({ _id: new require("mongodb").ObjectId(id) });
    if (result.deletedCount > 0) {
      res.status(200).json({ message: "Menu item deleted successfully" });
    } else {
      res.status(404).json({ error: "Menu item not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete menu item" });
  }
});

// เริ่มเซิร์ฟเวอร์
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
