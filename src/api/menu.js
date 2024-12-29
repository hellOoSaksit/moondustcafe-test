const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const uri = "mongodb+srv://reactapp:PRIhSOeKL9joJ8CQ@moondustcafe.trjdyky.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export default async function handler(req, res) {
  const { method, query } = req;

  try {
    await client.connect();
    const menuCollection = client.db("MoondustCafe").collection("menu");

    if (method === "GET") {
      const menu = await menuCollection.find().toArray();
      return res.status(200).json(menu);
    }

    if (method === "POST") {
      const menuItem = req.body;
      const result = await menuCollection.insertOne(menuItem);
      return res.status(201).json({ message: "Menu item added successfully", id: result.insertedId });
    }

    if (method === "PUT") {
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
    }

    if (method === "DELETE") {
      const { id } = query;
      const result = await menuCollection.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount > 0) {
        return res.status(200).json({ message: "Menu item deleted successfully" });
      } else {
        return res.status(404).json({ error: "Menu item not found" });
      }
    }

    return res.status(405).json({ error: "Method Not Allowed" });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await client.close();
  }
}
