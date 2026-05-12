import { useState, useEffect } from "react";
import "./ProductManager.css";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../../firebase/firebase";

function ProductManager() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [products, setProducts] = useState([]);

  // GET PRODUCTS
  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));

      const productList = [];

      querySnapshot.forEach((docItem) => {
        productList.push({
          id: docItem.id,
          ...docItem.data(),
        });
      });

      setProducts(productList);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "products"), 
      (snapshot) => {
        const productList = [];
        snapshot.forEach((doc) => {
          productList.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setProducts(productList);
      }
    );
    return () => unsubscribe();
  }, []);

  // ADD PRODUCT
  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!name || !price || !description || !image) {
    alert("Please enter all fields");
    return;
    }
    
    try {
      await addDoc(collection(db, "products"), {
        name,
        price,
        description,
      });

      alert("Product added!");

      setName("");
      setPrice("");
      setDescription("");
      setImage("");
      fetchProducts();
    } catch (error) {
      console.log(error);
    }
  };

  // DELETE PRODUCT
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "products", id));

      fetchProducts();
    } catch (error) {
      console.log(error);
    }
  };

  // UPDATE PRODUCT
  const handleUpdate = async (id) => {
    const newName = prompt("Enter new product name");
    const newPrice = prompt("Enter new product price");
    if (!newName) return;

    try {
      const productRef = doc(db, "products", id);

      await updateDoc(productRef, {
        name: newName,
        price: newPrice,
      });

      fetchProducts();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Product Manager</h1>

      <form className="form" onSubmit={handleAddProduct}>
        <input
          type="text"
          placeholder="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <br />
        <br />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <br />
        <br />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        <br />
        <br />

        <input 
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />

        <button type="submit">Add Product</button>
      </form>

      <hr />

      <h2>Product List</h2>
    <div className="product-grid">
      {products.map((product) => (
        <div className="product-card" key={product.id}>
          <h3>{product.name}</h3>

          <img src={product.image} alt={product.name} width="200" />  

          <p>${product.price}</p>

          <p>{product.description}</p>
        <div className="actions">
          <button className="delete-btn" onClick={() => handleDelete(product.id)}>
            Delete
          </button>

          <button className="update-btn" onClick={() => handleUpdate(product.id)}>
            Update
          </button>
        </div>
          <hr />
        </div> 
      ))}
      </div>  
    </div>
  );
}

export default ProductManager;