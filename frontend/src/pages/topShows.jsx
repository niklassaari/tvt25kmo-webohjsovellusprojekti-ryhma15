import { useEffect, useState } from 'react';
import MovieData from '../components/moviedata';

// hakee parhaimmat arvostelut suomessa saaneet sarjat
const TopMovies = () => {

   const [movies, setMovies] = useState([]);

  
  
  useEffect(() => {
  fetch('/api/movies/topShows') 
  .then(res => res.json())
  .then(res => setMovies(res))
  .catch(err => console.error(err));
  }, []);


useEffect(() => {
    const interval = setInterval(() => { // pitäs näyttää seuraava elokuva automaattisesti mutta ei toimi jostainsyystä
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
      <h2>Highest rated shows</h2>
      <div className="movie-list">
        {movies.map(movie => ( 
            <MovieData key={movie.id}movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default TopMovies;