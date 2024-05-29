import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/Logo.png";
import { UserContext } from "../context/userContext";

const Header = () => {
  const {currentUser}=useContext(UserContext);
  return (
    <nav>
      <div className="container nav__container">
        <Link to="/" className="nav__logo">
          <img src={Logo} alt="Navbar Logo" />
        </Link>
        {currentUser?.id && <ul className="nav__menu">
          <li>
            <Link to={`/profile/${currentUser.id}`}>
              {currentUser?.name}
            </Link>
          </li>
          <li>
            <Link to="/create">
              Create Post
            </Link>
          </li>
          <li>
            <Link to="/authors">
              Authors
            </Link>
          </li>
          <li>
            <Link to="/logout">
              LogOut
            </Link>
          </li>
        </ul>}
        {!currentUser?.id && <ul className="nav__menu">
          <li>
            <Link to="/authors">
              Authors
            </Link>
          </li>
          <li>
            <Link to="/login">
              Login
            </Link>
          </li>
        </ul>}
      </div>
    </nav>
  );
};

export default Header;
