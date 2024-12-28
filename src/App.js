import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [menu, setMenu] = useState([]);
  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    quantity: "",
    sweetness: "ปกติ",
  });
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await fetch("/api/menu");
      const data = await response.json();
      setMenu(data);
    } catch (error) {
      console.error("Failed to fetch menu:", error);
    }
  };

  const addMenuItem = async () => {
    try {
      const response = await fetch("/api/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
      if (response.ok) {
        fetchMenu();
        setNewItem({ name: "", price: "", quantity: "", sweetness: "ปกติ" });
      }
    } catch (error) {
      console.error("Failed to add menu item:", error);
    }
  };

  const updateMenuItem = async () => {
    try {
      const response = await fetch(`/api/menu/${editingItem._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingItem),
      });
      if (response.ok) {
        fetchMenu();
        setEditingItem(null);
      }
    } catch (error) {
      console.error("Failed to update menu item:", error);
    }
  };

  const deleteMenuItem = async (id) => {
    try {
      const response = await fetch(`/api/menu/${id}`, {
        method: "DELETE",
      });
      if (response.ok) fetchMenu();
    } catch (error) {
      console.error("Failed to delete menu item:", error);
    }
  };

  return (
    <div className="app-container">
      <h1>Moondust Cafe Menu</h1>
      <div className="menu-form">
        <input
          type="text"
          placeholder="ชื่อสินค้า"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="ราคา"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
        />
        <input
          type="number"
          placeholder="จำนวน"
          value={newItem.quantity}
          onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
        />
        <select
          value={newItem.sweetness}
          onChange={(e) => setNewItem({ ...newItem, sweetness: e.target.value })}
        >
          <option value="หวานน้อย">หวานน้อย</option>
          <option value="ปกติ">ปกติ</option>
          <option value="หวานมาก">หวานมาก</option>
        </select>
        <button onClick={addMenuItem}>เพิ่มสินค้า</button>
      </div>

      <ul>
        {menu.map((item) => (
          <li key={item._id}>
            {editingItem?._id === item._id ? (
              <>
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                />
                <input
                  type="number"
                  value={editingItem.price}
                  onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })}
                />
                <input
                  type="number"
                  value={editingItem.quantity}
                  onChange={(e) => setEditingItem({ ...editingItem, quantity: e.target.value })}
                />
                <select
                  value={editingItem.sweetness}
                  onChange={(e) => setEditingItem({ ...editingItem, sweetness: e.target.value })}
                >
                  <option value="หวานน้อย">หวานน้อย</option>
                  <option value="ปกติ">ปกติ</option>
                  <option value="หวานมาก">หวานมาก</option>
                </select>
                <button onClick={updateMenuItem}>บันทึก</button>
                <button onClick={() => setEditingItem(null)}>ยกเลิก</button>
              </>
            ) : (
              <>
                {item.name} - {item.price} บาท - {item.quantity} ชิ้น - {item.sweetness}
                <button onClick={() => setEditingItem(item)}>แก้ไข</button>
                <button onClick={() => deleteMenuItem(item._id)}>ลบ</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
