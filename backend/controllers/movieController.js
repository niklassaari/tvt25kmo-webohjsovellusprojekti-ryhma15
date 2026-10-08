import 'dotenv/config';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../Server/.env') });

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


// hakee elokuvia tai sarjoja
// hakutuloksia voidaan suodattaa hakusanan, genren, vuoden ja tyypin perusteella
export async function searchMovies(req, res) {

    const searchTerm = req.query.q?.trim() || '';
    const genre = req.query.genre;
    const year = req.query.year;
    const type = req.query.type;
    const page = Number(req.query.page) || 1;

    try {

        const fetchFromTMDB = async (searchType) => {

            let url;

            // Jos hakusana on annettu, käytetään search-endpointia
            if (searchTerm) {
                url =
                    `https://api.themoviedb.org/3/search/${searchType}` +
                    `?query=${encodeURIComponent(searchTerm)}` +
                    `&language=en-US` +
                    `&page=${page}`;
            }

            // Jos hakusanaa ei ole, käytetään discover-endpointia
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


        // Search-endpoint ei suodata genreä,
        // joten tehdään se tässä hakusanaa käytettäessä
        if (searchTerm && genre) {
            const genreId = Number(genre);

            results = results.filter(item =>
                item.genre_ids?.includes(genreId)
            );
        }


        // Search-endpoint ei suodata vuotta,
        // joten tehdään se tässä hakusanaa käytettäessä
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


        // Any-haussa yhdistetyt tulokset järjestetään suosion mukaan
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