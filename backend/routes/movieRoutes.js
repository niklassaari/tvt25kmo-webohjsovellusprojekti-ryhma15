/* tänne tulee verkko osotteet ja yhistää ne oikeaan kontrolleri funktioon */

import express from 'express';

import { addFavorite, getAllFavorites, deleteFromFavorites, getPublicFavorites} from '../controllers/favoriteController.js';
import { authenticateToken } from '../middleware/auth.js'; 
import { getNowPlayingMovies,searchMovies, TopMovies, TopShows } from '../controllers/movieController.js';


const router=express.Router();

router.get('/now-playing',getNowPlayingMovies);
router.get('/topMovies',TopMovies)
router.get('/topShows',TopShows)
router.get('/search', searchMovies);

router.post('/favorites', authenticateToken, addFavorite);
router.get('/favorites', authenticateToken, getAllFavorites);
router.delete('/favorites', authenticateToken, deleteFromFavorites);

// tää sitä varten että kaikki näkee sen sun favoritet
router.get('/favorites/:username', getPublicFavorites);



export default router;