const mongoose = require("mongoose");

const uri = "mongodb+srv://vAdmin:8MEDAFQzCrHxAmp1@moondustcafe.trjdyky.mongodb.net/?retryWrites=true&w=majority&appName=MoondustCafe";

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
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
