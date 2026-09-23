/* tänne tulee verkko osotteet ja yhistää ne oikeaan kontrolleri funktioon */

import express from 'express';

import { addFavorite, getAllFavorites, deleteFromFavorites} from '../controllers/favoritesController.js';
import { authenticateToken } from '../middleware/auth.js'; 
import { getNowPlayingMovies,searchMovies, TopMovies, TopShows } from '../controllers/movieController.js';

const router=express.Router();
router.get('/now-playing',getNowPlayingMovies);
router.get('/topMovies',TopMovies)
router.get('/topShows',TopShows)
router.get('/search', searchMovies);

router.post('./favorites', authenticateToken, addFavorite);
router.post('./favorites', authenticateToken, getAllFavorites);
router.post('./favorites', authenticateToken, deleteFromFavorites);


export default router;