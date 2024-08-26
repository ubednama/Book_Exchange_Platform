import { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
} from "@chakra-ui/react";

const BookModal = ({ isOpen, onClose, bookData, onSave }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (bookData) {
      setTitle(bookData.title || "");
      setAuthor(bookData.author || "");
      setGenre(bookData.genre || "");
      setDescription(bookData.description || "");
    }
  }, [bookData]);

  const handleSave = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!author.trim()) newErrors.author = "Author is required";
    if (!genre.trim()) newErrors.genre = "Genre is required";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSave({ title, author, genre, description });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{bookData ? "Edit Book" : "Add Book"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4} isInvalid={errors.title}>
            <FormLabel>Title</FormLabel>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter book title"
            />
            {errors.title && (
              <FormErrorMessage>{errors.title}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl mb={4} isInvalid={errors.author}>
            <FormLabel>Author</FormLabel>
            <Input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Enter author name"
            />
            {errors.author && (
              <FormErrorMessage>{errors.author}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl mb={4} isInvalid={errors.genre}>
            <FormLabel>Genre</FormLabel>
            <Input
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="Enter book genre"
            />
            {errors.genre && (
              <FormErrorMessage>{errors.genre}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Description</FormLabel>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter book description"
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSave}>
            Save
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BookModal;