import jwt from "jsonwebtoken"

const generateTokenAndSetCookie = (userId, res) => {
    return new Promise((resolve, reject) => {
        jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '15d' }, (err, token) => {
            if (err) {
                console.error("Failed to generate token:", err);
                reject(new Error("Failed to generate token"));
                // res.status(500).json({ error: "Failed to generate token" });
                return;
            }

            res.cookie("jwt", token, {
                maxAge: 15 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: 'strict',
                secure: process.env.NODE_ENV === "production"
            });
            // console.log('Cookie set:', token);
            resolve();
        });
    });
}

const authenticateToken = (req, res, next) => {
    const token = req.cookies.jwt;

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
}

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
    generateTokenAndSetCookie,
    removeToken
} 
