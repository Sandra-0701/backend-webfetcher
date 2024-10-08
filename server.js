const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;  // Use Vercel's port or fallback to 5000 for local development

// Middleware
app.use(express.json());

// CORS Middleware
app.use(cors({
  origin: 'https://web-page-fetcher.vercel.app',  // Specify the exact frontend domain
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Route imports
const extractUrls = require('./routes/extractUrls');
const linkDetails = require('./routes/linkDetails');
const imageDetails = require('./routes/imageDetails');
const videoDetails = require('./routes/videoDetails');
const pageProperties = require('./routes/pageProperties');
const headingHierarchy = require('./routes/headingHierarchy');
const allDetails = require('./routes/allDetails');

// Test route
app.get('/api/test', (req, res) => {
  res.send('Server is running correctly!');
});

// Route use
app.use('/api/extract-urls', extractUrls);
app.use('/api/link-details', linkDetails);
app.use('/api/image-details', imageDetails);
app.use('/api/video-details', videoDetails);
app.use('/api/page-properties', pageProperties);
app.use('/api/heading-hierarchy', headingHierarchy);
app.use('/api/all-details', allDetails);

// Handle 404 for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Internal Server Error:', err.stack);  // Log the stack trace for better debugging
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
