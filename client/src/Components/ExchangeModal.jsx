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
  Select
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axiosInstance from "../config/api";

const ExchangeModal = ({ isOpen, onClose, book, onExchange }) => {
  const [userBooks, setUserBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState("");

  useEffect(() => {
    const fetchUserBooks = async () => {
      try {
        const response = await axiosInstance.get("/books/user");
        setUserBooks(response.data.books);
      } catch (error) {
        console.error("Failed to fetch user books:", error);
      }
    };

    fetchUserBooks();
  }, []);

  const handleExchange = () => {
    onExchange(book._id, selectedBook);
    onClose();
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
          <Text fontSize="md" mb={4}>
            {book.description}
          </Text>
          <Text fontSize="md" mb={2}>
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
