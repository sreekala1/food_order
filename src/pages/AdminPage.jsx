import React, { useState } from 'react';
import products from "../data/products";

function App() {
  const [items, setItems] = useState(products);
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

  return (
    <div className="min-h-screen p-6 bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
      <h2 className="text-2xl font-bold mb-6">Product List</h2>

      <ul className="space-y-4">
        {items.map(item => (
          <li key={item.id} className="flex items-center gap-4">
            <input
              type="text"
              value={item.name}
              onChange={(e) => editItem(item.id, 'name', e.target.value)}
              className="p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 w-1/3"
            />
            ₹
            <input
              type="number"
              value={item.price}
              onChange={(e) => editItem(item.id, 'price', e.target.value)}
              className="p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 w-24"
            />
            <button
              onClick={() => deleteItem(item.id)}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <input
          type="text"
          placeholder="New item name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 w-1/3"
        />
        <input
          type="number"
          placeholder="Price"
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
          className="p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 w-24"
        />
        <button
          onClick={addItem}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Item
        </button>
      </div>
    </div>
  );
}

export default App;
