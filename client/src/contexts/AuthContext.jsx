import { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import axiosInstance from "../config/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchUser = async () => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      console.log("No token found in localStorage");
      setLoading(false);
      setUser(null);
      return;
    }

    try {
      const response = await axiosInstance.get("/auth/user");
      setUser(response.data.user);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      toast({
        title: "Error fetching user.",
        description: "Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await axiosInstance.post("/auth/login", credentials);
      localStorage.setItem("jwt", response.data.token);
      await fetchUser();
      toast({
        title: "Login successful.",
        description: "Welcome back!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Login failed:", error);
      toast({
        title: "Login failed.",
        description: "Invalid credentials. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      localStorage.removeItem("jwt");
      setUser(null);
      toast({
        title: "Logout successful.",
        description: "You have been logged out.",
        status: "info",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Logout failed:", error);
      toast({
        title: "Logout failed.",
        description: "Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const setAuthUser = (userData) => {
    setUser(userData);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{ user, login, logout, loading, isAuthenticated, setAuthUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);