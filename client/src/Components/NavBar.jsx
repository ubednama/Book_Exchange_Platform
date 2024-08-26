import {
  Box,
  Flex,
  Heading,
  Button,
  Text,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const NavBar = () => {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Box bg="gray.800" p={4}>
      <Flex mx="auto" px="1rem" align="center" justify="space-between">
        <Flex flex="1" direction="column">
          <Heading size="lg" color="white">
            <ChakraLink as={Link} to="/">
              Book Exchange
            </ChakraLink>
          </Heading>
          <Text fontSize="lg" color="gray.300">
            Here you can list, browse, and exchange books with other users.
          </Text>
        </Flex>

        <Flex flex="1" align="center" justify="space-around">
          <ChakraLink
            as={Link}
            to="/"
            color="white"
            mx={2}
            textDecoration={location.pathname === "/" ? "underline" : "none"}
          >
            Browse
          </ChakraLink>
          <ChakraLink
            as={Link}
            to="/exchange-requests"
            color="white"
            mx={2}
            textDecoration={
              location.pathname === "/exchange-requests" ? "underline" : "none"
            }
          >
            Exchange Requests
          </ChakraLink>
          <ChakraLink
            as={Link}
            to="/library"
            color="white"
            mx={2}
            textDecoration={
              location.pathname === "/library" ? "underline" : "none"
            }
          >
            Your Library
          </ChakraLink>
          <Button colorScheme="red" onClick={handleLogout} mx={2}>
            Logout
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default NavBar;
