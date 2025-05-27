// src/components/AdminPage.js
import React, { useState } from 'react';
const initialProducts = [
  { id: 1, name: 'Biriyani', description: 'Spicy and tasty', price: 250 },
  { id: 2, name: 'Phone', description: 'Latest model', price: 599 },
];

const AdminPage = () => {
  const [products, setProducts] = useState(initialProducts);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = () => {
    if (!newProduct.name) {
      alert("Product name is required");
      return;
    }
    const newId = products.length ? products[products.length - 1].id + 1 : 1;
    setProducts([...products, { id: newId, ...newProduct, price: parseFloat(newProduct.price) }]);
    setNewProduct({ name: '', description: '', price: '' });
  };

  const handleDelete = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  return (
     <>   
    <div>
      <h2>Admin Dashboard</h2>
      <div>
        <input name="name" placeholder="Name" value={newProduct.name} onChange={handleChange} />
        <input name="description" placeholder="Description" value={newProduct.description} onChange={handleChange} />
        <input name="price" placeholder="Price" type="number" value={newProduct.price} onChange={handleChange} />
        <button onClick={handleAddProduct}>Add Product</button>
      </div>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            {product.name} - ${product.price}
            <button onClick={() => handleDelete(product.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div> </>
  );
};

export default AdminPage;
