import { Box, Heading, Text } from "@chakra-ui/react";

const Home = () => {
  return (
    <Box p={6}>
      <Heading mb={4}>Welcome to the Book Exchange Platform</Heading>
      <Text fontSize="lg">
        Here you can list, browse, and exchange books with other users.
      </Text>
    </Box>
  );
}

export default Home
