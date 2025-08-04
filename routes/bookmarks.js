const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Bookmark = require('../models/Bookmark');

const router = express.Router();

// GET /bookmarks?tag=x - fetch all bookmarks or filter by tag element
router.get('/', 
    [
        query('tag').optional().isString().withMessage('Tag must be a string')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            // Return first error message
            return res.status(400).json({ errors: errors.array() });
        }

        const { tag } = req.query;

        try {
            const bookmarks = tag
                ? await Bookmark.find({ tags: tag}).sort({ createdAt: -1 }) // if there is a tag in the request
                : await Bookmark.find().sort({createdAt: -1}); // if there is no tag in the request
            res.json(bookmarks);
            } catch (err) { 
                console.log(err)
                res.status(500).json({ error: 'Failed to fetch bookmarks'});
            }
});


// POST /bookmarks - create a new bookmark
router.post(
    '/', 
    [
        body('title').isString().trim().notEmpty().withMessage('Title is required'),
        body('url').isURL().withMessage('Valid URL is required'),
        body('tags').optional().isArray().withMessage('Tags must be an array'),
        body('tags.*').optional().isString().withMessage('Each tag must be a string')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            // Return first error message
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, url, tags } = req.body;

        try { 
            // Check if bookmark with the same URL already exists
            const existingURL = await Bookmark.findOne({ url });
            if (existingURL) {
                return res.status(409).json({ error: 'Bookmark with this URL already exists' });
            }
            // Check if bookmark with the same title already exists
            const existingTitle = await Bookmark.findOne({ title });
            if (existingTitle) {
                return res.status(420).json({ error: 'Bookmark with this title already exists' });
            }

            // create bookmark and write to db 
            const newBookmark = new Bookmark({ title, url, tags });
            const saved = await newBookmark.save();
            res.status(201).json(saved);
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: 'Failed to create new bookmark' });
        }
});


// PUT /bookmarks - update an existing bookmark from the db by title or URL
router.put(
  '/',
  [
    body('url').optional().isURL().withMessage('Must be a valid URL'),
    body('title').optional().isString().notEmpty().withMessage('Title must be a non-empty string'),
    body('updates').notEmpty().withMessage('Updates are required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { title, url, updates } = req.body;

    if (!title && !url) {
      return res.status(400).json({ error: 'Either title or url must be provided for update' });
    }

    const filter = title ? { title } : { url };

    try {
      const updated = await Bookmark.findOneAndUpdate(filter, updates, {
        new: true,
        runValidators: true,
      });

      if (!updated) {
        return res.status(404).json({ error: 'Bookmark not found' });
      }

      res.json(updated);
    } catch (err) {
      console.log(err)
      res.status(500).json({ error: 'Server error' });
    }
  }
);


// DELETE  /bookmarks - delete an existing bookmark from the db
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Bookmark.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }
    res.json({ message: 'Bookmark deleted successfully' });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Failed to delete bookmark' });
  }
});


module.exports = router;
