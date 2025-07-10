import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  // Theme state
  const [theme, setTheme] = useState("light");

  // Theme management
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-700 dark:from-gray-900 dark:to-gray-700 text-white p-4 shadow-lg sticky top-0 z-40">
      <div className="container mx-auto flex flex-wrap justify-between items-center">
        <h1 className="text-3xl font-extrabold tracking-tight cursor-pointer">
          <Link to="/">MyStore</Link>
        </h1>
        <nav className="flex items-center space-x-4 mt-2 sm:mt-0">
          <Link
            to="/"
            className="px-4 py-2 rounded-full hover:bg-white hover:text-blue-600 dark:hover:bg-gray-600 dark:hover:text-white transition-all duration-300 font-medium"
          >
            Products
          </Link>
          <Link
            to="/admin"
            className="px-4 py-2 rounded-full hover:bg-white hover:text-blue-600 dark:hover:bg-gray-600 dark:hover:text-white transition-all duration-300 font-medium"
          >
            Admin
          </Link>
          <button
            className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-300"
            aria-label="Toggle dark/light mode"
            onClick={toggleTheme}
          >
            {theme === "dark" ? (
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
};

export default Header;