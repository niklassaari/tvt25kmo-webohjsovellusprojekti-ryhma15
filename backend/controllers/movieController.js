import 'dotenv/config';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({path: path.resolve(__dirname, '../Server/.env')});

/* tänne tulee kaikki logiikka ja eri "skenaariot"/tapahtumat */


// hakee kaikki elokuvat jotka ovat nyt nähtävillä elokuvateattereissa
export async function getNowPlayingMovies(req, res) {
    try {
        const response = await fetch(
            'https://api.themoviedb.org/3/movie/now_playing?language=en-US&region=FI&page=1',
            {
                headers: {
                    Authorization: `Bearer ${process.env.VITE_TMDB_TOKEN}`,
                    accept: 'application/json'
                }
            }
        );

        if (!response.ok) {
            throw new Error('TMDB error:');
        }

        const data = await response.json();
        res.json(data.results);

    } catch (error) {
        console.error('Error while finding movies', error);
        res.status(500).json({ error: 'error while finding movies' });
    }
}


// hakee elokuvia tai sarjoja hakusanalla
// hakutuloksia voidaan suodattaa genren, vuoden ja tyypin perusteella
export async function searchMovies(req, res) {

    const searchTerm = req.query.q;
    const genre = req.query.genre;
    const year = req.query.year;
    const type = req.query.type || 'movie';

    if (!searchTerm || searchTerm.trim() === '') {
        return res.json([]);
    }

    try {

        // sallitaan vain movie tai tv
        const searchType = type === 'tv' ? 'tv' : 'movie';

        const response = await fetch(
            `https://api.themoviedb.org/3/search/${searchType}?query=${encodeURIComponent(searchTerm)}&language=en-US`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.VITE_TMDB_TOKEN}`,
                    accept: 'application/json'
                }
            }
        );

        if (!response.ok) {
            throw new Error(`TMDB error: ${response.status}`);
        }

        const data = await response.json();

        let results = data.results;

        // suodatetaan genren perusteella
        if (genre) {
            const genreId = Number(genre);

            results = results.filter(movie =>
                movie.genre_ids?.includes(genreId)
            );
        }

        // suodatetaan vuoden perusteella
        if (year) {
            results = results.filter(movie => {

                const releaseDate =
                    movie.release_date || movie.first_air_date;

                if (!releaseDate) {
                    return false;
                }

                return releaseDate.startsWith(year);
            });
        }

        res.json(results);

    } catch (error) {
        console.error('Error searching movies:', error);
        res.status(500).json({ error: 'Error searching movies' });
    }
}


// hakee parhaimmat arvosteluita saaneet elokuvat suomessa
export async function TopMovies(req, res) {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/discover/movie?sort_by=vote_average.desc&vote_count.gte=200&watch_region=FI&language=en-US`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.VITE_TMDB_TOKEN}`,
                    accept: 'application/json'
                }
            }
        );

        if (!response.ok) {
            throw new Error('TMDB error:');
        }

        const data = await response.json();
        res.json(data.results);

    } catch (error) {
        console.error('Error while finding movies', error);
        res.status(500).json({ error: 'error while finding movies' });
    }
}


// hakee parhaimmat arvosteluita saaneet sarjat suomessa
export async function TopShows(req, res) {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/discover/tv?sort_by=vote_average.desc&vote_count.gte=200&watch_region=FI&language=en-US`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.VITE_TMDB_TOKEN}`,
                    accept: 'application/json'
                }
            }
        );

        if (!response.ok) {
            throw new Error('TMDB error:');
        }

        const data = await response.json();
        res.json(data.results);

    } catch (error) {
        console.error('Error while finding movies', error);
        res.status(500).json({ error: 'error while finding movies' });
    }  
}