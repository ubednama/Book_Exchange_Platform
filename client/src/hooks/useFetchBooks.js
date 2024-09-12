import { useState, useCallback } from "react";
import axiosInstance from "../config/api";
import { useToast } from "@chakra-ui/react";

const useFetchBooks = () => {
    const [loading, setLoading] = useState(false);
    const [books, setBooks] = useState([]);
    const [recommendedBooks, setRecommendedBooks] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [genres, setGenres] = useState([]);
    const toast = useToast();

    const fetchBooks = useCallback(async (selectedAuthor, selectedGenre) => {
        setLoading(true);
        try {
            const {data} = await axiosInstance.get("/books", {
                params: {
                    author: selectedAuthor || "all",
                    genre: selectedGenre || "all",
                },
            })
            setBooks(data.books);
            setAuthors(data.authors);
            setGenres(data.genres);
        } catch (error) {
            console.error("Error fetching books:", error);
            toast({
                title: "Error fetching books",
                description: "Could not fetch Books. Please try again later",
                status: "error",
                duration: 5000,
                isClosable: true
            })
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchRecommendedBooks = useCallback(async () => {
        setLoading(true);
        try {
            const {data} = await axiosInstance.get("books/matches");
            setRecommendedBooks(data);
        } catch (error) {
            console.error("Error fetching books:", error);
            toast({
                title: "Error fetching books",
                description: "Could not fetch Books. Please try again later",
                status: "error",
                duration: 5000,
                isClosable: true
            })
        } finally {
            setLoading(false);
        }
    }, [])


    return {
        loading,
        books,
        authors,
        genres,
        fetchBooks,
        recommendedBooks,
        fetchRecommendedBooks
    }
}

export default useFetchBooks;