import './profile.css'
import { Link } from 'react-router-dom';
import { useState } from 'react';

const Profile = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="profile-page">

      <h1>Profile</h1>

      <div className="profile-details">
        <p>
          <strong>Username:</strong> User
        </p>

        <p>
          <strong>Email:</strong> user@example.com
        </p>
      </div>

      <div className="profile-content">

        <div className="profile-section">
          <h2>Favorites</h2>

          <div className="profile-box favorites-box">
          </div>
        </div>

        <div className="profile-section">
          <h2>Groups</h2>

          <div className="profile-box group-box">
          </div>
        </div>

      </div>

      <button
        type="button"
        className="delete-profile-button"
        data-bs-toggle="modal"
        data-bs-target="#deleteProfileModal"
      >
        Delete Profile
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
              >
                Delete Profile
              </button>

            </div>

          </div>

        </div>
      </div>

      <Link to="/register">
        <button>
          Register
        </button>
      </Link>

    </div>
  )
} 

export default Profile