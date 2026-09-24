/* tänne tulee verkko osotteet ja yhistää ne oikeaan kontrolleri funktioon */

import express from 'express';

import { addFavorite, getAllFavorites, deleteFromFavorites} from '../controllers/favoriteController.js';
import { authenticateToken } from '../middleware/auth.js'; 
import { getNowPlayingMovies,searchMovies, TopMovies, TopShows } from '../controllers/movieController.js';


const router=express.Router();

router.get('/test', (req, res) => {
  console.log("🔥 MOVIE ROUTES TEST OSUI");
  res.send("MOVIE ROUTES TOIMII");
});

router.get('/now-playing',getNowPlayingMovies);
router.get('/topMovies',TopMovies)
router.get('/topShows',TopShows)
router.get('/search', searchMovies);

router.post('/favorites', authenticateToken, addFavorite);
router.get('/favorites', authenticateToken, getAllFavorites);
router.delete('/favorites', authenticateToken, deleteFromFavorites);



export default router;