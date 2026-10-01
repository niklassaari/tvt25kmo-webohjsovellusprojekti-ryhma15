import { useState } from 'react';
import { SearchMovies } from '../GetMovie';
import MovieData from '../components/moviedata';
import '../components/movies.css';

const Movies = () => {

  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [genre, setGenre] = useState('');
  const [year, setYear] = useState('');
  const [type, setType] = useState('movie');

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchTerm.trim()) return;

    try {
      const results = await SearchMovies(
        searchTerm,
        genre,
        year,
        type
      );

      console.log("Search results:", results);

      setMovies(results);

    } catch (err) {
      console.error('Error while searching a movie', err);
    }
  };

  return (
    <div id="container">

      <h1>Elokuvahaku</h1>

      <form id="search-form" onSubmit={handleSearch}>

        <input
          type="text"
          id="search-input"
          placeholder="Syötä elokuvan tai sarjan nimi..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="movie">Movie</option>
          <option value="tv">TV series</option>
        </select>

        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        >
          <option value="">All genres</option>
          <option value="28">Action</option>
          <option value="12">Adventure</option>
          <option value="16">Animation</option>
          <option value="35">Comedy</option>
          <option value="80">Crime</option>
          <option value="99">Documentary</option>
          <option value="18">Drama</option>
          <option value="14">Fantasy</option>
          <option value="27">Horror</option>
          <option value="9648">Mystery</option>
          <option value="10749">Romance</option>
          <option value="878">Science Fiction</option>
          <option value="53">Thriller</option>
        </select>

        <input
          type="number"
          placeholder="Year"
          min="1900"
          max="2100"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />

        <button type="submit">
          Hae
        </button>

      </form>

      <div className="movie-list">
        {movies.map(movie => (
          <div key={movie.id} className="movie-card">
            <MovieData movie={movie} />
          </div>
        ))}
      </div>

    </div>
  );
};

export default Movies; 