import 'dotenv/config';
/* tänne tulee kaikki logiikka ja eri "skenaariot"/tapahtumat */

// hakee kaikki elokuvat jotka ovat nyt nähtävillä elokuvateattereissa
export async function getNowPlayingMovies(req,res) {
    try {
        const response = await fetch(//tällä hetkellä hakee suomessa pyörivät elokuvat
            'https://api.themoviedb.org/3/movie/now_playing?language=en-US&region=FI&page=1',
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

export async function searchMovies(req, res){
    const searchTerm = req.query.q
    if (!searchTerm || searchTerm.trim()==''){
        return res.json([])
    }
    try{
        const response = await fetch(
            `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(searchTerm)}&language=en-US`,
            {
                headers:{
                    Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
                    accept: 'application/json'
                }
            }
        )
        if (!response.ok){
            throw new Error('TMDB error: ${response.status}')
        }
        const data = awaitresponse.json()
        res.json(data.results)
    }catch(error){
        console.error('Error searching movies:',error)
        res.status(500).json({error:'Error searchin movies'})
    
    }
}
//hakee parhaimmat arvosteluita saaneet elokuvat suomessa
export async function TopMovies(req,res) {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/discover/movie?sort_by=vote_average.desc&vote_count.gte=200&watch_region=FI&language=en-US`,
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

//hakee parhaimmat arvosteluita saaneet sarjat suomessa
export async function TopShows(req,res) {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/discover/tv?sort_by=vote_average.desc&vote_count.gte=200&watch_region=FI&language=en-US`,
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