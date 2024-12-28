const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const uri = "mongodb+srv://reactapp:PRIhSOeKL9joJ8CQ@moondustcafe.trjdyky.mongodb.net/?retryWrites=true&w=majority&appName=MoondustCafe";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// เชื่อมต่อ MongoDB
let menuCollection;
client.connect().then(() => {
  menuCollection = client.db("MoondustCafe").collection("menu");
  console.log("Connected to MongoDB Atlas");
}).catch((err) => {
  console.error("Error connecting to MongoDB:", err);
});

export default async function handler(req, res) {
  const { method, query } = req;

  if (method === "GET") {
    try {
      const menu = await menuCollection.find().toArray();
      return res.status(200).json(menu);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch menu" });
    }
  }

  if (method === "POST") {
    try {
      const menuItem = req.body;
      const result = await menuCollection.insertOne(menuItem);
      return res.status(201).json({ message: "Menu item added successfully", id: result.insertedId });
    } catch (error) {
      return res.status(500).json({ error: "Failed to add menu item" });
    }
  }

  if (method === "PUT") {
    try {
      const { id } = query;
      const updatedMenu = req.body;
      const result = await menuCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedMenu }
      );
      if (result.modifiedCount > 0) {
        return res.status(200).json({ message: "Menu item updated successfully" });
      } else {
        return res.status(404).json({ error: "Menu item not found" });
      }
    } catch (error) {
      return res.status(500).json({ error: "Failed to update menu item" });
    }
  }

  if (method === "DELETE") {
    try {
      const { id } = query;
      const result = await menuCollection.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount > 0) {
        return res.status(200).json({ message: "Menu item deleted successfully" });
      } else {
        return res.status(404).json({ error: "Menu item not found" });
      }
    } catch (error) {
      return res.status(500).json({ error: "Failed to delete menu item" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
