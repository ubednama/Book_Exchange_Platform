import {
  Box,
  Flex,
  Heading
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

const NavBar = () => {

  return (
    <Box bg="gray.800" p={4}>
      <Flex maxW="1200px" mx="auto" align="center" justify="space-between">
        <Heading size="lg" color="white">
          <Link to="/">Book Exchange</Link>
        </Heading>
        <Flex>
          <Link to="/" color="white" mx={2}>
            Home
          </Link>
          <Link to="/books" color="white" mx={2}>
            Browse Books
          </Link>
          <Link to="/login" color="white" mx={2}>
            Login
          </Link>
          <Link to="/register" color="white" mx={2}>
            Register
          </Link>
        </Flex>
      </Flex>
    </Box>
  );
};

export default NavBar;