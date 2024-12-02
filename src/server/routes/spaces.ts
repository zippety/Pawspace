import express from 'express';
import { z } from 'zod';
import Space from '../models/Space.js';

const router = express.Router();

// Validation schemas
const searchQuerySchema = z.object({
  query: z.string().optional(),
  location: z.string().optional(),
  minPrice: z.string().transform(Number).optional(),
  maxPrice: z.string().transform(Number).optional(),
  minRating: z.string().transform(Number).optional(),
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('12')
});

// Search spaces
router.get('/search', async (req, res) => {
  try {
    const {
      query,
      location,
      minPrice,
      maxPrice,
      minRating,
      page,
      limit
    } = searchQuerySchema.parse(req.query);

    // Build search query
    const searchQuery: any = {};

    // Text search if query is provided
    if (query) {
      searchQuery.$text = { $search: query };
    }

    // Location filter
    if (location) {
      searchQuery.location = { $regex: location, $options: 'i' };
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      searchQuery.price = {};
      if (minPrice !== undefined) searchQuery.price.$gte = minPrice;
      if (maxPrice !== undefined) searchQuery.price.$lte = maxPrice;
    }

    // Rating filter
    if (minRating !== undefined) {
      searchQuery.rating = { $gte: minRating };
    }

    // Execute search with pagination
    const skip = (page - 1) * limit;
    const [spaces, total] = await Promise.all([
      Space.find(searchQuery)
        .sort({ score: { $meta: 'textScore' } })
        .skip(skip)
        .limit(limit)
        .select('-owner'),
      Space.countDocuments(searchQuery)
    ]);

    res.json({
      spaces,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(400).json({
      error: error instanceof z.ZodError
        ? 'Invalid search parameters'
        : 'Search failed'
    });
  }
});

// Get space by ID
router.get('/:id', async (req, res) => {
  try {
    const space = await Space.findById(req.params.id).select('-owner');
    if (!space) {
      return res.status(404).json({ error: 'Space not found' });
    }
    res.json(space);
  } catch (error) {
    console.error('Get space error:', error);
    res.status(400).json({ error: 'Failed to fetch space' });
  }
});

// Get suggested spaces
router.get('/suggested', async (req, res) => {
  try {
    const location = req.query.location as string;
    if (!location) {
      return res.status(400).json({ error: 'Location is required' });
    }

    const spaces = await Space.find({
      location: { $regex: location, $options: 'i' }
    })
      .sort({ rating: -1 })
      .limit(6)
      .select('-owner');

    res.json(spaces);
  } catch (error) {
    console.error('Suggested spaces error:', error);
    res.status(400).json({ error: 'Failed to fetch suggested spaces' });
  }
});

export default router;
