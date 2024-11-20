require('dotenv').config(); 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const jobRoutes = require('./routes/jobs');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection using the environment variable for the URI
const mongoURI = process.env.MONGO_URI; // Use MONGO_URI from .env or fallback
mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); // Exit the process if MongoDB connection fails
  });

// Routes
app.use('/api/jobs', jobRoutes);

// Start the server on the port from the environment variable
const port = process.env.PORT || 5000; // Use PORT from .env or fallback
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
