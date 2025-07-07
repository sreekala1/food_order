import React, { useState } from 'react';
import initialData from from "../data/products.json";


function AdminPanel() {
  const [items, setItems] = useState(initialData);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');

  const addItem = () => {
    if (!newName || !newPrice) return;
    const newItem = {
      id: Date.now(),
      name: newName,
      price: Number(newPrice),
    };
    setItems([...items, newItem]);
    setNewName('');
    setNewPrice('');
  };

  const editItem = (id, field, value) => {
    const updated = items.map(item =>
      item.id === id ? { ...item, [field]: field === 'price' ? Number(value) : value } : item
    );
    setItems(updated);
  };

  const deleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'updated_data.json';
    link.click();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>JSON Array Editor</h1>

      <ul>
        {items.map(item => (
          <li key={item.id} style={{ marginBottom: 10 }}>
            <input
              type="text"
              value={item.name}
              onChange={(e) => editItem(item.id, 'name', e.target.value)}
              style={{ marginRight: 10 }}
            />
            ₹
            <input
              type="number"
              value={item.price}
              onChange={(e) => editItem(item.id, 'price', e.target.value)}
              style={{ margin: '0 10px' }}
            />
            <button onClick={() => deleteItem(item.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: 20 }}>
        <input
          type="text"
          placeholder="New item name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Price"
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
          style={{ margin: '0 10px' }}
        />
        <button onClick={addItem}>Add Item</button>
      </div>

      <div style={{ marginTop: 20 }}>
        <button onClick={downloadJSON}>Download JSON</button>
      </div>
    </div>
  );
}

export default AdminPanel;
