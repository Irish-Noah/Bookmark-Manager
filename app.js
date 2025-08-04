const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

const bookmarkRoutes = require('./routes/bookmarks')
const swagger = require('./swagger')

// Swagger served
app.use('/api-docs', swagger.serve, swagger.setup)

// Routes
app.use('/bookmarks', bookmarkRoutes);

app.get('/', (req, res) => {
  res.send('Bookmark Manager API is running');
});

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
