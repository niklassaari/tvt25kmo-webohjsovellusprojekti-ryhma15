import { useState } from 'react';
import { SearchMovies } from '../GetMovie';
import MovieData from '../components/moviedata';
import '../components/movies.css';

const Movies = () => {

  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [genre, setGenre] = useState('');
  const [year, setYear] = useState('');
  const [type, setType] = useState('');

  const [page, setPage] = useState(1);

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const results = await SearchMovies(
        searchTerm,
        genre,
        year,
        type,
        1
      );

      console.log("Search results:", results);

      setMovies(results);
      setPage(1); // Resettaa tulokset sivu 1:een kun tekee uuden haun

    } catch (err) {
      console.error('Error while searching a movie', err);
    }
  };

  // Hakee lisää elokuvia kun scrollaa sivun loppuun 
const LoadMore = async () => {
  try {
    const nextPage = page + 1;

    const results = await SearchMovies(
      searchTerm,
      genre,
      year,
      type,
      nextPage
    );

    setMovies(prevMovies => [
      ...prevMovies,
      ...results
    ]);

    setPage(nextPage);

  } catch (err) {
    console.error('Error while loading more movies', err);
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
          <option value="">Any</option>
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
          <div key={`${movie.media_type || type}-${movie.id}`} className="movie-card">
            <MovieData movie={movie} />
          </div>
        ))}
      </div>

{movies.length > 0 && (
  <button onClick={LoadMore} className="loadMore-button" style={{ marginBottom: '20px' }}>
    Load more
  </button>
)}

    </div>
  );
};

export default Movies;