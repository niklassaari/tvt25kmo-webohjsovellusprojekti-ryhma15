import './moviedata.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useEffect, useState } from 'react';

import halfstar from '../assets/reviewstars/halfstar.png';
import fullstar from '../assets/reviewstars/fullstar.png';

import { useAuth } from '../context/authContext';

// review jutut
const API_URL = import.meta.env.VITE_API_URL;


// Genre ID:t muutetaan nimiksi
const genreNames = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',

  // TV-genret
  10759: 'Action & Adventure',
  10762: 'Kids',
  10763: 'News',
  10764: 'Reality',
  10765: 'Sci-Fi & Fantasy',
  10766: 'Soap',
  10767: 'Talk',
  10768: 'War & Politics'
};


const getGenreNames = (genreIds = []) => {
  return genreIds
    .map(id => genreNames[id] || 'Unknown')
    .join(', ');
};


const MovieData = ({ movie, isFavoritePage = false, onRemove }) => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [currentMovie, setCurrentMovie] = useState(null);

  const starRating = movie.vote_average / 2;
  const fullStars = Math.floor(starRating);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);

  // boolean
  const [isAdded, setIsAdded] = useState(false);

  const { login, logout, loggedIn, accessToken } = useAuth();


  const makeReview = async () => {

    // TESTI: Näyttää selaimen konsolissa, mitä review-tietoja lähetetään
    console.log("Review data being sent:", {
      movie_id: movie.id,
      rating: rating,
      comment: comment
    });

    try {

      const response = await fetch(`${API_URL}/reviews/createReview`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        credentials: "include",
        body: JSON.stringify({
          movie_id: movie.id,
          rating: rating,
          comment: comment
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Reviewin luonti epäonnistui");
      }

      console.log("Review luotu onnistuneesti");

    } catch (error) {
      console.error(error);
    }

  };


  const loadReviews = async () => {

    try {

      const response = await fetch(
        `${API_URL}/reviews/getReviews/${movie.id}`,
        {
          method: "GET",
          credentials: "include"
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get reviews");
      }

      console.log("Reviews fetched succesfully");
      setReviews(data);

    } catch (error) {
      console.error(error);
    }

  };


  // tarkistaa että elokuva ei jo ole favoriteissa
  // tarkistaa favoritit accesstokenin avulla ja lähettää get pyynnön
  const checkIfFavorite = async () => {

    if (!accessToken) return;

    try {

      const res = await fetch('/api/movies/favorites', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      // jos backendi vastaa onnistuneesti antaa elokuvien id:t
      if (res.ok) {

        const favoriteIds = await res.json();

        // vertaa backendistä saatujen elokuvien id siihen elokuvan id mitä klikkaa
        if (favoriteIds.includes(movie.id)) {
          setIsAdded(true);
        } else {
          setIsAdded(false);
        }
      }

    } catch (err) {
      console.error('Virhe:', err);
    }

  };


  // lisää napin painalluksesta favoritteihin
  const addFavorites = async () => {

    console.log("isAdded:", isAdded);
    console.log("Movie ID:", movie.id);

    // katsoo oletko kirjautunut sisälle
    if (!accessToken) {
      console.log("token puutttuu");
      return;
    }

    try {

      console.log("lähettää post");

      const res = await fetch('/api/movies/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          movieId: movie.id,
          title: movie.title || movie.name,
        }),
      });

      console.log("backend vastas");

      if (res.ok) {
        console.log("favorite lisätttii");
        setIsAdded(true);
      } else {
        console.log("favorittien lisäys ei toiminu");
      }

    } catch (err) {
      console.error('error while adding favorites:', err);
    }

  };


  return (

    <div className="movie">

      <div className="movie-poster">

        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          name="logo"
          style={{ width: '90px', height: '150px' }}
        />

      </div>


      <div className="movie-card">

        {/* Remove from favorites button */}
        {loggedIn && isFavoritePage && (

          <button
            type="button"
            className="removeFromLikes-btn"
            onClick={() => onRemove(movie.id)}
            title="Remove from favorites"
          >
            Remove from favorites
          </button>

        )}


        {/* loadReviews testi */}
        <button
          type="button"
          className="movie-modal-button"
          data-bs-toggle="modal"
          data-bs-target={`#movieModal-${movie.id}`}
          onClick={() => {
            setCurrentMovie(movie);
            loadReviews();
            checkIfFavorite();
          }}
        >
          {movie.title || movie.name}
        </button>


        <div
          className="modal fade"
          tabIndex="-1"
          id={`movieModal-${movie.id}`}
        >

          <div className="modal-dialog">

            <div className="modal-content">

              <div className="modal-header">

                <img
                  src={`https://image.tmdb.org/t/p/w500${currentMovie?.poster_path}`}
                  name="logo"
                  style={{ width: '90px', height: '150px' }}
                />


                <div className="modal-header-content">

                  {/* Add to favorites button */}
                  {loggedIn && !isFavoritePage && (

                    <button
                      type="button"
                      className="favorites-btn"
                      onClick={() => {
                        console.log("❤️ NAPPIA PAINETTIIN");
                        addFavorites();
                      }}
                      disabled={isAdded}
                      title={
                        isAdded
                          ? "Added to favorites"
                          : "Add to favorites"
                      }
                    >
                      {isAdded ? "🖤" : "❤️"}
                    </button>

                  )}


                  <h5 className="modal-title">
                    {currentMovie?.title || currentMovie?.name}
                  </h5>


                  <div className="modal-header-text">

                    <p>
                      Genre: {getGenreNames(movie.genre_ids)}
                    </p>

                    <p>
                      Release date: {
                        new Date(
                          movie.release_date || movie.first_air_date
                        ).toLocaleDateString("fi-FI")
                      }
                    </p>

                    <p>
                      Rating: {movie.vote_average}
                    </p>

                  </div>

                </div>

              </div>


              <div className="movie-modal-body">

                <p>
                  {currentMovie?.overview || "No overview available"}
                </p>


                {/* GPT NÄYTTÄÄ OLEMASSA OLEVAT REVIEWT */}
                <div className="review-list">

                  <h5>Reviews:</h5>

                  {reviews.length === 0 ? (

                    <p>No reviews found.</p>

                  ) : (

                    reviews.map((review, index) => (

                      <div key={index} className="review">

                        <p>
                          <strong>{review.username}</strong>
                        </p>

                        <p>
                          Rating: {review.rating}
                        </p>

                        <p>
                          {review.comment}
                        </p>

                        <p>
                          {review.created_at}
                        </p>

                      </div>

                    ))

                  )}

                </div>


                {loggedIn && (

                  <form
                    className="reviewfield"
                    onSubmit={(e) => {
                      e.preventDefault();
                      makeReview();
                    }}
                  >

                    <h5>Write a review:</h5>

                    <input
                      type="number"
                      min="0.5"
                      max="5"
                      step="0.5"
                      value={rating}
                      onChange={(e) =>
                        setRating(Number(e.target.value))
                      }
                    />


                    <textarea
                      type="userReview"
                      placeholder="Enter email"
                      rows="4"
                      cols="90"
                      value={comment}
                      onChange={(e) =>
                        setComment(e.target.value)
                      }
                    />


                    <button type="submit">
                      Submit review
                    </button>

                  </form>

                )}

              </div>


              <div className="modal-footer">

                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={() => setCurrentMovie(null)}
                >
                  Close
                </button>

              </div>

            </div>

          </div>

        </div>


        <div className="movie-info">

          <p>
            Genre: {getGenreNames(movie.genre_ids)}
          </p>

          <p>
            Release date: {
              new Date(
                movie.release_date || movie.first_air_date
              ).toLocaleDateString("fi-FI")
            }
          </p>

          <p>
            Rating: {Math.round(movie.vote_average * 2) / 2}
          </p>


          <div className="review-stars">

            {/* Todella kömpelö tapa, pitää keksiä vielä jokin järkevämpi tapa toteuttaa tämä */}

            {/* 0 - 0.5 stars */}
            {starRating < 0.5 ? (
              <img
                src={halfstar}
                className="review-star"
                alt="Half star"
              />
            ) : null}


            {/* 0.5 - 1 star */}
            {starRating >= 0.5 && starRating < 1 ? (
              <>
                <img
                  src={halfstar}
                  className="review-star"
                  alt="Half star"
                />

                <img
                  src={halfstar}
                  className="review-star"
                  alt="Half star"
                />
              </>
            ) : null}


            {/* 1 - 1.5 stars */}
            {starRating >= 1 && starRating < 1.5 ? (
              <img
                src={fullstar}
                className="review-star"
                alt="Full star"
              />
            ) : null}


            {/* 1.5 - 2 stars */}
            {starRating >= 1.5 && starRating < 2 ? (
              <>
                <img
                  src={fullstar}
                  className="review-star"
                  alt="Full star"
                />

                <img
                  src={halfstar}
                  className="review-star"
                  alt="Half star"
                />
              </>
            ) : null}


            {/* 2 - 2.5 stars */}
            {starRating >= 2 && starRating < 2.5 ? (
              <>
                <img
                  src={fullstar}
                  className="review-star"
                  alt="Full star"
                />

                <img
                  src={fullstar}
                  className="review-star"
                  alt="Full star"
                />
              </>
            ) : null}


            {/* 2.5 - 3 stars */}
            {starRating >= 2.5 && starRating < 3 ? (
              <>
                <img
                  src={fullstar}
                  className="review-star"
                  alt="Full star"
                />

                <img
                  src={fullstar}
                  className="review-star"
                  alt="Full star"
                />

                <img
                  src={halfstar}
                  className="review-star"
                  alt="Half star"
                />
              </>
            ) : null}


            {/* 3 - 3.5 stars */}
            {starRating >= 3 && starRating < 3.5 ? (
              <>
                <img
                  src={fullstar}
                  className="review-star"
                  alt="Full star"
                />

                <img
                  src={fullstar}
                  className="review-star"
                  alt="Full star"
                />

                <img
                  src={fullstar}
                  className="review-star"
                  alt="Full star"
                />
              </>
            ) : null}


            {/* 3.5 - 4 stars */}
            {starRating >= 3.5 && starRating < 4 ? (
              <>
                <img
                  src={fullstar}
                  className="review-star"
                  alt="Full star"
                />

                <img
                  src={fullstar}
                  className="review-star"
                  alt="Full star"
                />

                <img
                  src={fullstar}
                  className="review-star"
                  alt="Full star"
                />

                <img
                  src={halfstar}
                  className="review-star"
                  alt="Half star"
                />
              </>
            ) : null}


            {/* 4 - 4.5 stars */}
            {starRating >= 4 && starRating < 4.5 ? (
              <>
                <img
                  src={fullstar}
                  className="review-star"
                  alt="Full star"
                />

                <img
                  src={fullstar}
                  className="review-star"
                  alt="Full star"
                />

                <img
                  src={fullstar}
                  className="review-star"
                  alt="Full star"
                />

                <img
                  src={fullstar}
                  className="review-star"
                  alt="Full star"
                />
              </>
            ) : null}


            {/* 4.5 stars */}
            {starRating >= 4.5 && starRating < 5 ? (
              <>
                <img
                  src={fullstar}
                  className="review-star"
                  alt="Full star"
                />

                <img
                  src={fullstar}
                  className="review-star"
                  alt="Full star"
                />

                <img
                  src={fullstar}
                  className="review-star"
                  alt="Full star"
                />

                <img
                  src={fullstar}
                  className="review-star"
                  alt="Full star"
                />

                <img
                  src={halfstar}
                  className="review-star"
                  alt="Half star"
                />
              </>
            ) : null}


            {/* 5 stars */}
            {starRating == 5 ? (
              <>
                <img
                  src={fullstar}
                  className="review-star"
                  alt="Full star"
                />

                <img
                  src={fullstar}
                  className="review-star"
                  alt="Full star"
                />

                <img
                  src={fullstar}
                  className="review-star"
                  alt="Full star"
                />

                <img
                  src={fullstar}
                  className="review-star"
                  alt="Full star"
                />

                <img
                  src={fullstar}
                  className="review-star"
                  alt="Full star"
                />
              </>
            ) : null}

          </div>

        </div>

      </div>

    </div>

  );
};

export default MovieData; 