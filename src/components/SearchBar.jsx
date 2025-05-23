import React from 'react'

const SearchBar = ({ onSearch }) => (
  <input
    type="text"
    placeholder="Search products..."
    onChange={(e) => onSearch(e.target.value)}
    className="border p-2 rounded w-full mb-4"
  />
);
export default SearchBar

