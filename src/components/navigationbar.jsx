import React from 'react';
import './navigationbar.css';
import download from "../assets/download.png"; 
import { Link } from 'react-router-dom'


import Dropdown from 'react-bootstrap/Dropdown';


const Navbar = () => {
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

      <Dropdown.Item as={Link} to="/profile">
        Profile
      </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
    
  <form>
  <div className="form-group">
    
    <input 
    type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email"/>
  </div>

  <div className="form-group">
    <label htmlFor="exampleInputPassword1">Laske näitä alemmas css myöhemmi</label>
    <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password"/>
  </div>
</form>

        


  </div>
</nav>
);
};

export default Navbar; 