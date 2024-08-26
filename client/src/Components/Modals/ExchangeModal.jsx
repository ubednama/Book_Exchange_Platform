import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Select,
  Box,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axiosInstance from "../../config/api";

const ExchangeModal = ({ isOpen, onClose, book, onExchange }) => {
  const [userBooks, setUserBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState("");
  const toast = useToast();

  useEffect(() => {
    const fetchUserBooks = async () => {
      try {
        const response = await axiosInstance.get("/books/user");
        setUserBooks(response.data.books);
      } catch (error) {
        console.error("Failed to fetch user books:", error);
        toast({
          title: "Error",
          description: "Failed to fetch user books.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchUserBooks();
  }, [toast]);

  const handleExchange = async () => {
    try {
      await onExchange(book._id, selectedBook);
      toast({
        title: "Success",
        description: "Exchange request sent successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Failed to send exchange request:", error);
      toast({
        title: "Error",
        description: "Failed to send exchange request.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Exchange Request</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontSize="xl" fontWeight="bold" mb={2}>
            {book.title}
          </Text>
          <Text fontSize="lg" mb={2}>
            by {book.author}
          </Text>
          <Text fontSize="md" mb={2}>
            Genre: {book.genre}
          </Text>
          <Box
            p={4}
            borderWidth={1}
            borderRadius="md"
            borderColor="gray.200"
            bg="gray.50"
            mb={4}
          >
            <Text fontSize="md">{book.description}</Text>
          </Box>
          <Text fontSize="md" mb={2} fontWeight="semibold" color="blue.600">
            Owner: {book?.owner?.username}
          </Text>
          <Select
            placeholder="Select a book to exchange"
            value={selectedBook}
            onChange={(e) => setSelectedBook(e.target.value)}
            size="sm"
            width="100%"
          >
            {userBooks.map((userBook) => (
              <option key={userBook._id} value={userBook._id}>
                {userBook.title} - {userBook?.author}
              </option>
            ))}
          </Select>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleExchange}>
            Send Request
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ExchangeModal;