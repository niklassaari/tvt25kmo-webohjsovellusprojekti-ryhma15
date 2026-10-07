/* tänne tulee verkko osotteet ja yhistää ne oikeaan kontrolleri funktioon */

import express from 'express';
import { authenticateToken } from "../middleware/auth.js";

import { postReview, getReviews, removeReview } from '../controllers/reviewController.js';
const reviewRouter=express.Router();

// Julkiset reitit
reviewRouter.get('/getReviews/:movie_id', getReviews);

// Suojatut reitit
reviewRouter.post('/createReview',authenticateToken, postReview);
reviewRouter.delete('/deleteReview/:reviewId', authenticateToken, removeReview);

export default reviewRouter;