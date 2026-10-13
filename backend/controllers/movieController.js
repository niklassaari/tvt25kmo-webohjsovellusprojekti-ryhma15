import 'dotenv/config';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../Server/.env') });


// Fetches movise that are currently playing in Finnish theaters (change "region=FI" to your desired region)
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


// Fetches movies and TV shows
// Results can be filtered by search term, genre, year and type. the page variable is used to get the next set of results when the "Load more" button is pressed
export async function searchMovies(req, res) {

    const searchTerm = req.query.q?.trim() || '';
    const genre = req.query.genre;
    const year = req.query.year;
    const type = req.query.type;
    const page = Number(req.query.page) || 1;

    try {

        const fetchFromTMDB = async (searchType) => {

            let url;

            // If a search term is given, the search-endpoint is used
            if (searchTerm) {
                url =
                    `https://api.themoviedb.org/3/search/${searchType}` +
                    `?query=${encodeURIComponent(searchTerm)}` +
                    `&language=en-US` +
                    `&page=${page}`;
            }

            // If there's no search term, the discover-endpoint will be used instead
            else {
                const params = new URLSearchParams();

                params.append('language', 'en-US');
                params.append('sort_by', 'popularity.desc');
                params.append('page', page);

                if (genre) {
                    params.append('with_genres', genre);
                }

                if (year) {
                    if (searchType === 'movie') {
                        params.append('primary_release_year', year);
                    } else {
                        params.append('first_air_date_year', year);
                    }
                }

                url =
                    `https://api.themoviedb.org/3/discover/${searchType}` +
                    `?${params.toString()}`;
            }

            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${process.env.VITE_TMDB_TOKEN}`,
                    accept: 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`TMDB error: ${response.status}`);
            }

            const data = await response.json();

            return data.results.map(item => ({
                ...item,
                media_type: searchType
            }));
        };


        let results = [];

        // Movie
        if (type === 'movie') {
            results = await fetchFromTMDB('movie');
        }

        // TV series
        else if (type === 'tv') {
            results = await fetchFromTMDB('tv');
        }

        // Any
        else {
            const [movies, tvShows] = await Promise.all([
                fetchFromTMDB('movie'),
                fetchFromTMDB('tv')
            ]);

            results = [...movies, ...tvShows];
        }


        // Search-endpoint isn't filtered by genre,
        // so it's done by using a search term
        if (searchTerm && genre) {
            const genreId = Number(genre);

            results = results.filter(item =>
                item.genre_ids?.includes(genreId)
            );
        }


        // Search-endpoint isn't filtered by year,
        // so it's done by using a search term
        if (searchTerm && year) {
            results = results.filter(item => {

                const releaseDate =
                    item.release_date || item.first_air_date;

                if (!releaseDate) {
                    return false;
                }

                return releaseDate.startsWith(year);
            });
        }



        // When the type is "Any", results will be sorted by popularity
        if (!type) {
            results.sort(
                (a, b) => (b.popularity || 0) - (a.popularity || 0)
            );
        }

        res.json(results);

    } catch (error) {
        console.error('Error searching movies:', error);
        res.status(500).json({ error: 'Error searching movies' });
    }
}


// Fetches the highest rated movies in Finland
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


// Fetches the highest rated TV shows in Finland
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