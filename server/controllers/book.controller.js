import Book from "../models/Book.js";
import User from "../models/User.js";

export const postBook = async (req, res) => {
    const { title, author, genre, description = '' } = req.body;
    const userId = req.userId;

    try {
        const existingBook = await Book.findOne({ title, author, owner: userId });
        if (existingBook) {
            return res.status(400).json({ error: 'You already own a book with the same title and author' });
        }

        const book = new Book({ title, author, genre, description, owner: userId });
        await book.save();

        await User.findByIdAndUpdate(
            userId,
            { $push: { books: book._id } },
            { new: true }
        );

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
        const query = { owner: { $ne: userId } };

        if (genre !== 'all') query.genre = genre;
        if (author !== 'all') query.author = author;

        const authors = await Book.distinct('author', { owner: { $ne: userId } });
        const genres = await Book.distinct('genre', { owner: { $ne: userId } });

        const books = await Book.find(query)
            .select('title author genre description')
            .populate('owner', 'username');

        res.json({ books, authors, genres });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

export const getUserBooks = async (req, res) => {
    const userId = req.userId;
    const { genre = 'all', author = 'all' } = req.query;

    try {
        const query = { owner: userId };

        if (genre !== 'all') query.genre = genre;
        if (author !== 'all') query.author = author;

        const books = await Book.find(query).select('title author genre description');

        const authors = await Book.distinct('author', { owner: userId });
        const genres = await Book.distinct('genre', { owner: userId });

        res.json({ books, authors, genres });
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
        const book = await Book.findOne({ _id: bookId, owner: userId });
        if (!book) {
            return res.status(404).json({ error: 'Book not found or unauthorized' });
        }

        await Book.findByIdAndDelete(bookId);

        await User.findByIdAndUpdate(
            userId,
            { $pull: { books: bookId } },
            { new: true }
        );

        res.json({ message: 'Book removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

const getTopGenresAndAuthors = async () => {
    const result = await Book.aggregate([
        {
            $facet: {
                topGenres: [
                    { $group: { _id: '$genre', count: { $sum: 1 } } },
                    { $sort: { count: -1 } },
                    { $limit: 10 },
                    { $project: { _id: 0, genre: '$_id' } }
                ],
                topAuthors: [
                    { $group: { _id: '$author', count: { $sum: 1 } } },
                    { $sort: { count: -1 } },
                    { $limit: 10 },
                    { $project: { _id: 0, author: '$_id' } }
                ]
            }
        }
    ]).exec();

    const topGenres = result[0].topGenres.map(g => g.genre);
    const topAuthors = result[0].topAuthors.map(a => a.author);

    return { genres: topGenres, authors: topAuthors };
};

export const getMatches = async (req, res) => {
    const userId = req.userId;

    try {
        const userBooks = await Book.find({ owner: userId }).select('genre author').lean();
        const userGenres = [...new Set(userBooks.map(book => book.genre))];
        const userAuthors = [...new Set(userBooks.map(book => book.author))];

        const { genres: topGenres, authors: topAuthors } = await getTopGenresAndAuthors();

        const criteria = {
            $or: [
                { genre: { $in: [...userGenres, ...topGenres] } },
                { author: { $in: [...userAuthors, ...topAuthors] } }
            ],
            owner: { $ne: userId }
        };

        const matches = await Book.aggregate([
            { $match: criteria },
            { $group: { _id: { title: "$title", author: "$author", genre: "$genre" }, doc: { $first: "$$ROOT" } } },
            { $replaceRoot: { newRoot: "$doc" } },
            { $lookup: { from: 'users', localField: 'owner', foreignField: '_id', as: 'ownerDetails' } },
            { $unwind: '$ownerDetails' },
            { $project: { title: 1, author: 1, genre: 1, description: 1, owner: { _id: "$ownerDetails._id", username: "$ownerDetails.username" } } },
            { $limit: 17 }
        ]);

        if (matches.length < 17) {
            const additionalMatches = await Book.aggregate([
                { $match: { owner: { $ne: userId } } },
                { $sample: { size: 18 - matches.length } },
                { $group: { _id: { title: "$title", author: "$author", genre: "$genre" }, doc: { $first: "$$ROOT" } } },
                { $replaceRoot: { newRoot: "$doc" } },
                { $lookup: { from: 'users', localField: 'owner', foreignField: '_id', as: 'ownerDetails' } },
                { $unwind: '$ownerDetails' },
                { $project: { title: 1, author: 1, genre: 1, description: 1, owner: { _id: "$ownerDetails._id", username: "$ownerDetails.username" } } },
                { $limit: 18 - matches.length }
            ]);

            matches.push(...additionalMatches);
        }

        res.json(matches.slice(0, 17));

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
