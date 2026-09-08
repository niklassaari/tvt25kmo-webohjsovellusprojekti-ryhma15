import './moviedata.css';



const MovieData = ({ movie }) => {
  return (
   <div className="movie">
     
  <div className="movie-poster">
    <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} name="logo" style={{ width: '90px', height: '150px' }} />
  </div>
    

  <div className="movie-card">
    
    
      <h3 className="movie-title">{movie.title}</h3>
    
    
    <div className="movie-info">
      <p>Genre:{movie.genre_ids}</p>
      <p>Release date: {new Date(movie.release_date).toLocaleDateString("fi-FI")}</p>
      <p>Rating: {movie.vote_average}</p>
    </div>
  </div>
  
</div>
  );
};

export default MovieData;