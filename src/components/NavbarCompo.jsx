import { useState } from "react";
import Logo from "../assets/screen.png";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";



const NavbarCompo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const login = useSelector((state) => state.login);

console.log(login)

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <nav className="fixed top-0 left-0 w-full flex items-center justify-between bg-gray-100 p-4 shadow-md z-50">
        {/* Logo and Title */}
        <Link to="/">
          <div className="flex items-center">
            <img
              src={Logo}
              className="h-12 w-12 rounded-full md:h-16 md:w-16 animate-rotate"
              alt="logo"
            />
            <h1 className="mx-10 text-black text-2xl font-bold font-serif">Linkpii</h1>
          </div>
        </Link>

        {/* Hamburger Icon for Small Screens */}
        <button
          className="text-2xl md:hidden text-black"
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Navigation Links */}
        <div
          className={`${
            isOpen ? "block" : "hidden"
          } absolute top-16 left-0 w-full bg-gray-100 shadow-md md:static md:flex md:space-x-6 md:items-center md:shadow-none`}
        >
          {login ? (
            <Link
              to="/dash"
              className="block px-4 py-2 text-black hover:text-blue-500 text-lg md:inline-block md:ml-auto"
              onClick={() => setIsOpen(false)}
            >
              My Dashboard
            </Link>
          ) : (
            <Link
              to="/loginform"
              className="block px-4 py-2 text-black hover:text-blue-500 text-lg md:inline-block md:ml-auto"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
          )}
         
        </div>
      </nav>
    </div>
  );
};

export default NavbarCompo;
