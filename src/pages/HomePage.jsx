import { useState } from "react";

import products from "../data/products";
import ProductCard from "../components/ProductCard";

const HomePage = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = ["All", ...new Set(products.map(i => i.category))];

  const filteredItems = products.filter(item =>
    (category === "All" || item.category === category) &&
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="p-6 bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Our Menu</h1>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <input
            type="text"
            placeholder="Search food..."
            onChange={(e) => setSearch(e.target.value)}
            className="input input-bordered w-full sm:w-1/2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
          />

          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`btn ${category === cat ? "btn-primary" : "btn-outline"} dark:btn-outline dark:border-gray-600 dark:text-gray-100`}
              >
                {cat} &nbsp; | &nbsp;
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <ProductCard key={item.id} item={item} />
          ))}
          {filteredItems.length === 0 && (
            <p className="col-span-full text-center text-gray-500 dark:text-gray-400">No food items found.</p>
          )}
        </div>
      </div>
    </>
    );
  }
export default HomePage;