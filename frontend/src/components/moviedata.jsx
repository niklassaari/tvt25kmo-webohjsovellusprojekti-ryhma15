import './moviedata.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useEffect, useState } from 'react';

import halfstar from '../assets/reviewstars/halfstar.png';
import fullstar from '../assets/reviewstars/fullstar.png';

import { useAuth } from '../context/authContext';

// review jutut
const API_URL = import.meta.env.VITE_API_URL;

const MovieData = ({ movie, isFavoritePage = false, onRemove }) => {

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const [currentMovie, setCurrentMovie] = useState(null); // Added current movie state

const starRating = movie.vote_average / 2;
const fullStars = Math.floor(starRating);

const [rating, setRating] = useState(0); // rating tallennetaan
const [comment, setComment] = useState(""); // review tallennus
const [reviews, setReviews] = useState([]); // reviewt

const [hoverRating, setHoverRating] = useState(0); // tähtien state

// boolean
const [isAdded, setIsAdded] = useState(false);
const { login, logout, loggedIn, accessToken } = useAuth();// hakee sen kirjautuneen henkoht tokenin ja "tilan"

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
  
const response = await fetch(`${API_URL}/reviews/getReviews/${movie.id}`,
{
method: "GET",
headers: {
          "Authorization": `Bearer ${accessToken}`
        },
credentials: "include"
}
);

  const data = await response.json();
  // TEST: näyttää palauttaako mitään arvosteluja
  console.log("Reviews data:", data);
  if (!response.ok) {
    throw new Error(data.error || "Failed to get reviews");
  }

  console.log("Reviews fetched succesfully");
  
  setReviews(data); // tallennetaan haetut reviewt stateen
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
console.log("isAdded:", isAdded); //debug
console.log("Movie ID:", movie.id); //debug

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
      {movie.title}
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
                {currentMovie?.title}
              </h5>


              <div className="modal-header-text">

                <p>
                  Genre:{movie.genre_ids}
                </p>

                <p>
                  Release date: {
                    new Date(movie.release_date)
                      .toLocaleDateString("fi-FI")
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


            


            {loggedIn && (
              <form
                className="reviewfield"

                // GPT TESTI:
                // Estetään formin normaali sivun uudelleenlataus
                // ja kutsutaan omaa makeReview-funktiota.
                onSubmit={(e) => {
                  e.preventDefault();
                  makeReview();
                }}
              >

                <h5>Write a review:</h5>

                {/* gpt paskaa tähtiä varten, testin vuoksi */}
                <div className="starrating" onMouseLeave={() => setHoverRating(0)}>
  {[1, 2, 3, 4, 5].map((star) => (
    <button
      key={star}
      type="button"
      className="star-button"
      onMouseEnter={() => setHoverRating(star)}
      onClick={() => setRating(star)}
      aria-label={`${star} / 5 stars`}
    >
      <i
        className={`bi ${
          star <= (hoverRating || rating)
            ? "bi-star-fill"
            : "bi-star"
        }`}
      />
    </button>
  ))}
</div>


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
        Genre:{movie.genre_ids}
      </p>

      <p>
        Release date: {
          new Date(movie.release_date)
            .toLocaleDateString("fi-FI")
        }
      </p>

      <p>
        Rating: {Math.round(movie.vote_average * 2) / 2}
      </p>


      <div className="review-stars">
  {[1, 2, 3, 4, 5].map((star) => {
    let icon;

    if (starRating >= star) {
      icon = "bi-star-fill";
    } else if (starRating >= star - 0.5) {
      icon = "bi-star-half";
    } else {
      icon = "bi-star";
    }

    return (
      <i
        key={star}
        className={`bi ${icon} review-star`}
        aria-hidden="true"
      />
    );
  })}
</div>

    </div>
  </div>

</div>

);
};


export default MovieData;
