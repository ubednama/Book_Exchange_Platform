import { Box, Text, Button, Flex, useDisclosure } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import axiosInstance from "../config/api";
import ExchangeModal from "./Modals/ExchangeModal";

const BookCard = ({ book, onDelete, onEdit, userBooks = false }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleExchangeRequest = async (requestedBookId, offeredBookId) => {
    try {
      await axiosInstance.post("/exchange-requests", {
        requestedBookId,
        offeredBookId,
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
      width="180px"
      height="270px"
      position="relative"
      overflow="hidden"
      bg="white"
    >
      <Flex direction="column" justify="space-between" height="100%">
        <Box flex="1">
          <Flex direction="column" justify="space-between">
            <Text
              fontSize="md"
              fontWeight="bold"
              mb={1}
              noOfLines={2}
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
            >
              {book.title}
            </Text>
            <Text
              fontSize="sm"
              mb={1}
              noOfLines={1}
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
            >
              by {book.author}
            </Text>
          </Flex>
        </Box>
        <Box>
          <Text
            fontSize="sm"
            mb={1}
            noOfLines={1}
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
          >
            Genre: {book.genre}
          </Text>
          <Text
            fontSize="xs"
            noOfLines={3}
            overflow="hidden"
            textOverflow="ellipsis"
            mb={2}
          >
            {book.description}
          </Text>
        </Box>
        {userBooks ? (
          <Flex justify="space-between">
            <Button
              height={9}
              onClick={() => onEdit(book)}
              size="sm"
              border="2px"
              borderColor="teal"
            >
              Edit
            </Button>
            <Button
              onClick={() => onDelete(book._id)}
              size="sm"
              height={9}
              border="2px"
              borderColor="red"
              textColor="red"
            >
              Delete
            </Button>
          </Flex>
        ) : (
          <Button
            onClick={onOpen}
            border="1px"
            borderColor="lightblue"
            height={9}
          >
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
