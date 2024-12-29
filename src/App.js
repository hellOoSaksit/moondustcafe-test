import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    quantity: "",
    sweetness: "normal",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get("https://moondustcafe-test.vercel.app/api/products");
    setProducts(res.data);
  };

  const addProduct = async (e) => {
    e.preventDefault();
    await axios.post("https://moondustcafe-test.vercel.app/api/products", newProduct);
    setNewProduct({ name: "", price: "", quantity: "", sweetness: "normal" });
    fetchProducts();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  return (
    <div>
      <h1>Moondust Cafe</h1>
      <form onSubmit={addProduct}>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={newProduct.price}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={newProduct.quantity}
          onChange={handleChange}
          required
        />
        <select
          name="sweetness"
          value={newProduct.sweetness}
          onChange={handleChange}
        >
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
        </select>
        <button type="submit">Add Product</button>
      </form>
      <h2>Product List</h2>
      <ul>
        {products.map((product) => (
          <li key={product._id}>
            {product.name} - ${product.price} - Qty: {product.quantity} - Sweetness: {product.sweetness}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
