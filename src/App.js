import React, { useState, useEffect } from "react";
import ProductForm from "./components/ProductForm";
import ProductList from "./components/ProductList";
import { db } from "./firebase";
import { collection, setDoc, doc, onSnapshot, getDoc } from "firebase/firestore";

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [logs, setLogs] = useState([]);
  const [previousProduct, setPreviousProduct] = useState(null);

  // เพิ่ม state สำหรับการค้นหาข้อมูล
  const [searchText, setSearchText] = useState("");
  const [searchDate, setSearchDate] = useState("");

  // ฟังก์ชันเพิ่ม log ไปยัง Firestore โดยเก็บ log ใน document เดียวกันสำหรับวันเดียวกัน
  const addLog = async (action, productName) => {
    const currentDate = new Date();
    const logDate = currentDate.toLocaleDateString('th-TH').replace(/\//g, '-');
    const timestamp = currentDate;

    const newLog = {
      action,
      productName,
      logDate,
      timestamp,
    };

    if (!previousProduct || previousProduct.productName !== productName) {
      try {
        const logRef = doc(db, "logs", logDate);
        const docSnapshot = await getDoc(logRef);
        
        const existingLogs = docSnapshot.exists() ? docSnapshot.data().menu : [];
        const updatedLogs = [...existingLogs, newLog];

        await setDoc(logRef, { menu: updatedLogs }, { merge: true });

        console.log('Log added:', newLog);
      } catch (error) {
        console.error("Error adding log: ", error);
      }
    }
  };

  // ฟังก์ชันดึงข้อมูล log จาก Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "logs"),
      (querySnapshot) => {
        const logList = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const logsWithFormattedTimestamp = (data.menu || []).map(log => {
            const formattedTimestamp = log.timestamp instanceof Object
              ? log.timestamp?.toDate()?.toLocaleString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })
              : log.timestamp;
            
            return {
              ...log,
              timestamp: formattedTimestamp
            };
          });

          // จัดเรียง log ตาม timestamp จากใหม่ไปเก่า
          logsWithFormattedTimestamp.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          logList.push({ ...data, menu: logsWithFormattedTimestamp });
        });

        console.log("Logs fetched: ", logList);
        setLogs(logList);
      },
      (err) => {
        console.log("Error getting logs: ", err);
      }
    );

    return () => unsubscribe();
  }, []);

  // ฟังก์ชันกรอง log ตามข้อความและวันที่
  const filterLogs = (logs) => {
    return logs.filter((log) => {
      const dateMatch = searchDate
        ? log.menu.some(menuLog => menuLog.timestamp.includes(searchDate))
        : true;

      const textMatch = searchText
        ? log.menu.some(menuLog => menuLog.productName.toLowerCase().includes(searchText.toLowerCase()))
        : true;

      return dateMatch && textMatch;
    });
  };

  // ฟังก์ชันเปลี่ยนแปลงข้อความการค้นหา
  const handleSearchTextChange = (e) => setSearchText(e.target.value);
  const handleSearchDateChange = (e) => setSearchDate(e.target.value);

  return (
    <div className="flex justify-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-100">
      <div className="flex flex-col items-center bg-white p-8 rounded-lg shadow-xl max-w-3xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">เมนูร้าน Moondust Cafe</h1>
        <div className="flex justify-center mb-4">
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600"
          >
            เพิ่มสินค้า
          </button>
        </div>
        {isFormOpen && <ProductForm onClose={() => setIsFormOpen(false)} addLog={addLog} />}
        <ProductList addLog={addLog} />
      </div>

      {/* แสดง Log ที่กรองแล้ว */}
      <div className="absolute right-0 top-0 mt-8 mr-8 w-1/4 bg-white p-4 rounded-lg shadow-xl h-96 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-2">Log การแก้ไข</h2>
        <div className="space-y-4">
          {filterLogs(logs).length > 0 ? (
            filterLogs(logs).map((log, index) => (
              <div key={index}>
                {log.menu.filter(menuLog => menuLog.action === 'เพิ่ม').map((menuLog, idx) => (
                  <div key={idx} className="bg-green-200 p-4 rounded-md mb-2">
                    <span>
                      <strong>{menuLog.timestamp}</strong> - 
                      <span className="font-semibold">{menuLog.action}</span> {menuLog.productName}
                    </span>
                  </div>
                ))}
                {log.menu.filter(menuLog => menuLog.action === 'แก้ไข').map((menuLog, idx) => (
                  <div key={idx} className="bg-blue-200 p-4 rounded-md mb-2">
                    <span>
                      <strong>{menuLog.timestamp}</strong> - 
                      <span className="font-semibold">{menuLog.action}</span> {menuLog.productName}
                    </span>
                  </div>
                ))}
                {log.menu.filter(menuLog => menuLog.action === 'ลบ').map((menuLog, idx) => (
                  <div key={idx} className="bg-red-200 p-4 rounded-md mb-2">
                    <span>
                      <strong>{menuLog.timestamp}</strong> - 
                      <span className="font-semibold">{menuLog.action}</span> {menuLog.productName}
                    </span>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div>ยังไม่มีการบันทึก log</div>
          )}
        </div>
      </div>

      {/* ฟอร์มค้นหาแยกออกมาอยู่ข้างใต้ */}
      <div className="absolute right-0 top-0 mt-8 mr-8 w-1/4 bg-white p-4 rounded-lg shadow-xl">
        <h2 className="text-xl font-semibold mb-2">ค้นหาข้อมูล Log</h2>
        <div className="flex space-x-4 mb-4">
          <input
            type="text"
            placeholder="ค้นหาข้อความ (เช่น ขนมหวาน)"
            value={searchText}
            onChange={handleSearchTextChange}
            className="border p-2 rounded w-full"
          />
          <input
            type="date"
            value={searchDate}
            onChange={handleSearchDateChange}
            className="border p-2 rounded w-full"
          />
        </div>
      </div>
    </div>
  );
}

export default App;
