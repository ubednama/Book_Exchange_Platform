import { Box, Text, Button, Flex, useDisclosure } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import axiosInstance from "../config/api";
import ExchangeModal from "./ExchangeModal";

const BookCard = ({ book, onDelete, onEdit, userBooks = false }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleExchangeRequest = async (requestedBookId, offeredBookId) => {
    try {
      await axiosInstance.post("/exchange-requests", {
        requestedBook: requestedBookId,
        offeredBook: offeredBookId,
      });
      toast("Exchange request sent!");
    } catch (error) {
      console.error("Failed to send exchange request:", error);
      toast("Failed to send exchange request. Please try again.");
    }
  };

  return (
    <Box
      p={4}
      borderWidth="1px"
      borderRadius="lg"
      shadow="md"
      mb={4}
      width="200px"
      height="270px"
      position="relative"
      overflow="hidden"
    >
      <Flex direction="column" justify="space-between" height="100%">
        <Flex
          direction="row"
          justify="space-between"
          mb={2}
          position="absolute"
          top={2}
          width="100%"
          px={2}
        ></Flex>
        <Box flex="1">
          <Flex direction="column" justify="space-between">
            <Text
              fontSize="xl"
              fontWeight="bold"
              mb={2}
              noOfLines={2}
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
            >
              {book.title}
            </Text>
            <Text
              fontSize="lg"
              mb={2}
              noOfLines={1}
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
            >
              by {book.author}
            </Text>
          </Flex>
          <Flex direction="column" mt={4} mb={0}>
            <Text
              fontSize="md"
              mb={2}
              noOfLines={1}
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
            >
              Genre: {book.genre}
            </Text>
            <Text
              fontSize="md"
              noOfLines={3}
              overflow="hidden"
              textOverflow="ellipsis"
            >
              {book.description}
            </Text>
          </Flex>
        </Box>
        {userBooks ? (
          <Flex justify="space-between">
            <Button
              height={9}
              onClick={() => onEdit(book)}
              size="sm"
              colorScheme="teal"
            >
              Edit
            </Button>
            <Button
              onClick={() => onDelete(book._id)}
              size="sm"
              height={9}
              colorScheme="red"
            >
              Delete
            </Button>
          </Flex>
        ) : (
          <Button onClick={onOpen} colorScheme="blue" height={9}>
            Request Exchange
          </Button>
        )}
      </Flex>
      <ExchangeModal
        isOpen={isOpen}
        onClose={onClose}
        book={book}
        onExchange={handleExchangeRequest}
      />
    </Box>
  );
};

export default BookCard;
