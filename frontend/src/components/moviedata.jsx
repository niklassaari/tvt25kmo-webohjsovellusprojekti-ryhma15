import './moviedata.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useEffect, useState } from 'react';

import halfstar from '../assets/reviewstars/halfstar.png';
import fullstar from '../assets/reviewstars/fullstar.png';

import { useAuth } from '../context/authContext';

const MovieData = ({ movie }) => {
  
  const [currentMovie, setCurrentMovie] = useState(null); // Added current movie state
  const starRating = movie.vote_average / 2;
  const fullStars = Math.floor(starRating);

  // boolean
  const [isAdded, setIsAdded] = useState(false);
  const { loggedIn, accessToken } = useAuth();// hakee sen kirjautuneen henkoht tokenin ja "tilan"

// tarkistaa että elokuva ei jo ole favoriteissa
  // tässä on/oli sulkuhelvetti ne on iha päi vittua
  useEffect(()=>{
    if (!accessToken) return;// tarkistaa onko käyttäjä kirjautunu
    // tarkistaa favoritit accesstokenin avulla ja lähettää get pyynnön 
    const checkIfFavorite = async () => {
      try {
        const res = await fetch('/api/movies/favorites',{
          headers:{
            'Authorization': `Bearer ${accessToken}`
          }
        });
        // jos backendi vastaa onnistuneesti antaa elokuvien id:t
        if (res.ok) {
          const favoriteIds = await res.json();
          // vertaa backendistä saatujen elokuvien id siihen elokuvan id mitä klikkaa
          if(favoriteIds.includes(movie.id)){
          setIsAdded(true)
          }
      }
    } catch (err) {
      console.error('Virhe:', err);
  }
    };
    checkIfFavorite();
  }, [movie.id, accessToken]); // tää tarkistaa tuota joka kerta kun elokuvan ID tai toi accesstokeni muuttuu



// lisää napin painalluksesta favoritteihin. tarkastaa että jos tokenia ei ole tai elokuva on jo lisätty se keskeytyy
  const addFavorites = async () => {
  console.log("🔥 ADD FAVORITES ALKOI"); //debug
  console.log("Token:", accessToken); //debug
  console.log("isAdded:", isAdded); //debug
  console.log("Movie ID:", movie.id); //debug
    // katsoo oletko kirjautunut sisälle
    if (!accessToken){
      console.log("token puutttuu")
      return;
    } 
    // tästä on poistettu yks if lause 
    
//tekee post pyynnön ja lähettää auth jotta tietää kenen favoritteihi lisätää
    try {
      console.log("lähettää post")
      // post
     const res = await fetch('/api/movies/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          movieId: movie.id,
          title: movie.title || movie.name,
          // ei ehkä tarttee tuota title
        }),
      });
    console.log("BACKEND VASTASI");
    console.log("Status:", res.status);
    console.log("OK:", res.ok);

      if (res.ok) {
        console.log("FAVORITE LISÄTTIIN");
     setIsAdded(true) 
     //muuttaa isAdded trueksi mikä taas tekee sen että nappia ei voi painaa enää
    } else {
      console.log("favorittien lisäys ei toiminu")
    }
  } catch (err) {
  console.error('error while adding favorites:', err);
    }
};
  


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

{/* PATRIK, tuossa ylhäällä on koodi semmoselle modal napille (logout nappi), onClick jne. turhia. Tärkeä tuo alhaalla oleva koodi joka avaa sen näkymän. Sinne tunget sitten- */}
{/* sähköpostin ja salasanan ja napin. Kopsaa siis tuo modal koodi sinne rekisteröinti sivulle ja liitä semmoseen logout nappiin */}


{/*
{token && (
          <button
            className="favorites-btn"
            onClick={addFavorites}
            title="Add to favorites"
            >
              ❤️
          </button>
          )} 

            <button
            className="favorites-btn"
            onClick={addFavorites}
            disabled={isAdded}
            title={isAdded ? "Added to favorites" : "Add to favorites"}
            >
              ❤️
          </button>
*/}


