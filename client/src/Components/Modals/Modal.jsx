import { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  FormControl,
  FormLabel,
  Textarea,
} from "@chakra-ui/react";

const BookModal = ({ isOpen, onClose, onSave, initialBook }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (initialBook) {
      setTitle(initialBook.title || "");
      setAuthor(initialBook.author || "");
      setGenre(initialBook.genre || "");
      setDescription(initialBook.description || "");
    } else {
      setTitle("");
      setAuthor("");
      setGenre("");
      setDescription("");
    }
  }, [initialBook]);

  const handleSave = () => {
    const book = { title, author, genre, description };
    onSave(book);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{initialBook ? "Edit Book" : "Add Book"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4}>
            <FormLabel htmlFor="title">Title</FormLabel>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Book Title"
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel htmlFor="author">Author</FormLabel>
            <Input
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Book Author"
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel htmlFor="genre">Genre</FormLabel>
            <Input
              id="genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="Book Genre"
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel htmlFor="description">Description</FormLabel>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Book Description"
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