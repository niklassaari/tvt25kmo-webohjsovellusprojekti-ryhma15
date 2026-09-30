import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MovieData from '../components/moviedata';
import './favorites.css';
import { useAuth } from '../context/authContext';


const MyFavorites = () => {
  const { username } = useParams();
  const [movies, setMovies] = useState([]);
  const { accessToken } = useAuth();

  useEffect(() => {
    fetch(`/api/movies/favorites/${username}`)
      .then(res => res.json())
      .then(res => setMovies(res))
      .catch(err => console.error(err));
  }, [username]);

 const removeFavorite = async (movieId) =>{
  try {
    const res = await fetch('/api/movies/favorites', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        movieId: movieId
      })
    });
  
  if (res.ok) {
      setMovies(prevMovies =>
        prevMovies.filter(movie => movie.id !== movieId)
      );
    } else {
      console.error('Favoriten poisto epäonnistui');
    }

  } catch (error) {
    console.error('Virhe poistettaessa favoritea:', error);
  }
  } 


// nappi mistä favorites sivulla kopioi sen osoitteen suoraan leikepöuydälle, ei anna tällä hetkellä mitään infoo siitä että onnistuku kopio muuten kun f12 consolessa
  return (
    <div id="Favorites">
      <h2>{username} Favorites</h2>
   
   
   <button
  type="button"
  className="copyUrl-btn"
  onClick={() => {
    const input = document.createElement('input')
    input.value = window.location.href
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)

    console.log('URL kopioitu!')
   
   
    {/* tää ei toiminu jostain syystä niin tuossa ylhäällä on toinen tapa mikä ehkä toimii ja toi yliviivaus tarkottaa että toi komento on "vanhentunu tapa" pitäs silti toimia mutta pitää testata 
      <button
          type='button'
            className="copyUrl-btn"
            onClick={async()=> {
              console.log("URL KOPIO NAPPIA PAINETTIIN");
              try {
      await navigator.clipboard.writeText(window.location.href);
      console.log("URL kopioitu!");
    } catch (error) {
      console.error("URL:n kopiointi epäonnistui:", error);
    }
*/}
  }}
          >
            Share with URL
          </button>
      <div className="movie-list">
        {movies.map(movie => (
          <MovieData key={movie.id} movie={movie} isFavoritePage={true} onRemove={removeFavorite} />
        ))}
      </div>
    </div>
  );
}
export default MyFavorites;