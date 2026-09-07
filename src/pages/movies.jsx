import { useEffect, useState } from 'react';

import MovieData from '../components/moviedata';
//import './movies.css';

// Mulla oli envissä nuo omat tokenit jne, muistakaa laittaa omat sitten sinne
const API_URL = import.meta.env.VITE_TMDB_API_URL;
const TOKEN = import.meta.env.VITE_TMDB_TOKEN;
const API_KEY = import.meta.env.VITE_TMBD_API_KEY

const fetchMovies = () => {

  const [movies, setMovies] = useState([]);

  // 'movie?' on sarjojen kohdalla 'tv?', eli se pitää vaan se vaihtaa jos haluaa hakea sarjoja
  // se mitä niiden getit palauttaa on kuitenkin kai samassa muodossa
  // hakusana, vuosi, jne. lisätään myös tuohon queryyn
  // genre id:n perusteella, eli pitää porukalla valikoida jotkut tietyt genret, niinkuin palaverissa todettiinki

  
  useEffect(() => {
  fetch('https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=12', {
      headers: {
        accept: 'application/json', 
        Authorization: 'Bearer ' + TOKEN}
  })

    .then(res => res.json())
  .then(res => setMovies(res.results))
  .catch(err => console.error(err));

  }, []);


  
  
  return (
    <div id="container">
      

      <div className="movie-list">
        {movies.map(movie => (
          <div key={movie.id} className="movie-card">
            <MovieData key={movie.id} movie={movie} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default fetchMovies;