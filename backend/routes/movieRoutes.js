/* tänne tulee verkko osotteet ja yhistää ne oikeaan kontrolleri funktioon */

import express from 'express';

import { getNowPlayingMovies } from '../controllers/movieController.js';
const router=express.Router();
router.get('/now-playing',getNowPlayingMovies);


export default router;