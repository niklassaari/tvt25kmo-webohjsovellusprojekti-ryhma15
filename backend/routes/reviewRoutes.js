/* tänne tulee verkko osotteet ja yhistää ne oikeaan kontrolleri funktioon */

import express from 'express';
import { authenticateToken } from "../middleware/auth.js";

import { postReview, getReviews } from '../controllers/reviewController.js';
const reviewRouter=express.Router();

// Suojatut reitit
reviewRouter.post('/createReview',authenticateToken, postReview);
reviewRouter.get('/getReviews/:movie_id',authenticateToken, getReviews);

export default reviewRouter;