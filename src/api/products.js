// api/products.js
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Fetch all products from Firestore.
 * @returns {Promise<Array>} An array of products.
 */
export const getProducts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    const products = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Could not fetch products.");
  }
};

/**
 * Update a product in Firestore.
 * @param {string} id - The product ID.
 * @param {Object} updatedData - The updated product data.
 */
export const updateProduct = async (id, updatedData) => {
  try {
    const productRef = doc(db, "products", id);
    await updateDoc(productRef, updatedData);
    console.log("Product updated successfully!");
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error("Could not update product.");
  }
};

/**
 * Delete a product from Firestore.
 * @param {string} id - The product ID.
 */
export const deleteProduct = async (id) => {
  try {
    const productRef = doc(db, "products", id);
    await deleteDoc(productRef);
    console.log("Product deleted successfully!");
  } catch (error) {
    console.error("Error deleting product:", error);
    throw new Error("Could not delete product.");
  }
};
