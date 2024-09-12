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
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import BookCard from "../BookCard";
import useFetchBooks from "../../hooks/useFetchBooks";

const Home = () => {
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [tabIndex, setTabIndex] = useState(0);

  const {
    loading, books, recommendedBooks, authors, genres, fetchBooks, fetchRecommendedBooks
  } = useFetchBooks();

  useEffect(() => {
    fetchBooks(selectedAuthor, selectedGenre);
  }, [fetchBooks, selectedAuthor, selectedGenre]);

  useEffect(() => {
    if (tabIndex === 1) {
      fetchRecommendedBooks();
    }
  }, [tabIndex, fetchRecommendedBooks]);

  const handleAuthorChange = (e) => {
    setSelectedAuthor(e.target.value);
  };

  const handleGenreChange = (e) => {
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
                <Box width="100%" px={4}>
                  <Box
                    display="grid"
                    justifyContent="center"
                    gridTemplateColumns="repeat(auto-fill, 180px)"
                    gap={4}
                    maxWidth="100%"
                    mx="auto"
                  >
                    {books.length > 0 ? (
                      books.map((book) => (
                        <BookCard key={book._id} book={book} />
                      ))
                    ) : (
                      <p>No books available.</p>
                    )}
                  </Box>
                </Box>
              </TabPanel>
              <TabPanel>
                <Box width="100%" px={4}>
                  <Box
                    display="grid"
                    justifyContent="center"
                    gridTemplateColumns="repeat(auto-fill, 180px)"
                    gap={4}
                    maxWidth="100%"
                    mx="auto"
                  >
                    {recommendedBooks.length > 0 ? (
                      recommendedBooks.map((book) => (
                        <BookCard key={book._id} book={book} />
                      ))
                    ) : (
                      <p>No books available.</p>
                    )}
                  </Box>
                </Box>
              </TabPanel>
            </TabPanels>
          )}
        </Tabs>
      </Box>
    </Flex>
  );
};

export default Home;