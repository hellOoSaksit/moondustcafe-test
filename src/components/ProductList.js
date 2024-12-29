import React, { useEffect, useState } from "react";
import { updateProduct, deleteProduct } from "../api/products";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import "./ProductList.css";

const ProductList = ({ addLog }) => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");  // state สำหรับเก็บคำค้นหา
  const [filteredProducts, setFilteredProducts] = useState([]);  // state สำหรับเก็บสินค้าที่กรองแล้ว
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [updatedData, setUpdatedData] = useState({
    name: "",
    price: "",
    quantity: "",
    sweetness: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "products"),
      (querySnapshot) => {
        const productList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productList);
        setFilteredProducts(productList);  // กำหนดค่าเริ่มต้นให้แสดงทุกสินค้า
      },
      (err) => {
        setError("Error fetching products: " + err.message);
      }
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // ฟังก์ชันกรองข้อมูลเมื่อมีการพิมพ์คำค้นหา
    if (searchQuery === "") {
      setFilteredProducts(products);  // ถ้าคำค้นหาว่างให้แสดงทุกสินค้า
    } else {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(lowercasedQuery)  // กรองชื่อสินค้าตามคำค้นหา
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  const handleUpdate = async (id) => {
    setLoading(true);
  
    // ตรวจสอบให้แน่ใจว่าค่าในฟิลด์ต่างๆ ถูกกรอกมาและไม่เป็นค่าว่าง
    if (
      String(updatedData.name).trim() === "" || // ใช้ String() เพื่อแปลงเป็น string
      String(updatedData.price).trim() === "" || // แปลง price เป็น string ก่อนใช้ trim()
      String(updatedData.quantity).trim() === "" || // แปลง quantity เป็น string ก่อนใช้ trim()
      String(updatedData.sweetness).trim() === "" // แปลง sweetness เป็น string ก่อนใช้ trim()
    ) {
      setError("All fields are required!");  // แสดงข้อความถ้ามีฟิลด์ที่ว่าง
      setLoading(false);
      return;  // หยุดการทำงานหากมีฟิลด์ที่ว่าง
    }
  
    try {
      // ถ้าฟิลด์ครบถ้วนจะทำการอัปเดต
      await updateProduct(id, updatedData);
      addLog('แก้ไข', updatedData.name);  // บันทึก log เมื่อมีการอัปเดต
      setEditingId(null);
      setUpdatedData({ name: "", price: "", quantity: "", sweetness: "" });
    } catch (err) {
      setError(err.message);  // แสดงข้อผิดพลาดหากการอัปเดตไม่สำเร็จ
    }
  
    setLoading(false);
  };
    
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const product = products.find((p) => p.id === id);
      await deleteProduct(id);
      addLog('ลบ', product.name);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setUpdatedData({
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      sweetness: product.sweetness,
    });
  };

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-semibold text-center mb-6">รายการสินค้า</h2>
      <div className="overflow-y-auto max-h-80">
        <table className="w-full table-auto border-collapse border border-gray-300 rounded-lg overflow-hidden shadow-md">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="px-6 py-4 border text-left w-1/4">ชื่อ</th>
              <th className="px-6 py-4 border text-left w-1/6">ราคา</th>
              <th className="px-6 py-4 border text-left w-1/6">จำนวน</th>
              <th className="px-6 py-4 border text-left w-1/4">ความหวาน</th>  {/* เพิ่มความกว้างของคอลัมน์นี้ */}
              <th className="px-6 py-4 border text-left w-1/4">การกระทำ</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} className="border-b hover:bg-gray-50 transition-all duration-200">
                <td className="px-6 py-4 border text-center">
                  {editingId === product.id ? (
                    <input
                      type="text"
                      value={updatedData.name}
                      onChange={(e) => setUpdatedData({ ...updatedData, name: e.target.value })}
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    product.name
                  )}
                </td>
                <td className="px-6 py-4 border text-center">
                  {editingId === product.id ? (
                    <input
                      type="number"
                      value={updatedData.price}
                      onChange={(e) => setUpdatedData({ ...updatedData, price: e.target.value })}
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    product.price
                  )}
                </td>
                <td className="px-6 py-4 border text-center">
                  {editingId === product.id ? (
                    <input
                      type="number"
                      value={updatedData.quantity}
                      onChange={(e) => setUpdatedData({ ...updatedData, quantity: e.target.value })}
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    product.quantity
                  )}
                </td>
                <td className="px-6 py-4 border text-center">
                  {editingId === product.id ? (
                    <select
                      value={updatedData.sweetness}
                      onChange={(e) => setUpdatedData({ ...updatedData, sweetness: e.target.value })}
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Less">น้อย</option>
                      <option value="Normal">ปกติ</option>
                      <option value="More">มาก</option>
                    </select>
                  ) : (
                    product.sweetness === "Less" ? "น้อย" : product.sweetness === "Normal" ? "ปกติ" : "มาก"
                  )}
                </td>
                <td className="px-6 py-4 border text-center flex space-x-2 justify-center">
                  {editingId === product.id ? (
                    <button
                      onClick={() => handleUpdate(product.id)}
                      disabled={loading}
                      className={`bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {loading ? "กำลังอัปเดต..." : "อัปเดต"}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(product)}
                      className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
                    >
                      แก้ไข
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(product.id)}
                    disabled={loading}
                    className={`bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {loading ? "กำลังลบ..." : "ลบ"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* ช่องค้นหาด้านล่าง */}
      <div className="mt-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ค้นหาสินค้า..."
          className="w-full p-2 border rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

export default ProductList;
