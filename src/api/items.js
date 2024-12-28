const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// MongoDB Connection URI
const uri =
  "mongodb+srv://reactapp:PRIhSOeKL9joJ8CQ@moondustcafe.trjdyky.mongodb.net/?retryWrites=true&w=majority";
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
    const db = client.db("MoondustCafe");
    console.log("Connected to MongoDB!");
    return db;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

export default async function handler(req, res) {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("items");

    switch (req.method) {
      case "GET": {
        const items = await collection.find({}).toArray();
        res.status(200).json(items);
        break;
      }

      case "POST": {
        const newItem = req.body;
        const result = await collection.insertOne(newItem);
        res.status(201).json(result);
        break;
      }

      case "DELETE": {
        const id = req.query.id;
        const result = await collection.deleteOne({ _id: new ObjectId(id) });
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
