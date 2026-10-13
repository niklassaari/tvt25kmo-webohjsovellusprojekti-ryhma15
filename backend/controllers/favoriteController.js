import 'dotenv/config';
import pool from '../models/database.js';


// Adds a favourite movie to the database
export async function addFavorite(req, res) {
    const { movieId } = req.body; // nää ottaa käyttäjän id ja sit ton elokuvan id talteen
    const userId = req.user.id;


    // SQL query that sends the favourited movie to the database

    try {
        await pool.query(
            `INSERT INTO favorites (user_id, movie_id) 
       VALUES ($1, $2) 
       ON CONFLICT (user_id, movie_id) DO NOTHING`,
            [userId, movieId]
        );
        res.status(201).json({ message: 'added to favorites' })
    } catch (error) {
        console.error('error adding to favorites', error)
        res.status(500).json({ error: 'database error' })
    }
}


// Fetches all movies that the user has favourited, used when the favourite button's state is being checked, for example

export async function getAllFavorites(req, res) {
    const userId = req.user.id
    // Fetches the movies favourited by the user

    try {
        const result = await pool.query(
            'SELECT movie_id FROM favorites WHERE user_id = $1', [userId]
        );
        // Muuttaa ton tietokannan arrayksi
        const favoriteId = result.rows.map(row => row.movie_id)
        res.json(favoriteId)
    } catch (error) {
        console.error('Error while getting favorites')
        res.status(500).json({ error: 'Database error ' })
    }
}



// Removes movie from favourites

export async function deleteFromFavorites(req, res) {
    const { movieId, } = req.body;
    const userId = req.user.id;

    try {
        await pool.query(
            'DELETE FROM favorites WHERE user_id = $1 AND movie_id=$2', [userId, movieId]
        );
        res.json({ message: 'deleted from favorites' })
    } catch (error) {
        console.error('error removing from favorites', error)
        res.status(500).json({ error: 'database error' })
    }
}


// Used to fetch and display a user's favourite movies in the Favourites page

export async function getPublicFavorites(req, res) {

    const { username } = req.params; // tän pitäs ottaa usernamen siitä urlsta



    // Fetches the user's ID from the database and stores it
    try {
        const user = await pool.query(
            'SELECT id FROM users WHERE username = $1',
            [username]
        )
        if (user.rows.length === 0) {
            return res.status(404).json({
                error: 'user not found'
            })
        }
        const userId = user.rows[0].id

        // Fetches the movie ID:s from the database
        const favorites = await pool.query(
            'SELECT movie_id FROM favorites WHERE user_id = $1',
            [userId]
        )
        // Turns them into a list
        const favoriteIds = favorites.rows.map(row => row.movie_id)


        // Fetches movie info from TMDB based on the movies' ID
        const movie = await Promise.all(
            favoriteIds.map(async (movieId) => {
                const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.VITE_TMDB_TOKEN}`,
                            accept: 'application/json'
                        }
                    }
                )

                const data = await response.json();
                return data;
            })
        )
        res.json(movie) // Sends data to frontend

    } catch (error) {
        console.error('error getting public favorites', error);
        res.status(500).json({ error: 'database error' })
    }
}