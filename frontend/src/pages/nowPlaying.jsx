import { useEffect, useState, useRef } from 'react';
import MovieData from '../components/moviedata';


const NowPlaying = () => {

  const [movies, setMovies] = useState([]);
  const listRef = useRef(null);

  useEffect(() => {
    fetch('/api/movies/now-playing')
      .then(res => res.json())
      .then(res => setMovies(res))
      .catch(err => console.error(err));
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      if (listRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = listRef.current;


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