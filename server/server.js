import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.route.js';
import bookRoutes from './routes/books.route.js';
import exchangeRoutes from './routes/exchange.route.js';
import dbConnection from './config/db.connection.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.get('/api', (req, res) => {
    res.json("API is live")
})

app.use("/api/auth", authRoutes)
app.use('/api/books', bookRoutes);
app.use('/api/exchange-requests', exchangeRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});


app.listen(PORT, () => {
    dbConnection();
    console.log(`Server running on port ${PORT}`);
})