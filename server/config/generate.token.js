import jwt from "jsonwebtoken"

const generateTokenAndSetCookie = (userId, res) => {
    jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '15d' }, (err, token) => {
        if (err) {
            console.error("Failed to generate token:", err);
            return res.status(500).json({ error: "Failed to generate token" });
        }

        res.cookie("jwt", token, {
            maxAge: 15 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === "production"
        });

        res.status(200).json({ message: 'Authentication successful', token });
    });
}

export default generateTokenAndSetCookie;