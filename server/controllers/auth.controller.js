import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import { generateToken } from "../config/authUtils.js";

export const register = async (req, res) => {
    const { username, password } = req.body;

    try {
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            username,
            password,
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const token = generateToken(user.id, res);
        res.status(201).json({ msg: 'User registered successfully', token });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        let user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const token = generateToken(user.id, res);
        res.status(200).json({ msg: 'Login successful', token });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

export const verifyUser = async(req, res) => {
    const userId = req.userId;

    try {
        const user = await User.findById(userId).select('-password -books')
        if(!user) return res.status(404).json({error: "User not found"});

        res.json({user});
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Server error' })
    }
}
