import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/HomePage";
import Admin from "./pages/AdminPage";
import Header from "./components/Header";
import ProductDetailPage from './pages/ProductDetailPage';
import React, { useState } from "react";
const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
<Route path="/productDetail/:id" element={<ProductDetailPage />} />
      </Routes>
    </Router>
  );
};

export default App
