import Book from "../models/Book.js";
import User from "../models/User.js";

const postBook = async (req, res) => {
    const { title, author, genre } = req.body;
    const userId = req.userId;

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
    const userId = req.userId;
    const {genre = 'all', author = 'all'} = req.query;
    
    try {
        let query = { owner: { $ne: userId } };

        if(genre!=='all') query.genre = genre;
        if(author!=='all') query.author = author;

        const books = await Book.find(query)
            .select('title author genre')
            .populate('owner', 'username');
        res.json(books);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

export const getUserBooks = async (req, res) => {
    const userId = req.userId;

    try {
        const user = await User.findById(userId).populate('books');
        res.json(user.books);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

export const editBook = async (req, res) => {
    const { title, author, genre } = req.body;
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

        book.title = title;
        book.author = author;
        book.genre = genre;

        await book.save();
        res.json(book);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
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
        res.status(500).send('Server error');
    }
};

export const getMatches = async(req, res) => {
    const userId = req.userId;

    try {
        const user = await User.findById(userId).populate('books');

        if (!user) {
            return res.status(404).json({ error: 'User must login first' });
        }
        
        let matches;

        const userBooks = user.books

        if (userBooks.length === 0) matches = await Book.find().populate('owner', 'username')
        else {
            const genres = userBooks.map(book => book.genre);
            const authors = userBooks.map(book => book.author);
            
            matches = await Book.find({
                $and: [{
                    $or: [
                            { genre: { $in: genres } },
                            { author: { $in: authors } }
                        ]},
                    {owner: { $ne: userId }}
                ]
            }).populate('owner', 'username');
        }

        res.json(matches);
    } catch(err) {
        console.error(err.message);
        res.status(500).send("Server error")
    }
}

export {
    postBook,
    getBook
}