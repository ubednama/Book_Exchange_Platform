import Book from "../models/Book.js";
import User from "../models/User.js";

const postBook = async (req, res) => {
    const { title, author, genre } = req.body;
    const userId = req.user.id;

    try {
        const existingBook = await Book.findOne({ title, author });
        if (existingBook) {
            return res.status(400).json({ error: 'Book with the same title and author already exists' });
        }

        const book = new Book({
            title,
            author,
            genre,
            owner: userId,
        });

        await book.save();

        const user = await User.findById(userId);
        user.books.push(book._id);
        await user.save();

        res.status(201).json(book);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}


const getBook = async (req, res) => {
    try {
        const books = await Book.find()
            .select('title author genre _id')
            .populate('owner', 'username');
        res.json(books);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

export {
    postBook,
    getBook
}