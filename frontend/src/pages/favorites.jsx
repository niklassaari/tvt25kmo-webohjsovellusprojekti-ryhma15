import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MovieData from '../components/moviedata';
import './favorites.css';

const MyFavorites = () => {
  const { username } = useParams();
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch(`/api/movies/favorites/${username}`)
      .then(res => res.json())
      .then(res => setMovies(res))
      .catch(err => console.error(err));
  }, [username]);

  return (
    <div id="Favorites">
      <h2>{username} Favorites</h2>

      <div className="movie-list">
        {movies.map(movie => (
          <MovieData key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default MyFavorites;