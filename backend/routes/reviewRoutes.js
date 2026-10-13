/* Set the routes here and connect them to the correct controller functions */

import express from 'express';
import { authenticateToken } from "../middleware/auth.js";

import { postReview, getReviews, removeReview } from '../controllers/reviewController.js';
const reviewRouter = express.Router();

// Public routes
reviewRouter.get('/getReviews/:movie_id', getReviews);

// Protected routes (requires authentication)
reviewRouter.post('/createReview', authenticateToken, postReview);
reviewRouter.delete('/deleteReview/:reviewId', authenticateToken, removeReview);

export default reviewRouter;