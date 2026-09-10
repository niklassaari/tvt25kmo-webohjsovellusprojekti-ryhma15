import { useState } from 'react';
import { SearchMovies } from '../../../backend/GetMovie';
import MovieData from '../components/moviedata';



const Movies = () => {

  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('') 
  

  
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      const results = await SearchMovies(searchTerm);
      
      // Testausta varten että consolessa näkyy mitä palauttaa
      console.log("Search results:", results);

      setMovies(results);
    } catch(err){
      console.error('Error while searching a movie', err);
    }
  };


  return (
    <div id="container">
      
      <h1>Elokuvahaku</h1>

   
    <form id="search-form" onSubmit={handleSearch}>
<input type="text" id="search-input" placeholder="Syötä elokuvan nimi..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />        
        <button type="submit">Hae</button>
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