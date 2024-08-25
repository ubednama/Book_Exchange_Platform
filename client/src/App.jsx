import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Components/Home.jsx";
import Books from "./Components/Books";
import Login from "./Components/Login";
import NavBar from "./Components/NavBar";

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<Books />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
