import { Route, Routes } from "react-router-dom";
import Home from "./Home.jsx";
import ExchangeRequests from "./ExchangeRequests.jsx";
import YourLibrary from "./YourLibrary.jsx";
import ProtectedRoute from "./ProtectedRoute";
import NavBar from "./NavBar.jsx";
import Auth from "./Auth.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Auth isRegistering={false} />} />
      <Route path="/register" element={<Auth isRegistering={true} />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <NavBar />
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/exchange-requests"
        element={
          <ProtectedRoute>
            <NavBar />
            <ExchangeRequests />
          </ProtectedRoute>
        }
      />
      <Route
        path="/library"
        element={
          <ProtectedRoute>
            <NavBar />
            <YourLibrary />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;