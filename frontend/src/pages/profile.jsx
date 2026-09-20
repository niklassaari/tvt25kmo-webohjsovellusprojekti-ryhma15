import './profile.css'
<<<<<<< HEAD
=======
import { Link } from 'react-router-dom';

const Profile = () => {
  
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
          <div className="profile-box">
          </div>
        </div>

        <div className="profile-section">
          <h2>Groups</h2>
          <div className="profile-box">
          </div>
        </div>

      </div>

      <button className="delete-profile-button">
        Delete Profile
      </button>

<Link to="/register">
        <button>Register</button>
      </Link>
    

    </div>
  )
}
>>>>>>> origin/NiklasBranch

const Profile = () => {
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
          <div className="profile-box">
          </div>
        </div>

        <div className="profile-section">
          <h2>Groups</h2>
          <div className="profile-box">
          </div>
        </div>

      </div>

      <button className="delete-profile-button">
        Delete Profile
      </button>

    </div>
  )
}

export default Profile 