import React from 'react';
import './navigationbar.css';
import download from "../assets/download.png"; 
import { Link } from 'react-router-dom'

import Dropdown from 'react-bootstrap/Dropdown';

// login jutut
import { useState } from 'react';
import { useAuth } from "../context/authContext";



const Navbar = () => {
  
  //login jutut
   const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, logout, loggedIn } = useAuth();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      await login(email, password);

      // Login onnistui
      console.log("Login successful");

    } catch (error) {
      console.error(error);
    }
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      console.log("Logout successful");
    } catch (error) {
      console.error(error);
    }
  };



  return (

<nav className="navbar">
  <div className="navbar-left">
    <Link to="/">
    <img src={download} alt="ShopNow logo" />
  </Link>

  <Dropdown className="navbar-left-dropdown">

      <Dropdown.Toggle variant="success" id="dropdown-basic">
      test
      </Dropdown.Toggle>

       <Dropdown.Menu>
      <Dropdown.Item as={Link} to="/groups">
        Groups
      </Dropdown.Item>

      <Dropdown.Item as={Link} to="/Movies">
        Movies
      </Dropdown.Item>

{!loggedIn && (
<Dropdown.Item as={Link} to="/Register">
        Register
      </Dropdown.Item>
)}

<Dropdown.Item as={Link} to="/Moviestesti">
        Testi
      </Dropdown.Item>
       

      <Dropdown.Item as={Link} to="/Profile">
        Profile
      </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  

    
      
{!loggedIn ? (
     <form onSubmit={handleLogin}>
  <div className="form-group">
    
    <input 
    type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" 
    value={email} onChange={(event) => setEmail(event.target.value)}/>
  </div>

  <div className="form-group">
    <label htmlFor="exampleInputPassword1"></label>
    <input 
    type="password" className="form-control" id="exampleInputPassword1" placeholder="Password"
    value={password} onChange={(event) => setPassword(event.target.value)}
    />
  </div>

 <button type="submit">
        Login
      </button>
</form>
) : (
    <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>    
 )}

  </div>
</nav>
);
};

export default Navbar; 