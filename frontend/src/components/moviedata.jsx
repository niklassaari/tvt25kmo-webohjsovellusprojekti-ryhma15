import './moviedata.css';


const MovieData = ({ movie }) => {
  return (
    <div className="movie-card">
      <h3>{movie.title}</h3>
      <p>{movie.genre_ids}</p>
      <p>{movie.release_date}</p>
      <p>{movie.vote_average}</p>
    </div>
  );
};

export default MovieData;