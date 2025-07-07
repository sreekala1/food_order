import React from 'react'
import { Link } from 'react-router-dom';
const ProductCard = ({ item }) => (
  <div className="card w-full bg-base-100 shadow-xl dark:bg-gray-800 dark:text-white">
  <figure>
    <img src={item.image} alt={item.name} className="h-48 w-full object-cover" />
  </figure>
  <div className="card-body">
    <h2 className="card-title">{item.name}</h2>
    <p>{item.description}</p>
    <div className="flex justify-between items-center mt-4">
      <span className="text-lg font-semibold">₹{item.price}</span>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full dark:bg-blue-700 dark:hover:bg-blue-900 transition">
       <Link to={`/productDetail/${item.id}`}>View</Link>  
      </button>
       
    </div>
  </div>
</div>
);

export default ProductCard;
