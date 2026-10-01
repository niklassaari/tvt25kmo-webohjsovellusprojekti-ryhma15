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
        reviews.id,
        reviews.user_id,
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


export async function deleteReview(reviewId, userId) {
  return await pool.query(
    `DELETE FROM reviews
     WHERE id = $1 AND user_id = $2`,
    [reviewId, userId]
  );
}
