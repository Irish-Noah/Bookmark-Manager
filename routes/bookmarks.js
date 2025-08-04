const express = require('express');
const Bookmark = require('../models/Bookmark');

const router = express.Router();

// GET /bookmarks - fetch all bookmarks
router.get('/', async (req, res) => {
  try {
    const bookmarks = await Bookmark.find().sort({ createdAt: -1 });
    res.json(bookmarks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookmarks' });
  }
});

// POST /bookmarks - create a new bookmark
router.post('/', async (req, res) => {
  const { title, url, tags } = req.body;

  if (!title || !url) {
    return res.status(400).json({ error: 'Title and URL are required' });
  }

  try {
    const newBookmark = new Bookmark({ title, url, tags });
    const saved = await newBookmark.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create bookmark' });
  }
});

module.exports = router;
