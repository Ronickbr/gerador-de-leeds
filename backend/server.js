const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const businessRoutes = require('./routes/business');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/business', businessRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Business Finder API is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
});