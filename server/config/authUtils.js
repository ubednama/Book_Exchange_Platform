import jwt from "jsonwebtoken"

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '15d' });
};

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ msg: 'Login or Register first' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ msg: 'Invalid token' });
        }
        req.userId = user.userId;
        next();
    });
};

const removeToken = (req, res) => {
    res.cookie('jwt', '', {
        maxAge: 0,
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === "production"
    });
    res.status(200).json({ msg: 'Logged out successfully' });
}

export {
    authenticateToken,
    generateToken,
    removeToken
} 
