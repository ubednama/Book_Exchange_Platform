import jwt from "jsonwebtoken";

const generateToken = (userId) => {
    try {
        return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '15d' });
    } catch (error) {
        throw new Error('Error generating token');
    }
};

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Login or register first' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.userId = user.userId;
        next();
    });
};

const removeToken = (req, res) => {
    try {
        res.cookie('jwt', '', {
            maxAge: 0,
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === "production"
        });
        res.status(200).json({ msg: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error logging out', details: error.message });
    }
};

export {
    authenticateToken,
    generateToken,
    removeToken
}