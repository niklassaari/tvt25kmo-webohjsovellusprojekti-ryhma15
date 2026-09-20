import { useEffect, useState, useRef } from 'react';
import MovieData from '../components/moviedata';


const NowPlaying = () => {

  const [movies, setMovies] = useState([]);

  /* // väliaikaisesti kommentoituna paikallista työstöä varten */
  useEffect(() => {
  fetch('/api/movies/now-playing') 
  .then(res => res.json())
  .then(res => setMovies(res))
  .catch(err => console.error(err));
  }, []);


useEffect(() => {
<<<<<<< HEAD
    const interval = setInterval(() => { // pitäs näyttää seuraava elokuva automaattisesti mutta ei toimi jostainsyystä
=======
  fetch(
    `${import.meta.env.VITE_TMDB_API_URL}/movie/now_playing?language=en-US&page=1`,
    {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
        accept: 'application/json'
      }
    }
  )
    .then(res => res.json())
    .then(res => setMovies(res.results))
    .catch(err => console.error(err));
}, []);


useEffect(() => {
    const interval = setInterval(() => {
>>>>>>> origin/NiklasBranch
      if (listRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = listRef.current;
        
        // Jos ollaan lopussa, palaa alkuun, muuten siirry 220px oikealle
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          listRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          listRef.current.scrollBy({ left: 220, behavior: 'smooth' });
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [movies]);
  return (
    <div id="Playing">
      <h2>Now in theaters</h2>
      <div className="movie-list">
        {movies.map(movie => ( 
            <MovieData key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default NowPlaying;