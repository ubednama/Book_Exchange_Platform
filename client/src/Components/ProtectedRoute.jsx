import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Flex, Spinner } from "@chakra-ui/react";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Flex width="full" justify="center" mt={5} size='xl'><Spinner /></Flex>;
  }

  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
