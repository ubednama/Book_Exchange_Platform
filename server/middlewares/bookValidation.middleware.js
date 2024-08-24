import mongoose from 'mongoose';

const validateBookDetails = (req, res, next) => {
    const { title, author, genre, userId } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({ error: 'Invalid or empty title' });
    }

    if (!author || typeof author !== 'string' || author.trim() === '') {
        return res.status(400).json({ error: 'Invalid or empty author' });
    }

    if (!genre || typeof genre !== 'string' || genre.trim() === '') {
        return res.status(400).json({ error: 'Invalid or empty genre' });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }

    next();
}

export default validateBookDetails;