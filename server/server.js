import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import dbConnection from './config/db.connection.js';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.get('/api', (req, res) => {
    res.json("API is live")
})

app.use("/api", routes)

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});


app.listen(PORT, () => {
    dbConnection();
    console.log(`Server running on port ${PORT}`);
})