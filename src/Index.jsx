import React, { useState, useEffect, createContext, useContext } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, doc, getDoc, addDoc, setDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';

// --- Contexts ---
const AppContext = createContext(null);
const AuthContext = createContext(null);

// --- Utility Components ---
const Modal = ({ children, onClose, title }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md relative">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{title}</h2>
        {children}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
          aria-label="Close"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-full">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
    <strong className="font-bold">Error!</strong>
    <span className="block sm:inline ml-2">{message}</span>
  </div>
);

// --- Header Component ---
const Header = () => {
  const { toggleTheme, currentTheme, navigate, cart } = useContext(AppContext);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-700 dark:from-gray-900 dark:to-gray-700 text-white p-4 shadow-lg sticky top-0 z-40">
      <div className="container mx-auto flex flex-wrap justify-between items-center">
        <h1 className="text-3xl font-extrabold tracking-tight cursor-pointer" onClick={() => navigate('home')}>
          MyStore
        </h1>
        <nav className="flex items-center space-x-4 mt-2 sm:mt-0">
          <button
            onClick={() => navigate('home')}
            className="px-4 py-2 rounded-full hover:bg-white hover:text-blue-600 dark:hover:bg-gray-600 dark:hover:text-white transition-all duration-300 font-medium"
          >
            Products
          </button>
          <button
            onClick={() => navigate('cart')}
            className="relative px-4 py-2 rounded-full hover:bg-white hover:text-blue-600 dark:hover:bg-gray-600 dark:hover:text-white transition-all duration-300 font-medium"
          >
            Cart
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>
          <button
            onClick={() => navigate('admin')}
            className="px-4 py-2 rounded-full hover:bg-white hover:text-blue-600 dark:hover:bg-gray-600 dark:hover:text-white transition-all duration-300 font-medium"
          >
            Admin
          </button>
          <button
            onClick={toggleTheme}
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
};

