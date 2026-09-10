import './moviedata.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useState } from 'react';




const MovieData = ({ movie }) => {
  
  const [currentMovie, setCurrentMovie] = useState(null); // Added current movie state

  return (
   <div className="movie">
     
  <div className="movie-poster">
    <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} name="logo" style={{ width: '90px', height: '150px' }} />
  </div>
    

  <div className="movie-card">
    
 
<button
  type="button"
  className="movie-modal-button"
  data-bs-toggle="modal"
  data-bs-target={`#movieModal-${movie.id}`}
  onClick={() => setCurrentMovie(movie)}
>
  {movie.title}
</button>

<div className="modal fade" tabIndex="-1" id={`movieModal-${movie.id}`}>
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <img src={`https://image.tmdb.org/t/p/w500${currentMovie?.poster_path}`} name="logo" style={{ width: '90px', height: '150px' }} />
        <h5 className="modal-title">{currentMovie?.title}</h5>

        
      </div>

      <div className="movie-modal-body">
        <p>{currentMovie?.overview}</p>
        <p>{currentMovie?.overview || "No overview available"}</p>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setCurrentMovie(null)}>
          Close
        </button>
      </div>
    </div>
  </div>
</div>
   
    
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