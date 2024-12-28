const { MongoClient, ServerApiVersion } = require("mongodb");

// MongoDB URI
const uri =
  "mongodb+srv://reactapp:PRIhSOeKL9joJ8CQ@moondustcafe.trjdyky.mongodb.net/?retryWrites=true&w=majority&appName=MoondustCafe";

// สร้าง MongoClient
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// ฟังก์ชันหลักสำหรับจัดการการเชื่อมต่อ
async function run() {
  try {
    // เชื่อมต่อกับเซิร์ฟเวอร์
    await client.connect();

    // ตรวจสอบการเชื่อมต่อด้วยคำสั่ง ping
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    // ดำเนินการจัดการฐานข้อมูล
    await performDatabaseOperations();
  } catch (err) {
    console.error("Error:", err);
  } finally {
    // ปิดการเชื่อมต่อเมื่อเสร็จสิ้น
    await client.close();
  }
}

// ฟังก์ชันสำหรับจัดการฐานข้อมูล
async function performDatabaseOperations() {
  const db = client.db("MoondustCafe"); // ชื่อฐานข้อมูล
  const collection = db.collection("menu"); // ชื่อคอลเลกชัน

  // 1. เพิ่มข้อมูลใหม่
  const newMenu = { name: "Espresso", price: 90 };
  const insertResult = await collection.insertOne(newMenu);
  console.log("Inserted document ID:", insertResult.insertedId);

  // 2. ดึงข้อมูลทั้งหมด
  const documents = await collection.find().toArray();
  console.log("Fetched documents:", documents);

  // 3. อัปเดตข้อมูล
  const updateResult = await collection.updateOne(
    { name: "Espresso" }, // เงื่อนไข
    { $set: { price: 100 } } // การเปลี่ยนแปลง
  );
  console.log("Updated document count:", updateResult.modifiedCount);

  // 4. ลบข้อมูล
  const deleteResult = await collection.deleteOne({ name: "Espresso" });
  console.log("Deleted document count:", deleteResult.deletedCount);
}

// เรียกใช้งานฟังก์ชันหลัก
run().catch(console.dir);