// --- Product Card Component ---
const ProductCard = ({ product, onViewProduct, onAddToCart }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out border border-gray-200 dark:border-gray-700">
      <img
        src={product.imageUrl || `https://placehold.co/400x300/e2e8f0/64748b?text=No+Image`}
        alt={product.name}
        className="w-full h-48 object-cover object-center"
        onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x300/e2e8f0/64748b?text=Image+Error`; }}
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 truncate">{product.name}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">${product.price.toFixed(2)}</span>
          <div className="flex space-x-2">
            <button
              onClick={() => onViewProduct(product.id)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 shadow-md"
            >
              View
            </button>
            <button
              onClick={() => onAddToCart(product)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 shadow-md"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Product List (Customer View) Component ---
const ProductList = () => {
  const { products, navigate, addToCart } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto p-4 py-8">
      <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8 text-center">Our Products</h2>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0 sm:space-x-4">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full sm:w-1/2 p-3 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="w-full sm:w-1/4 p-3 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-700 dark:text-gray-300 text-lg">No products found matching your criteria.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onViewProduct={(id) => { navigate('productDetail', id); }}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// --- Product Detail Component ---
const ProductDetail = ({ productId }) => {
  const { products, navigate, addToCart } = useContext(AppContext);
  const product = products.find(p => p.id === productId);

  if (!product) {
    return (
      <div className="container mx-auto p-4 py-8 text-center text-gray-700 dark:text-gray-300">
        <p className="text-xl mb-4">Product not found.</p>
        <button
          onClick={() => navigate('home')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full font-medium transition-colors duration-300 shadow-md"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden md:flex">
        <div className="md:w-1/2">
          <img
            src={product.imageUrl || `https://placehold.co/600x400/e2e8f0/64748b?text=No+Image`}
            alt={product.name}
            className="w-full h-64 md:h-full object-cover object-center"
            onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/600x400/e2e8f0/64748b?text=Image+Error`; }}
          />
        </div>
        <div className="md:w-1/2 p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">{product.name}</h2>
            <p className="text-gray-700 dark:text-gray-300 text-lg mb-6 leading-relaxed">{product.description}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">Category: <span className="font-medium">{product.category}</span></p>
          </div>
          <div className="mt-auto">
            <div className="flex items-center justify-between mb-6">
              <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">${product.price.toFixed(2)}</span>
              <button
                onClick={() => addToCart(product)}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full text-lg font-bold transition-colors duration-300 shadow-lg transform hover:scale-105"
              >
                Add to Cart
              </button>
            </div>
            <button
              onClick={() => navigate('home')}
              className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-full font-medium transition-colors duration-300 shadow-md"
            >
              Back to Products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Cart Component ---
const Cart = () => {
  const { cart, updateCartQuantity, removeFromCart, navigate } = useContext(AppContext);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="container mx-auto p-4 py-8 text-center text-gray-700 dark:text-gray-300">
        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8">Your Cart is Empty</h2>
        <p className="text-xl mb-6">Start shopping to add items to your cart!</p>
        <button
          onClick={() => navigate('home')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full font-medium transition-colors duration-300 shadow-md"
        >
          Go to Products
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 py-8">
      <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8 text-center">Your Shopping Cart</h2>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
        <div className="space-y-6">
          {cart.map(item => (
            <div key={item.id} className="flex items-center border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
              <img
                src={item.imageUrl || `https://placehold.co/100x100/e2e8f0/64748b?text=No+Image`}
                alt={item.name}
                className="w-24 h-24 object-cover object-center rounded-lg mr-4"
                onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/100x100/e2e8f0/64748b?text=Image+Error`; }}
              />
              <div className="flex-grow">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                <p className="text-gray-600 dark:text-gray-300">${item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  -
                </button>
                <span className="text-lg font-medium text-gray-900 dark:text-white">{item.quantity}</span>
                <button
                  onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                  className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full font-bold"
                >
                  +
                </button>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 shadow-md"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 pt-6 border-t-2 border-gray-300 dark:border-gray-600 flex justify-between items-center">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">Total: ${total.toFixed(2)}</span>
          <button
            onClick={() => alert('Checkout functionality not implemented yet!')} // Using alert as a placeholder for now
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-bold transition-colors duration-300 shadow-lg transform hover:scale-105"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Product Form (Admin) Component ---
const ProductForm = ({ product, onSave, onCancel }) => {
  const [name, setName] = useState(product ? product.name : '');
  const [description, setDescription] = useState(product ? product.description : '');
  const [price, setPrice] = useState(product ? product.price : '');
  const [category, setCategory] = useState(product ? product.category : '');
  const [imageUrl, setImageUrl] = useState(product ? product.imageUrl : '');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Product name is required.';
    if (isNaN(price) || parseFloat(price) <= 0) newErrors.price = 'Price must be a positive number.';
    if (!category.trim()) newErrors.category = 'Category is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave({
        id: product ? product.id : null,
        name,
        description,
        price: parseFloat(price),
        category,
        imageUrl,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Product Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
          className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
        ></textarea>
      </div>
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price</label>
        <input
          type="number"
          id="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          step="0.01"
          className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
        <input
          type="text"
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
      </div>
      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Image URL</label>
        <input
          type="text"
          id="imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300 shadow-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300 shadow-md"
        >
          Save Product
        </button>
      </div>
    </form>
  );
};

// --- Admin Dashboard Component ---
const AdminDashboard = () => {
  const { products, db, appId, userId, isAuthReady } = useContext(AppContext);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [adminError, setAdminError] = useState(null);

  // CRUD Operations
  const handleAddProduct = async (newProduct) => {
    if (!isAuthReady || !db || !appId || !userId) {
      setAdminError("Authentication not ready. Cannot add product.");
      return;
    }
    try {
      // Products are public data, so they are stored under /artifacts/{appId}/public/data/products
      await addDoc(collection(db, `artifacts/${appId}/public/data/products`), {
        ...newProduct,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      setShowProductForm(false);
      setEditingProduct(null);
      setAdminError(null);
    } catch (e) {
      console.error("Error adding document: ", e);
      setAdminError("Failed to add product. Please try again.");
    }
  };

  const handleUpdateProduct = async (updatedProduct) => {
    if (!isAuthReady || !db || !appId || !userId) {
      setAdminError("Authentication not ready. Cannot update product.");
      return;
    }
    try {
      const productRef = doc(db, `artifacts/${appId}/public/data/products`, updatedProduct.id);
      await updateDoc(productRef, {
        ...updatedProduct,
        updatedAt: new Date(),
      });
      setShowProductForm(false);
      setEditingProduct(null);
      setAdminError(null);
    } catch (e) {
      console.error("Error updating document: ", e);
      setAdminError("Failed to update product. Please try again.");
    }
  };

  const handleDeleteProduct = async () => {
    if (!isAuthReady || !db || !appId || !userId || !productToDelete) {
      setAdminError("Authentication not ready or no product selected for deletion.");
      return;
    }
    try {
      const productRef = doc(db, `artifacts/${appId}/public/data/products`, productToDelete.id);
      await deleteDoc(productRef);
      setShowDeleteConfirm(false);
      setProductToDelete(null);
      setAdminError(null);
    } catch (e) {
      console.error("Error deleting document: ", e);
      setAdminError("Failed to delete product. Please try again.");
    }
  };

  const openEditForm = (product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const openAddForm = () => {
    setEditingProduct(null);
    setShowProductForm(true);
  };

  const confirmDelete = (product) => {
    setProductToDelete(product);
    setShowDeleteConfirm(true);
  };

  return (
    <div className="container mx-auto p-4 py-8">
      <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8 text-center">Admin Dashboard</h2>

      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-700 dark:text-gray-300">
          Logged in as: <span className="font-semibold text-blue-600 dark:text-blue-400 break-all">{userId || 'Loading...'}</span>
        </p>
        <button
          onClick={openAddForm}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium transition-colors duration-300 shadow-md"
        >
          Add New Product
        </button>
      </div>

      {adminError && <ErrorMessage message={adminError} />}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {products.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 whitespace-nowrap text-center text-gray-500 dark:text-gray-400">
                    No products available.
                  </td>
                </tr>
              ) : (
                products.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{product.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">${product.price.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => openEditForm(product)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4 transition-colors duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => confirmDelete(product)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showProductForm && (
        <Modal
          title={editingProduct ? 'Edit Product' : 'Add New Product'}
          onClose={() => { setShowProductForm(false); setEditingProduct(null); setAdminError(null); }}
        >
          <ProductForm
            product={editingProduct}
            onSave={editingProduct ? handleUpdateProduct : handleAddProduct}
            onCancel={() => { setShowProductForm(false); setEditingProduct(null); setAdminError(null); }}
          />
        </Modal>
      )}

      {showDeleteConfirm && (
        <Modal
          title="Confirm Delete"
          onClose={() => { setShowDeleteConfirm(false); setProductToDelete(null); setAdminError(null); }}
        >
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Are you sure you want to delete "<span className="font-semibold">{productToDelete?.name}</span>"? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => { setShowDeleteConfirm(false); setProductToDelete(null); setAdminError(null); }}
              className="px-6 py-2 rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300 shadow-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteProduct}
              className="px-6 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors duration-300 shadow-md"
            >
              Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};


// --- Main App Component ---
const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [theme, setTheme] = useState('light');
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize Firebase
  useEffect(() => {
    try {
      const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
      const app = initializeApp(firebaseConfig);
      const firestore = getFirestore(app);
      const firebaseAuth = getAuth(app);

      setDb(firestore);
      setAuth(firebaseAuth);

      const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
        if (user) {
          setUserId(user.uid);
        } else {
          // Sign in anonymously if no user is logged in
          try {
            const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
            if (initialAuthToken) {
                await signInWithCustomToken(firebaseAuth, initialAuthToken);
            } else {
                await signInAnonymously(firebaseAuth);
            }
            setUserId(firebaseAuth.currentUser?.uid || crypto.randomUUID()); // Fallback for anonymous
          } catch (authError) {
            console.error("Firebase Auth Error:", authError);
            setError("Failed to authenticate with Firebase.");
            setUserId(crypto.randomUUID()); // Generate a random ID if auth fails
          }
        }
        setIsAuthReady(true);
        setLoading(false);
      });

      return () => unsubscribe(); // Cleanup auth listener
    } catch (e) {
      console.error("Firebase initialization error:", e);
      setError("Failed to initialize Firebase. Check console for details.");
      setLoading(false);
    }
  }, []);

  // Fetch products from Firestore
  useEffect(() => {
    if (db && isAuthReady) {
      // Products are public data, so they are stored under /artifacts/{appId}/public/data/products
      const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
      const productsCollectionRef = collection(db, `artifacts/${appId}/public/data/products`);

      const unsubscribe = onSnapshot(productsCollectionRef, (snapshot) => {
        const productsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productsData);
        setError(null); // Clear any previous errors
      }, (err) => {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try refreshing.");
      });

      return () => unsubscribe(); // Cleanup snapshot listener
    }
  }, [db, isAuthReady]); // Re-run when db or auth readiness changes

  // Theme management
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const navigate = (page, id = null) => {
    setCurrentPage(page);
    setSelectedProductId(id);
  };

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity: quantity } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <AppContext.Provider value={{
      products,
      cart,
      theme,
      toggleTheme,
      navigate,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      db,
      auth,
      userId,
      isAuthReady,
      appId: typeof __app_id !== 'undefined' ? __app_id : 'default-app-id'
    }}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-inter antialiased">
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
            body {
              font-family: 'Inter', sans-serif;
            }
          `}
        </style>
        <Header />
        <main className="pb-8">
          {error && <div className="container mx-auto p-4 mt-4"><ErrorMessage message={error} /></div>}
          {currentPage === 'home' && <ProductList />}
          {currentPage === 'productDetail' && <ProductDetail productId={selectedProductId} />}
          {currentPage === 'cart' && <Cart />}
          {currentPage === 'admin' && <AdminDashboard />}
        </main>
      </div>
    </AppContext.Provider>
  );
};

export default App;
