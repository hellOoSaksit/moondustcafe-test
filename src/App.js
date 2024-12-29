import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  // ตั้งค่า state สำหรับเก็บสินค้า
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

  // ฟังก์ชันดึงข้อมูลสินค้า
  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/products");
      const data = res.data;

      // ตรวจสอบว่า data เป็นอาร์เรย์หรือไม่
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        console.error("Invalid data format: Expected an array.");
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]); // ตั้งค่าเป็นอาร์เรย์ว่างหากเกิดข้อผิดพลาด
    }
  };

  // ฟังก์ชันเพิ่มสินค้าใหม่
  const addProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/products", newProduct);
      setNewProduct({ name: "", price: "", quantity: "", sweetness: "normal" });
      fetchProducts(); // ดึงข้อมูลสินค้าใหม่หลังจากเพิ่มสินค้า
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  // ฟังก์ชันจัดการการเปลี่ยนแปลงข้อมูลในฟอร์ม
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  return (
    <div>
      <h1>Moondust Cafe</h1>
      {/* ฟอร์มสำหรับเพิ่มสินค้า */}
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
      {/* แสดงรายการสินค้า */}
      <ul>
        {Array.isArray(products) && products.length > 0 ? (
          products.map((product) => (
            <li key={product._id}>
              {product.name} - ${product.price} - Qty: {product.quantity} - Sweetness: {product.sweetness}
            </li>
          ))
        ) : (
          <p>No products available.</p>
        )}
      </ul>
    </div>
  );
};

export default App;
