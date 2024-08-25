import { Box, Heading, Input, Button } from "@chakra-ui/react";

const Login = () => {
    const handleLogin = () => {
      //ToDO Login logic
    };

  return (
    <Box p={6}>
      <Heading mb={4}>Login</Heading>
      <Input placeholder="Email" mb={2} />
      <Input placeholder="Password" mb={4} type="password" />
      <Button onClick={handleLogin}>Login</Button>
    </Box>
  );
}

export default Login