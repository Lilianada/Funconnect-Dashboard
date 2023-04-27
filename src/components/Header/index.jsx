import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../services/auth";
import logo from "../../image/Funconnect-logo.svg";
import { GrClose } from "react-icons/gr";
import { FiMenu } from "react-icons/fi";
import "./style.css";

export default function Header() {
  const [showMenu, setShowMenu] = useState(false);

  const isActive = () => {
    setShowMenu(!showMenu);
  };

  const closeMenu = () => {
    setShowMenu(false);
  };

  const auth = useAuth();

  return (
    <header>
      {/* Desktop Menu */}
      <div className="desktopHeader">
        <nav className="navbar">
            <NavLink
              className={({ isActive }) =>
                isActive ? "activeLink" : "navLink"
              }
              to="/"
            >
              <img src={logo} className="logo" alt="FunConnect Logo" />
            </NavLink>
          <ul className="navList">
            <li className="navItem">
              <NavLink
                className={({ isActive }) =>
                  isActive ? "activeLink" : "navLink"
                }
                to="/categories"
              >
                Categories
              </NavLink>
            </li>
            <li className="navItem">
              <NavLink
                className={({ isActive }) =>
                  isActive ? "activeLink" : "navLink"
                }
                to="/features"
              >
                Features
              </NavLink>
            </li>
            <li className="navItem">
              <NavLink
                className={({ isActive }) =>
                  isActive ? "activeLink" : "navLink"
                }
                to="/places"
              >
                Places
              </NavLink>
            </li>
            {!auth.user && (
              <li className="navItem">
                <NavLink
                  className="navLink"
                  to="/"
                >
                  Login
                </NavLink>
              </li>
            )}
          </ul>
        </nav>
      </div>

      {/* Mobile Menu */}
      <div className="mobileHeader">
        <NavLink
          className={({ isActive }) => (isActive ? "activeLink" : "navLink")}
          to="/"
        >
          <img src={logo} className="logo" alt="FunConnect Logo" />
        </NavLink>

        <button type="button" className="menuButton">
          <FiMenu size={32} stroke="white" fill="white" onClick={isActive} />
        </button>

        <nav className={`navbar ${showMenu ? "show-navbar" : "navbar"}`}>
          <button type="button" className="closeMenu" onClick={closeMenu}>
            <GrClose />
          </button>
          <ul className="navList">
            <li className="navItem">
              <h6 className="navTitle">Menu</h6>
            </li>
          </ul>

          {/* Navigation List */}
          <ul className="navList">
            <li className="navItem">
              <NavLink
                className={({ isActive }) =>
                  isActive ? "activeLink" : "navLink"
                }
                to="/categories"
              >
                Categories
              </NavLink>
            </li>

            <li className="navItem">
              <NavLink
                className={({ isActive }) =>
                  isActive ? "activeLink" : "navLink"
                }
                to="/features"
              >
                Features
              </NavLink>
            </li>

            <li className="navItem">
              <NavLink
                className={({ isActive }) =>
                  isActive ? "activeLink" : "navLink"
                }
                to="/places"
              >
                Places
              </NavLink>
            </li>

            {!auth.user && (
              <li className="navItem">
                <NavLink
                  className="navLink"
                  to="/"
                >
                  Login
                </NavLink>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
