import { Box, Heading, Input, Button, Text, Flex } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../config/api";


const Auth = ({ isRegistering }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { setAuthUser } = useAuth();
  const toast = useToast();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      const url = isRegistering ? "/auth/register" : "/auth/login";
      const { data } = await axiosInstance.post(url, { username, password });

      localStorage.setItem("jwt", data.token);

      const userResponse = await axiosInstance.get("/auth/user");
      setAuthUser(userResponse.data.user);
      toast({
        title: "Welcome back",
        description: "You have successfully logged in.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate("/");
    } catch (err) {
      toast({
        title: "Login failed",
        description: err.response?.data?.error || "An error occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
      });

      setError(err.response?.data?.error || "An error occurred");
    }
  };

  const handleSwitchMode = () => {
    navigate(isRegistering ? "/login" : "/register");
  };

  const isButtonDisabled = !username || !password;

  return (
    <Flex minHeight="100vh">
      <Flex
        flex={1}
        align="center"
        justify="center"
        bg="gray.200"
        direction="column"
        p={8}
      >
        <Box maxWidth="500px" textAlign="left">
          <Heading mb={4}>Book Management System</Heading>
          <Text mb={4} maxWidth={{ base: "100%", md: "75%" }}>
            Here you can list books and exchange books with like-minded people.
          </Text>
        </Box>
      </Flex>
      
      <Flex
        flex={1}
        align="center"
        justify="center"
        bg="gray.100"
      >
        <Box
          p={6}
          bg="white"
          borderRadius="md"
          shadow="md"
          minWidth="300px"
          maxWidth="450px"
          textAlign="center"
        >
          <Heading mb={4}>
            {isRegistering ? "Register" : "Login"}
          </Heading>
          <form onSubmit={handleSubmit}>
            <Input
              placeholder="Username"
              mb={2}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="Password"
              mb={4}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && (
              <Text color="red.500" mb={4}>
                {error}
              </Text>
            )}
            <Button
              type="submit"
              mb={4}
              colorScheme="teal"
              isDisabled={isButtonDisabled}
            >
              {isRegistering ? "Register" : "Login"}
            </Button>
          </form>
          <Button width="full" mt={1} variant="link" onClick={handleSwitchMode}>
            {isRegistering
              ? "Already have an account? Login"
              : "Don't have an account? Register"}
          </Button>
        </Box>
      </Flex>
    </Flex>
  );
};

export default Auth;
