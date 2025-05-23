import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/HomePage";
import Admin from "./pages/AdminPage";

const App = () => (
  <Router>
    <ul className="menu menu-horizontal bg-base-200">
  <li className="link link-secondary"> <Link to="/">Home</Link>
     </li>
  <li className="link link-secondary"> 
      <Link to="/admin">Admin</Link></li>
</ul>
   
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  </Router>
);

export default App
