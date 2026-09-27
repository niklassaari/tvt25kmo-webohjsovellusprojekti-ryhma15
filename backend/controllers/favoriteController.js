import 'dotenv/config';
import pool from '../models/database.js';


// lisää suosikki elokuvan tietokantaan
export async function addFavorite(req,res) {
   const { movieId  } = req.body; // nää ottaa käyttäjän id ja sit ton elokuvan id talteen
   const userId = req.user.id;

    //sql kysely joka siis vie tykätyn elokuvan tietokantaan
   try {
    await pool.query(
        `INSERT INTO favorites (user_id, movie_id) 
       VALUES ($1, $2) 
       ON CONFLICT (user_id, movie_id) DO NOTHING`,
      [userId, movieId]
    );
    res.status(201).json({message: 'added to favorites'})
   } catch (error){
    console.error('error adding to favorites', error)
    res.status(500).json({error: 'database error'})
   }
}

// hakee kaikki "tykätyt" elokuvat tietokannasta, tätä käytetään esim siihen napin tilan tarkastamiseen/estämiseen

export async function getAllFavorites(req, res) {
    const userId = req.user.id
// kysely joka hakee käyttäjän "tykkäämät elokuvat"
try {
 const result = await pool.query(
    'SELECT movie_id FROM favorites WHERE user_id = $1', [userId]
 );
//muuttaa ton tietokannan arrayksi
 const favoriteId = result.rows.map(row=>row.movie_id)
 res.json(favoriteId)
} catch (error) {
console.error('Error while getting favorites')
res.status(500).json({error: 'Database error '})
}}


// pitäs poistaa ei oo testattu vielä tulee nappi sinne fronttiin favorite sivulle
//poistaa tykkäyksen elokuvasta
export async function deleteFromFavorites(req,res) {
    const { movieId,  } = req.body; 
    const userId = req.user.id;

    try {
    await pool.query(
        'DELETE FROM favorites WHERE user_id = $1 AND movie_id=$2', [userId, movieId]
    );
    res.json({message: 'deleted from favorites'})
   } catch (error){
    console.error('error removing from favorites', error)
    res.status(500).json({error: 'database error'})
   }
}
// käytetään henkilön favorite elokuvien hakemiseen ja näyttämiseen favorite sivulla
export async function getPublicFavorites(req,res) {
    const { username  } = req.params; // tän pitäs ottaa usernamen siitä urlsta
    // ettii sen käyttäjän tietokannasta ja ottaa sen talteen
    try {
        const user=await pool.query(
            'SELECT id FROM users WHERE username = $1',
            [username]
        )
        if (user.rows.length===0) {
            return res.status(404).json({
                error: 'user not found'
            })
        }
        const userId = user.rows[0].id

// hakee ne elokuvien id tietokannasta
        const favorites = await pool.query(
            'SELECT movie_id FROM favorites WHERE user_id = $1',
            [userId]
        )
        // muuttaa listaksi
        const favoriteIds = favorites.rows.map(row => row.movie_id)
        // tämä hakee niitten id perusteilla infon sieltä rajapinnasta
        const movie = await Promise.all(
            favoriteIds.map(async (movieId)=>{
                const response = await fetch( `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
                    accept: 'application/json'
                }
            }
        )
  
        const data = await response.json();
        return data;
    })
)
    res.json(movie) // vie frontendiin 

    } catch (error){
    console.error('error getting public favorites', error);
    res.status(500).json({error: 'database error'})
    }
}