<div className="modal fade" tabIndex="-1" id={`movieModal-${movie.id}`}>
  <div className="modal-dialog">
    <div className="modal-content">

      <div className="modal-header">
        <img src={`https://image.tmdb.org/t/p/w500${currentMovie?.poster_path}`} name="logo" style={{ width: '90px', height: '150px' }} />
  
    <div className="modal-header-content">
          {loggedIn && (
          <button
          type='button'
            className="favorites-btn"
            onClick={()=> {
              console.log("❤️ NAPPIA PAINETTIIN");
              addFavorites()
            }}
            disabled={isAdded}
            title={isAdded ? "Added to favorites " : "Add to favorites"}
            >
              {isAdded ? "🖤" : "❤️"}
          </button>
          )} 
          <h5 className="modal-title">{currentMovie?.title}</h5>
          <div className="modal-header-text">
      <p>Genre:{movie.genre_ids}</p>
      <p>Release date: {new Date(movie.release_date).toLocaleDateString("fi-FI")}</p>
      <p>Rating: {movie.vote_average}</p>
    </div>
  </div>
</div>

      <div className="movie-modal-body">
      
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
      <p>Rating: {Math.round(movie.vote_average * 2) / 2}</p>


<div className="review-stars">
    {/* Todella kömpelö tapa, pitää keksiä vielä jokin järkevämpi tapa toteuttaa tämä*/}
      {/* 0 - 0.5 stars */}
          {starRating < 0.5 ? (
            <img src={halfstar} className="review-star" alt="Half star"/>
          ) : null}


          {/* 0.5 - 1 star */}
          {starRating >= 0.5 && starRating < 1 ? (
            <>
              <img src={halfstar} className="review-star" alt="Half star"/>
              <img src={halfstar} className="review-star" alt="Half star" />
            </>
          ) : null}


          {/* 1 - 1.5 stars */}
          {starRating >= 1 && starRating < 1.5 ? (
            <img src={fullstar} className="review-star" alt="Full star"/>
          ) : null}


          {/* 1.5 - 2 stars */}
          {starRating >= 1.5 && starRating < 2 ? (
            <>
              <img src={fullstar} className="review-star" alt="Full star"/>
              <img src={halfstar} className="review-star" alt="Half star"/>
            </>
          ) : null}


          {/* 2 - 2.5 stars */}
          {starRating >= 2 && starRating < 2.5 ? (
            <>
              <img src={fullstar} className="review-star" alt="Full star"/>
              <img src={fullstar} className="review-star" alt="Full star"/>
            </>
          ) : null}


          {/* 2.5 - 3 stars */}
          {starRating >= 2.5 && starRating < 3 ? (
            <>
              <img src={fullstar} className="review-star" alt="Full star"/>
              <img src={fullstar} className="review-star" alt="Full star"/>
              <img src={halfstar} className="review-star" alt="Half star"/>
            </>
          ) : null}


          {/* 3 - 3.5 stars */}
          {starRating >= 3 && starRating < 3.5 ? (
            <>
              <img  src={fullstar} className="review-star" alt="Full star"/>
              <img src={fullstar} className="review-star" alt="Full star"/>
              <img src={fullstar} className="review-star" alt="Full star"/>
            </>
          ) : null}


          {/* 3.5 - 4 stars */}
          {starRating >= 3.5 && starRating < 4 ? (
            <>
              <img src={fullstar} className="review-star" alt="Full star"/>
              <img src={fullstar}  className="review-star"  alt="Full star"/>
              <img src={fullstar} className="review-star" alt="Full star"/>
              <img  src={halfstar} className="review-star" alt="Half star"/>
            </>
          ) : null}


          {/* 4 - 4.5 stars */}
          {starRating >= 4 && starRating < 4.5 ? (
            <>
              <img src={fullstar} className="review-star" alt="Full star"/>
              <img src={fullstar} className="review-star" alt="Full star"/>
              <img src={fullstar} className="review-star" alt="Full star"/>
              <img src={fullstar}  className="review-star" alt="Full star"/>
            </>
          ) : null}


          {/* 4.5 stars */}
{starRating >= 4.5 && starRating < 5 ? (
  <>
    <img src={fullstar} className="review-star" alt="Full star" />
    <img src={fullstar} className="review-star" alt="Full star" />
    <img src={fullstar} className="review-star" alt="Full star" />
    <img src={fullstar} className="review-star" alt="Full star" />
    <img src={halfstar} className="review-star" alt="Half star" />
  </>
) : null}

          {/* 5 stars */}

{starRating == 5 ? (
  <>
    <img src={fullstar} className="review-star" alt="Full star" />
    <img src={fullstar} className="review-star" alt="Full star" />
    <img src={fullstar} className="review-star" alt="Full star" />
    <img src={fullstar} className="review-star" alt="Full star" />
    <img src={fullstar} className="review-star" alt="Full star" />
  </>
) : null}
</div>
      
    </div>
  </div>
  
</div>




  );
};

export default MovieData;