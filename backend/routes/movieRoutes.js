/* Set the routes here and connect them to the correct controller functions */

import express from 'express';

import {
    getNowPlayingMovies,
    searchMovies,
    TopMovies,
    TopShows
} from '../controllers/movieController.js';

import {
    addFavorite,
    getAllFavorites,
    deleteFromFavorites,
    getPublicFavorites
} from '../controllers/favoriteController.js';

import { authenticateToken } from '../middleware/auth.js';


const router = express.Router();

router.get('/now-playing', getNowPlayingMovies);
router.get('/topMovies', TopMovies);
router.get('/topShows', TopShows);
router.get('/search', searchMovies);

router.post('/favorites', authenticateToken, addFavorite);
router.get('/favorites', authenticateToken, getAllFavorites);
router.delete('/favorites', authenticateToken, deleteFromFavorites);


router.get('/favorites/:username', getPublicFavorites);


export default router; 