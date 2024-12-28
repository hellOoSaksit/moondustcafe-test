// App.js
import React, { useState, useEffect } from "react";
import axios from "axios";

// ใช้ URL ของ API
const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "/api/items"
    : "http://localhost:3000/api/items";

function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", quantity: 0 });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_BASE_URL);
      console.log("Fetched items:", response.data);
      if (Array.isArray(response.data)) {
        setItems(response.data);
      } else {
        console.error("Response is not an array:", response.data);
        setItems([]);
      }
    } catch (err) {
      console.error("Error fetching items:", err);
      setError("Failed to fetch items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const addItem = async () => {
    try {
      if (!newItem.name.trim() || newItem.quantity <= 0) {
        alert("Please provide valid item details.");
        return;
      }
      await axios.post(API_BASE_URL, newItem);
      setNewItem({ name: "", quantity: 0 });
      fetchItems();
    } catch (err) {
      console.error("Error adding item:", err);
      setError("Failed to add item. Please try again.");
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}?id=${id}`);
      fetchItems();
    } catch (err) {
      console.error("Error deleting item:", err);
      setError("Failed to delete item. Please try again.");
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
        <button onClick={addItem} disabled={!newItem.name || newItem.quantity <= 0}>
          Add Item
        </button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
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
      )}
    </div>
  );
}

export default App;
