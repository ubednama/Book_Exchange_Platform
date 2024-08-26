import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Select,
  Flex,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState, useCallback } from "react";
import BookCard from "../BookCard";
import axiosInstance from "../../config/api";

const Home = () => {
  const [allBooks, setAllBooks] = useState([]);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/books", {
        params: {
          author: selectedAuthor || "all",
          genre: selectedGenre || "all",
        },
      });
      setAllBooks(data.books);
      setAuthors(data.authors);
      setGenres(data.genres);
    } catch (error) {
      console.error("Error fetching books and filters:", error);
      toast({
        title: "Error fetching books",
        description: "Could not fetch books. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [selectedAuthor, selectedGenre, toast]);

  const fetchRecommendedBooks = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/books/matches");
      setRecommendedBooks(data);
    } catch (error) {
      console.error("Error fetching recommended books:", error);
      toast({
        title: "Error fetching recommendations",
        description:
          "Could not fetch recommended books. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    console.log("Fetching books...");
    fetchBooks();
  }, [fetchBooks]);

  useEffect(() => {
    if (tabIndex === 1) {
      console.log("Fetching recommended books...");
      fetchRecommendedBooks();
    }
  }, [tabIndex, fetchRecommendedBooks]);

  const handleAuthorChange = (e) => {
    console.log("Author changed:", e.target.value);
    setSelectedAuthor(e.target.value);
  };

  const handleGenreChange = (e) => {
    console.log("Genre changed:", e.target.value);
    setSelectedGenre(e.target.value);
  };

  return (
    <Flex p={4} direction="row">
      <Box flex="1">
        <Tabs index={tabIndex} onChange={(index) => setTabIndex(index)}>
          <Box>
            <TabList display="flex" justifyContent="center">
              <Tab>All Books</Tab>
              <Tab>Recommended Books</Tab>
            </TabList>
            {tabIndex === 0 && (
              <Box display="flex" gap={4} my={4}>
                <Select
                  value={selectedAuthor}
                  onChange={handleAuthorChange}
                  size="sm"
                  width="200px"
                >
                  <option value="all">All Authors</option>
                  {authors.map((author) => (
                    <option key={author} value={author}>
                      {author}
                    </option>
                  ))}
                </Select>
                <Select
                  value={selectedGenre}
                  onChange={handleGenreChange}
                  size="sm"
                  width="200px"
                >
                  <option value="all">All Genres</option>
                  {genres.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </Select>
              </Box>
            )}
          </Box>
          {loading ? (
            <Flex justify="center" width="100%">
              <Spinner color="red.500" />
            </Flex>
          ) : (
            <TabPanels>
              <TabPanel>
                <Flex wrap="wrap" gap={5}>
                  {allBooks.length > 0 ? (
                    allBooks.map((book) => (
                      <BookCard key={book._id} book={book} />
                    ))
                  ) : (
                    <p>No books available.</p>
                  )}
                </Flex>
              </TabPanel>
              <TabPanel>
                <Flex wrap="wrap" gap={5}>
                  {recommendedBooks.length > 0 ? (
                    recommendedBooks.map((book) => (
                      <BookCard key={book._id} book={book} />
                    ))
                  ) : (
                    <p>No books available.</p>
                  )}
                </Flex>
              </TabPanel>
            </TabPanels>
          )}
        </Tabs>
      </Box>
    </Flex>
  );
};

export default Home;