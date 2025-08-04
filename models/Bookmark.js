const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  tags: {
    type: [String],
    default: []
  }
}, {
  timestamps: true  // Adds createdAt and updatedAt fields automatically
});

module.exports = mongoose.model('Bookmark', bookmarkSchema);
