import './profile.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/authContext';
import { useEffect } from 'react';
import MovieData from '../components/moviedata';

const Profile = () => {

  // hakee ryhmät
  const [groups, setGroups] = useState([])


  // hakee lempielokuvat
  const [movies, setMovies] = useState([]);


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { loggedIn, user, deleteprofile } = useAuth();

  const handleDeleteProfile = async () => {
    try {
      await deleteprofile(email, password);
    } catch (error) {
      console.error("Profile deletion failed:", error);
    }
  };

useEffect(() => {
    const fetchGroups = async () => {
        try {
            const response = await fetch('/api/groups/all')
            const data = await response.json()
            if (response.ok) {
                setGroups(data.groups || [])
            } else {
                setError(data.error || 'Error fetching groups')
            }
        } catch (error) {
            console.error('Error fetching groups:', error)
            setError('Network error')
        }
    };

    fetchGroups();
}, []);

useEffect(() => {
  if (!user?.username) return;

  fetch(`/api/movies/favorites/${user.username}`)
    .then(res => res.json())
    .then(res => {
      console.log("Favorites:", res);
      setMovies(res);
    })
    .catch(err => console.error(err));
}, [user]);



  return (
    <div className="profile-page">

      <h1>Profile</h1>

      <div className="profile-details">
        <p>
          <strong>Username:</strong> {user?.username}
        </p>

        <p>
          <strong>Email:</strong> {user?.email}
        </p>
      </div>

      <div className="profile-content">

        <div className="profile-section">
          <h2><strong>Favourites</strong></h2>

          <div className="profile-box favorites-box">
            <div className="favscroll">
  {movies.map(movie => (
    <div key={movie.id}>
      {movie.title}
      </div>
    
  ))}
</div>

        </div>
  </div>

        <div className="profile-section">
          <h2><strong>Groups</strong></h2>

          <div className="profile-box group-box">
            <div className="groupcroll">
{groups.map(group => (
    <div key={group.id}>
      {group.name}
    </div>
  ))}
            </div>
          </div>
        </div>

      </div>

      {loggedIn && (
        <>
          <button
            type="button"
            className="delete-profile-button"
            data-bs-toggle="modal"
            data-bs-target="#deleteProfileModal"
          >
            Delete Profile
          </button>

          <button
            type="button"
            className="favorite-btn"
          >
            Favorites
          </button>

          <div
            className="modal fade"
            id="deleteProfileModal"
            tabIndex="-1"
          >
            <div className="modal-dialog">
              <div className="modal-content">

                <div className="modal-header">
                  <h5 className="modal-title">
                    Delete Profile
                  </h5>
                </div>

                <div className="modal-body">

                  <input
                    type="email"
                    placeholder="Email"
                    className="form-control mb-3"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <input
                    type="password"
                    placeholder="Password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                </div>

                <div className="modal-footer">

                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleDeleteProfile}
                  >
                    Delete Profile
                  </button>

                </div>

              </div>
            </div>
          </div>
        </>
      )}

      {!loggedIn && (
        <Link to="/register">
          <button>
            Register
          </button>
        </Link>
      )}

    </div>
  ); 
};

export default Profile;