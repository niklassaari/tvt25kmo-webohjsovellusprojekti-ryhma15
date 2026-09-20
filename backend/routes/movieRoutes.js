/* tänne tulee verkko osotteet ja yhistää ne oikeaan kontrolleri funktioon */

import express from 'express';

import { getNowPlayingMovies, searchMovies } from '../controllers/movieController.js';
const router=express.Router();
router.get('/now-playing',getNowPlayingMovies);
router.get('/search', searchMovies);
<<<<<<< HEAD

=======
>>>>>>> origin/NiklasBranch

export default router;