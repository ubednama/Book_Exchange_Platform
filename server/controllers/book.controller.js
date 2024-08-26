import Book from "../models/Book.js";
import User from "../models/User.js";

export const postBook = async (req, res) => {
    const { title, author, genre, description = '' } = req.body;
    const userId = req.userId;

    try {
        const existingBook = await Book.findOne({ title, author });
        if (existingBook) {
            return res.status(400).json({ error: 'Book with the same title and author already exists' });
        }

        const book = new Book({ title, author, genre, description, owner: userId });
        await book.save();

        const user = await User.findById(userId);
        user.books.push(book._id);
        await user.save();

        res.status(201).json(book);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

export const getBook = async (req, res) => {
    const userId = req.userId;
    const { genre = 'all', author = 'all' } = req.query;

    try {
        const allBooks = await Book.find({ owner: { $ne: userId } })
            .select('title author genre description')
            .populate('owner', 'username');

        const authors = [...new Set(allBooks.map(book => book.author))];
        const genres = [...new Set(allBooks.map(book => book.genre))];

        const filteredBooks = allBooks.filter(book => {
            return (
                (genre === 'all' || book.genre === genre) &&
                (author === 'all' || book.author === author)
            );
        });

        res.json({ books: filteredBooks, authors, genres });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

export const getUserBooks = async (req, res) => {
    const userId = req.userId;
    const { genre = 'all', author = 'all' } = req.query;

    try {
        const allBooks = await Book.find({ owner: userId })
            .select('author genre');

        const authors = [...new Set(allBooks.map(book => book.author))];
        const genres = [...new Set(allBooks.map(book => book.genre))];

        const filteredBooks = await Book.find({
            owner: userId,
            ...(genre !== 'all' ? { genre } : {}),
            ...(author !== 'all' ? { author } : {}),
        }).select('title author genre description');

        res.json({ books: filteredBooks, authors, genres });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

export const editBook = async (req, res) => {
    const { title, author, genre, description } = req.body;
    const bookId = req.params.id;
    const userId = req.userId;

    try {
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        if (book.owner.toString() !== userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        book.title = title || book.title;
        book.author = author || book.author;
        book.genre = genre || book.genre;
        book.description = description !== undefined ? description.trim() : book.description;

        await book.save();
        res.json(book);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

export const deleteBook = async (req, res) => {
    const bookId = req.params.id;
    const userId = req.userId;

    try {
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        if (book.owner.toString() !== userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await Book.findByIdAndDelete(bookId);

        const user = await User.findById(userId);
        user.books = user.books.filter(book => book.toString() !== bookId);
        await user.save();

        res.json({ message: 'Book removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

const getTopGenresAndAuthors = async () => {
    const [topGenres, topAuthors] = await Promise.all([
        Book.aggregate([
            { $group: { _id: '$genre', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]).exec(),
        Book.aggregate([
            { $group: { _id: '$author', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]).exec()
    ]);

    return {
        genres: topGenres.map(g => g._id),
        authors: topAuthors.map(a => a._id)
    };
};

const findMatches = async (userId, genres, authors) => {
    return await Book.find({
        $and: [
            {
                $or: [
                    { genre: { $in: genres } },
                    { author: { $in: authors } }
                ]
            },
            { owner: { $ne: userId } }
        ]
    }).populate('owner', 'username').limit(20);
};


export const getMatches = async (req, res) => {
    const userId = req.userId;

    try {
        const user = await User.findById(userId).populate('books');

        if (!user) {
            return res.status(404).json({ error: 'User must login first' });
        }

        const userBooks = user.books;
        let matches;

        if (userBooks.length === 0) {
            const { genres, authors } = await getTopGenresAndAuthors();
            matches = await findMatches(userId, genres, authors);
        } else {
            const genres = userBooks.map(book => book.genre);
            const authors = userBooks.map(book => book.author);
            matches = await findMatches(userId, genres, authors);
        }

        if (matches.length === 0) {
            const { genres, authors } = await getTopGenresAndAuthors();
            matches = await findMatches(userId, genres, authors);
        }

        res.json(matches);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};