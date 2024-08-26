import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Heading,
  Button,
  FormControl,
  FormLabel,
  Select,
  Flex,
  Spinner,
  useToast,
  Text,
} from "@chakra-ui/react";
import BookCard from "../BookCard";
import axiosInstance from "../../config/api";
import BookModal from "../Modals/Modal";

const YourLibrary = () => {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editBook, setEditBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const fetchUserBooks = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/books/user", {
        withCredentials: true,
      });

      if (Array.isArray(data.books)) {
        setBooks(data.books);
        setFilteredBooks(data.books);
      }

      setAuthors(data.authors || []);
      setGenres(data.genres || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user books:", error);
      setBooks([]);
      setFilteredBooks([]);
      setAuthors([]);
      setGenres([]);
    }
  }, []);

  useEffect(() => {
    console.log("Fetching user books...");
    fetchUserBooks();
  }, [fetchUserBooks]);

  useEffect(() => {
    setLoading(true);
    console.log("Filtering books...");
    const filterBooks = () => {
      let result = books;
      if (selectedAuthor) {
        result = result.filter((book) => book.author === selectedAuthor);
      }
      if (selectedGenre) {
        result = result.filter((book) => book.genre === selectedGenre);
      }
      setFilteredBooks(result);
      setLoading(false);
    };

    filterBooks();
  }, [selectedAuthor, selectedGenre, books]);

  const handleAddBook = async (book) => {
    console.log("Adding book:", book);
    try {
      const { data } = await axiosInstance.post("/books", book, {
        withCredentials: true,
      });
      setBooks((prevBooks) => [...prevBooks, data]);
      setFilteredBooks((prevFilteredBooks) => [...prevFilteredBooks, data]);
      toast({
        title: "Book Added",
        description: `Successfully added ${data.title} by ${data.author}.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error(
        "Error adding book:",
        error.response?.data || error.message
      );
      toast({
        title: "Error",
        description: "Failed to add the book. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEditBook = async (book) => {
    console.log("Editing book:", book);
    try {
      const { data } = await axiosInstance.put(`/books/${book._id}`, book, {
        withCredentials: true,
      });
      setBooks((prevBooks) =>
        prevBooks.map((b) => (b._id === data._id ? data : b))
      );
      setFilteredBooks((prevFilteredBooks) =>
        prevFilteredBooks.map((b) => (b._id === data._id ? data : b))
      );
      toast({
        title: "Book Updated",
        description: `Successfully updated ${data.title} by ${data.author}.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error(
        "Error editing book:",
        error.response?.data || error.message
      );
      toast({
        title: "Error",
        description: "Failed to update the book. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeleteBook = async (bookId) => {
    console.log("Deleting book with ID:", bookId);
    try {
      setLoading(true);
      await axiosInstance.delete(`/books/${bookId}`, { withCredentials: true });
      setBooks((prevBooks) => prevBooks.filter((book) => book._id !== bookId));
      setFilteredBooks((prevFilteredBooks) =>
        prevFilteredBooks.filter((book) => book._id !== bookId)
      );
      setLoading(false);
      toast({
        title: "Book Deleted",
        description: "Successfully deleted the book.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error(
        "Error deleting book:",
        error.response?.data || error.message
      );
      toast({
        title: "Error",
        description: "Failed to delete the book. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const openModalForAdd = () => {
    console.log("Opening modal for adding a book");
    setEditBook(null);
    setIsModalOpen(true);
  };

  const openModalForEdit = (book) => {
    console.log("Opening modal for editing a book:", book);
    setEditBook(book);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    console.log("Closing modal");
    setIsModalOpen(false);
  };

  const saveBook = (book) => {
    console.log("Saving book:", book);
    if (editBook) {
      handleEditBook({ ...book, _id: editBook._id });
    } else {
      handleAddBook(book);
    }
  };

  return (
    <Box p={4}>
      <Flex align="center" mb={4} justify="space-between">
        <Heading>Your Library</Heading>
        <Flex gap={4}>
          {authors.length > 0 && (
            <FormControl>
              <FormLabel htmlFor="author" hidden>
                Filter by Author
              </FormLabel>
              <Select
                id="author"
                placeholder={selectedAuthor}
                value={selectedAuthor}
                onChange={(e) => setSelectedAuthor(e.target.value)}
                size="sm"
                width="150px"
              >
                <option value="">All Authors</option>
                {authors.map((author) => (
                  <option key={author} value={author}>
                    {author}
                  </option>
                ))}
              </Select>
            </FormControl>
          )}
          {genres.length > 0 && (
            <FormControl>
              <FormLabel htmlFor="genre" hidden>
                Filter by Genre
              </FormLabel>
              <Select
                id="genre"
                placeholder={selectedGenre}
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                size="sm"
                width="150px"
              >
                <option value="">All Genres</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </Select>
            </FormControl>
          )}
        </Flex>
      </Flex>
      {loading ? (
        <Flex justify="center" width="100%">
          <Spinner color="red.500" />
        </Flex>
      ) : books.length === 0 ? (
        <Flex
          textAlign="center"
          align="center"
          justify="center"
          direction="column"
          height="full"
        >
          <Box>
            <Text mb={4}>
              You don’t have any books. Add some books to your library!
            </Text>
            <Button colorScheme="blue" onClick={openModalForAdd}>
              Add Book
            </Button>
          </Box>
        </Flex>
      ) : (
        <>
          <Button
            colorScheme="blue"
            onClick={openModalForAdd}
            position="fixed"
            bottom={4}
            right={4}
          >
            Add Book
          </Button>
          <Flex
            wrap="wrap"
            gap={4}
            justify="center"
            align="start"
            direction="row"
          >
            {filteredBooks.map((book) => (
              <BookCard
                key={book._id}
                book={book}
                userBooks={true}
                onEdit={() => openModalForEdit(book)}
                onDelete={() => handleDeleteBook(book._id)}
              />
            ))}
          </Flex>
        </>
      )}
      {isModalOpen && (
        <BookModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={saveBook}
          initialBook={editBook}
        />
      )}
    </Box>
  );
};

export default YourLibrary;