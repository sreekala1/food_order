import React from "react";
import { useParams } from "react-router-dom";

import products from "../data/products"; // Assuming products is an array of product objects
const ProductDetailPage = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id == id);
console.log(products);
  console.log(product); // Check if product is found
  if (!product) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-xl">
      <div className="bg-base-100 shadow-xl rounded-lg dark:bg-gray-800 dark:text-white">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover rounded-t-lg"
        />
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="mb-4">{product.description}</p>
          <div className="flex justify-between items-center mb-4">
            <span className="text-2xl font-semibold">₹{product.price}</span>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full dark:bg-blue-700 dark:hover:bg-blue-900 transition">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;