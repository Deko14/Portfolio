import React from "react";
import { Link, withRouter } from "react-router-dom";
import { Icon } from "@iconify/react";
import logo from "../images/logo2.png";
import { signout, isAuthenticated } from "../auth";

const isActive = (history, path) => {
  if (history.location.pathname === path) return { color: "#00a8e8" };
  else return { color: "#ffffff" };
};

const Menu = ({ history }) => (
  <div className="nav">
    <div className="left">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="Logo" className="logo2" />
        </Link>
      </div>
      <div className="volume">
        <Icon icon="eva:volume-up-fill" className="volume-icon" />
      </div>
    </div>

    <div className="center">
      <form>
        <input type="text" placeholder="Search..." name="search" />
      </form>
    </div>

    <div className="right">
      <ul className="nav-icons">
        {!isAuthenticated() && (
          <>
            <li>
              <Link to="/signin" style={isActive(history, "/signin")}>
                Sign In
              </Link>
            </li>
            <li>
              <Link to="/signup" style={isActive(history, "/signup")}>
                Sign Up
              </Link>
            </li>
          </>
        )}
        {isAuthenticated() && (
          <>
            <li>
              <Link
                to="/users"
                className="explore-icon"
                style={isActive(history, "/users")}
              >
                <Icon icon="ic:round-explore" />
              </Link>
            </li>
            <li>
              <Link
                to="/"
                className="notifications-icon"
                style={isActive(history, "/")}
              >
                <Icon icon="mdi:bell" />
              </Link>
            </li>
            <li>
              <Link
                to={`/user/${isAuthenticated().user._id}`}
                className="profile-icon"
                style={isActive(history, `/user/${isAuthenticated().user._id}`)}
              >
                <Icon icon="mdi:account" />
              </Link>
            </li>
            <li>
              <button
                style={isActive(history, "/signup")}
                className="signout"
                onClick={() => signout(() => history.push("/"))}
              >
                Sign Out
              </button>
            </li>
          </>
        )}
      </ul>
    </div>
  </div>
);

export default withRouter(Menu);
