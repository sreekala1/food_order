import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/HomePage";
import Admin from "./pages/AdminPage";

const App = () => (
  <Router>
    <header className="bg-white dark:bg-gray-900 shadow-md py-4 px-6 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-blue-600 dark:text-white">
        🛒 MyStore
      </h1>
      <nav className="space-x-4"></nav>
    <ul className="menu menu-horizontal bg-base-200">
  <li className="link link-secondary"> <Link to="/">Home</Link>
     </li>
  <li className="link link-secondary"> 
      <Link to="/admin">Admin</Link></li>
</ul> </header>
   
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  </Router>
);

export default App
