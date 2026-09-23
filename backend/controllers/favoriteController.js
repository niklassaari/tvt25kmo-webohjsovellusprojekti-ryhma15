import 'dotenv/config';
import pool from '../models/database.js';


// lisää suosikki elokuvan tietokantaan
export async function addFavorite(req,res) {
   const { movieId,  } = req.body; 
   const userId = req.user.id;


   try {
    await pool.query(
        `INSERT INTO favorites (user_id, movie_id) 
       VALUES ($1, $2) 
       ON CONFLICT (user_id, movie_id) DO NOTHING`,
      [userId, movieId]
    );
    res.status(201).json({message: 'added to favorites'});
   } catch (error){
    console.error('error adding to favorites', error);
    res.status(500).json({error: 'database error'})
   }
}

// hakee kaikki "tykätyt" elokuvat tietokannasta

export async function getAllFavorites(req, res) {
    const userId = req.user.id;

try {
 const result = await pool.query(
    'SELECT movie_id FROM favorites WHERE user_id = $1', [userId]
 );

 const favoriteId = result.rows.map(row=>row.movie_id);
 res.json(favoriteId);
} catch (error) {
console.error('Error while getting favorites')
res.status(500).json({error: 'Database error '})
}}

//poistaa tykkäyksen elokuvasta
export async function deleteFromFavorites(req,res) {
    const { movieId,  } = req.body; 
    const userId = req.user.id;

    try {
    await pool.query(
        'DELETE FROM favorites WHERE user_id = $1 AND movie_id=$2', [userId, movieId]
    );
    res.json({message: 'deleted from favorites'});
   } catch (error){
    console.error('error removing from favorites', error);
    res.status(500).json({error: 'database error'})
   }
}
