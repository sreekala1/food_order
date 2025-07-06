import React, { useState } from "react";

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  // Validation
  const validate = () => {
    if (!name.trim() || name.length < 3) {
      setError("Product name must be at least 3 characters.");
      return false;
    }
    if (isNaN(price) || price <= 0) {
      setError("Price must be a positive number.");
      return false;
    }
    return true;
  }
};
