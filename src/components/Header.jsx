import React, { useState } from "react";
import { Link } from "react-router-dom";
// const Header = () => {
//   const { toggleTheme, currentTheme, navigate, cart } = useContext(AppContext);
//   const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
 const cartItemCount =0
 const currentTheme=''
//  const [theme, setTheme] = useState('light');
//  import { useEffect } from "react";
// Theme management
  // useEffect(() => {
  //   if (theme === 'dark') {
  //     document.documentElement.classList.add('dark');
  //   } else {
  //     document.documentElement.classList.remove('dark');
  //   }
  // }, [theme]);

  // const toggleTheme = () => {
  //   setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  // };
  

 const Header = () => (
    <header className="bg-gradient-to-r from-blue-600 to-purple-700 dark:from-gray-900 dark:to-gray-700 text-white p-4 shadow-lg sticky top-0 z-40">
      <div className="container mx-auto flex flex-wrap justify-between items-center">
        <h1 className="text-3xl font-extrabold tracking-tight cursor-pointer">
          <Link to="/">MyStore</Link>
        </h1>
        <nav className="flex items-center space-x-4 mt-2 sm:mt-0">
          <button
            
            className="px-4 py-2 rounded-full hover:bg-white hover:text-blue-600 dark:hover:bg-gray-600 dark:hover:text-white transition-all duration-300 font-medium"
          >
            <Link to="/">Products</Link>
            
          </button>
          <button
            className="relative px-4 py-2 rounded-full hover:bg-white hover:text-blue-600 dark:hover:bg-gray-600 dark:hover:text-white transition-all duration-300 font-medium"
          >
            Cart
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>
          <Link to="/admin"><button
            className="px-4 py-2 rounded-full hover:bg-white hover:text-blue-600 dark:hover:bg-gray-600 dark:hover:text-white transition-all duration-300 font-medium"
          >
              Admin
          </button></Link>
          <button
            className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-300"
            aria-label="Toggle dark/light mode"
          >
            {currentTheme === 'dark' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h1M3 12H2m15.325-7.757l-.707-.707M6.343 17.657l-.707.707M17.657 6.343l.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
export default Header;