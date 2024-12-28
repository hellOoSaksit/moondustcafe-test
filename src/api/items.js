// api/items.js
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || "MoondustCafe";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectToDatabase() {
  try {
    console.log("Connecting to MongoDB...");
    await client.connect();
    console.log("Connected to MongoDB!");
    return client.db(dbName);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

export default async function handler(req, res) {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("items");

    res.setHeader("Content-Type", "application/json");

    switch (req.method) {
      case "GET": {
        const items = await collection.find({}).toArray();
        res.status(200).json(items);
        break;
      }

      case "POST": {
        const newItem = req.body;
        if (!newItem.name || typeof newItem.name !== "string" || newItem.quantity <= 0) {
          res.status(400).json({ error: "Invalid item data" });
          return;
        }
        const result = await collection.insertOne(newItem);
        res.status(201).json(result);
        break;
      }

      case "DELETE": {
        const id = req.query.id;
        if (!ObjectId.isValid(id)) {
          res.status(400).json({ error: "Invalid ID format" });
          return;
        }
        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
          res.status(404).json({ error: "Item not found" });
          return;
        }
        res.status(200).json(result);
        break;
      }

      default:
        res.setHeader("Allow", ["GET", "POST", "DELETE"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Error handling request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
