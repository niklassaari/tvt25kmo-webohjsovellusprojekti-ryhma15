/* tänne tulee verkko osotteet ja yhistää ne oikeaan kontrolleri funktioon */

import express from 'express';

import { getNowPlayingMovies,searchMovies, TopMovies, TopShows } from '../controllers/movieController.js';
const router=express.Router();
router.get('/now-playing',getNowPlayingMovies);
router.get('/topMovies',TopMovies)
router.get('/topShows',TopShows)
router.get('/search', searchMovies);

export default router;