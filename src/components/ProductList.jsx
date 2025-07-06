// components/ProductList.jsx
import React from 'react';

const ProductList = ({ products, addToCart }) => (
  <div className="grid grid-cols-2 gap-4 p-4">
    {products.map(product => (
      <div key={product.id} className="p-4 border rounded shadow bg-white dark:bg-gray-800">
        <h2 className="text-lg font-bold">{product.name}</h2>
        <p>₹{product.price}</p>
        <button 
          className="mt-2 bg-blue-600 text-white px-3 py-1 rounded"
          onClick={() => addToCart(product)}
        >
          Add to Cart
        </button>
      </div>
    ))}
  </div>
);

export default ProductList;
