import React from 'react'
const ProductCard = ({ item }) => (
  <div className="card w-full bg-base-100 shadow-xl">
    <figure>
      <img src={item.image} alt={item.name} className="h-48 w-full object-cover" />
    </figure>
    <div className="card-body">
      <h2 className="card-title">{item.name}</h2>
      <p>{item.description}</p>
    </div>
  </div>
);

export default ProductCard;
