import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

const ProductForm = ({ onClose, addLog }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [sweetness, setSweetness] = useState("Normal");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "products"), {
        name,
        price: Number(price),
        quantity: Number(quantity),
        sweetness,
      });
      alert("Product added!");
      addLog("เพิ่ม", name);  // เพิ่ม log เมื่อเพิ่มสินค้า
      setName("");
      setPrice(0);
      setQuantity(1);
      setSweetness("Normal");
      onClose();
    } catch (err) {
      console.error("Error adding product: ", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg space-y-4 w-96 max-w-md">
        <h2 className="text-xl font-semibold text-gray-700">เพิ่มสินค้า</h2>
        <label className="block">
          <span className="text-gray-700">ชื่อ:</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">ราคา:</span>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">จำนวน:</span>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">ความหวาน:</span>
          <select
            value={sweetness}
            onChange={(e) => setSweetness(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="Less">น้อย</option>
            <option value="Normal">ปกติ</option>
            <option value="More">มาก</option>
          </select>
        </label>
        <div className="flex justify-end space-x-2">
          <button type="button" onClick={onClose} className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600">
            ยกเลิก
          </button>
          <button type="submit" className="bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600">
            เพิ่มสินค้า
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
