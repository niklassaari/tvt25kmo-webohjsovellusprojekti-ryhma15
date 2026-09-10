import 'dotenv/config';
/* tänne tulee kaikki logiikka ja eri "skenaariot"/tapahtumat */


export async function getNowPlayingMovies(req,res) {
    try {
        const response = await fetch(
            'https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1',
            {
                headers: {
                    Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
                    accept: 'application/json'
                }
            }
        );
        if (!response.ok){
            throw new Error('TMDB error:')
        }

        const data = await response.json();
        res.json(data.results);
    } catch (error) {
        console.error('Error while finding movies',error);
        res.status(500).json({error: 'error while finding movies'});
    }
}
