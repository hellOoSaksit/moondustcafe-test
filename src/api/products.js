const mongoose = require("mongoose");

const uri = process.env.MONGO_URI;

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  sweetness: { type: String, enum: ["low", "normal", "high"], required: true },
});

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = async (req, res) => {
  try {
    if (req.method === "GET") {
      const products = await Product.find();
      res.status(200).json(products);
    } else if (req.method === "POST") {
      const newProduct = new Product(req.body);
      await newProduct.save();
      res.status(201).json(newProduct);
    } else {
      res.status(405).json({ message: "Method not allowed" }); // รองรับเฉพาะ GET และ POST
    }
  } catch (error) {
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
