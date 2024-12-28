import React, { useState, useEffect } from "react";
import axios from "axios";

// ตั้งค่า URL ของ API บน Vercel
const API_BASE_URL = "/api/items"; // Vercel จะจัดการ URL ให้อัตโนมัติ

function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", quantity: 0 });

  const fetchItems = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const addItem = async () => {
    try {
      if (!newItem.name || newItem.quantity <= 0) {
        alert("Please provide valid item details.");
        return;
      }
      await axios.post(API_BASE_URL, newItem);
      setNewItem({ name: "", quantity: 0 });
      fetchItems();
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}?id=${id}`);
      fetchItems();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div>
      <h1>Moondust Cafe Inventory</h1>
      <div>
        <input
          type="text"
          placeholder="Item name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={newItem.quantity}
          onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
        />
        <button onClick={addItem}>Add Item</button>
      </div>
      <ul>
        {items.map((item) => (
          <li key={item._id}>
            <span>
              {item.name} - {item.quantity}
            </span>
            <button onClick={() => deleteItem(item._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
