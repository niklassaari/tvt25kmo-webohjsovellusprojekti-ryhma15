import 'dotenv/config';
import pool from '../models/database.js';

export async function addReview(userId, movie_id, rating, comment) {
// lisää arvostelun tietokantaan
    
        return await pool.query(
            `INSERT INTO reviews (user_id, movie_id, rating, comment, created_at)
             VALUES ($1, $2, $3, $4, NOW())
             ON CONFLICT (user_id, movie_id) DO NOTHING`,
            [userId, movie_id, rating, comment]
        );
}
   
// hakee kaikki elokuvan arvostelut

export async function fetchReviews(movie_id) {
    
    return await pool.query(
        `SELECT 
            users.username,
            reviews.rating,
            reviews.comment,
            reviews.created_at
         FROM reviews
         JOIN users ON reviews.user_id = users.id
         WHERE reviews.movie_id = $1
         ORDER BY reviews.created_at DESC`,
        [movie_id]
    );
}