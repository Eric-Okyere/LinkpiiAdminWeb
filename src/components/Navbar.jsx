import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../assets/screen.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-[#f2f2f2] p-4 fixed w-full z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-black flex w-7 text-xl font-bold font-serif">
          <img src={Logo} alt="logo" />
          <h1>LinkPii</h1>
        </div>

        {/* Responsive Toggle Button */}
        <button className="lg:hidden text-black focus:outline-none" onClick={toggleNavbar}>
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          )}
        </button>

        {/* Navigation Links */}
        <ul className={`lg:flex hidden space-x-4 ${isOpen ? 'hidden' : 'lg:flex'}`}>
          <li className={`text-black hover:text-blue-200  font-bold font-uniquifier ${location.pathname === '/calls' ? 'bg-green-300' : ''}`}>
            <Link to="/calls">
              Calls
            </Link>
          </li>
          <li className={`text-black hover:text-blue-200  font-bold font-uniquifier ${location.pathname === '/fashion' ? 'bg-green-300' : ''}`}>
            <Link to="/fashion">
              General
            </Link>
          </li>
          <li className={`text-black hover:text-blue-200 font-bold font-uniquifier ${location.pathname === '/approvedfashion' ? 'bg-green-300' : ''}`}>
            <Link to="/approvedfashion">
              Approved General
            </Link>
          </li>
          <li className={`text-black hover:text-blue-200 font-bold font-uniquifier   ${location.pathname === '/' ? 'bg-green-300' : ''}`}>
            <Link to="/">
              All Agric
            </Link>
          </li>
          <li className={`text-black font-bold font-uniquifier hover:text-blue-200  ${location.pathname === '/approved' ? 'bg-green-300' : ''} `}>
            <Link to="/approved" >
              Approved Agric
            </Link>
          </li>
          <li className={`text-black hover:text-blue-200 font-bold font-uniquifier   ${location.pathname === '/cars' ? 'bg-green-300' : ''}`}>
            <Link to="/cars">
              All Cars
            </Link>
          </li>
          <li className={`text-black hover:text-blue-200 font-bold font-uniquifier   ${location.pathname === '/approvedcars' ? 'bg-green-300' : ''}`}>
            <Link to="/approvedcars" >
              Approved Cars
            </Link>
          </li>

          <li className={`text-black hover:text-blue-200 font-bold font-uniquifier   ${location.pathname === '/mechanics' ? 'bg-green-300' : ''}`}>
            <Link to="/mechanics" >
              All Mechanics
            </Link>
          </li>

          <li className={`text-black hover:text-blue-200 font-bold font-uniquifier  ${location.pathname === '/postadvert' ? 'bg-green-300' : ''} `}>
            <Link to="/postadvert">
              Post Advert
            </Link>
          </li>
          <li className={`text-black hover:text-blue-200 font-bold font-uniquifier  ${location.pathname === '/advert' ? 'bg-green-300' : ''} `}>
            <Link to="/advert" >
              Advert Page
            </Link>
          </li>
          
          <li className={`text-black font-bold font-uniquifier hover:text-blue-200   ${location.pathname === '/users' ? 'bg-green-300' : ''}`}>
            <Link to="/users" >
              All Users
            </Link>
          </li>
        </ul>

        {/* Sidebar */}
        <div className={`lg:hidden fixed inset-0 bg-opacity-75 z-20 ${isOpen ? 'block' : 'hidden'}`} onClick={toggleNavbar}></div>
        <div className={`lg:hidden fixed inset-y-0 left-0 w-64 bg-[#f2f2f2] overflow-y-auto z-30 transform transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          {/* Sidebar Content */}
          <ul className="py-4 font-uniquifier font-bold">
          <li className={`px-4 py-2 text-gray-700 hover:text-gray-200    ${location.pathname === '/calls' ? 'bg-green-300' : ''}`}>
              <Link to="/calls">
                Calls
              </Link>
            </li>
          <li className={`px-4 py-2 text-gray-700 hover:text-gray-200    ${location.pathname === '/fashion' ? 'bg-green-300' : ''}`}>
              <Link to="/fashion">
                General
              </Link>
            </li>
            <li className={`px-4 py-2 text-gray-700 hover:text-gray-200    ${location.pathname === '/approveGeneral' ? 'bg-green-300' : ''}`}>
              <Link to="/approvedfashion">
                Approved General
              </Link>
            </li>
            <li className={`px-4 py-2 text-gray-700 hover:text-gray-200    ${location.pathname === '/' ? 'bg-green-300' : ''}`}>
              <Link to="/">
                All Agric
              </Link>
            </li>
            <li className={`px-4 py-2 text-gray-700 hover:bg-gray-200  ${location.pathname === '/approved' ? 'bg-green-300' : ''}`}>
              <Link to="/approved" >
                Approved Agric
              </Link>
            </li>
            <li className={`px-4 py-2 text-gray-700 hover:bg-gray-200  ${location.pathname === '/cars' ? 'bg-green-300' : ''}`}>
              <Link to="/cars">
                All Cars
              </Link>
            </li>
            <li className={`px-4 py-2 text-gray-700 hover:bg-gray-200  ${location.pathname === '/approvedcars' ? 'bg-green-300' : ''}`}>
              <Link to="/approvedcars" >
                Approved Cars
              </Link>
            </li>

            <li className={`px-4 py-2 text-gray-700 hover:bg-gray-200  ${location.pathname === '/mechanics' ? 'bg-green-300' : ''}`}>
            <Link to="/mechanics" >
              All Mechanics
            </Link>
          </li>


            <li className={`px-4 py-2 text-gray-700 hover:bg-gray-200  ${location.pathname === '/postadvert' ? 'bg-green-300' : ''}`}>
              <Link to="/postadvert">
                Post Advert
              </Link>
            </li>
            <li className={`px-4 py-2 text-gray-700 hover:bg-gray-200  ${location.pathname === '/advert' ? 'bg-green-300' : ''}`}>
              <Link to="/advert" >
                Advert Page
              </Link>
            </li>
            <li className={`px-4 py-2 text-gray-700 hover:bg-gray-200  ${location.pathname === '/users' ? 'bg-green-300' : ''}`}>
              <Link to="/users" >
                All Users
              </Link>
            </li>
            <li className={`px-4 py-2 text-gray-700 hover:bg-gray-200  ${location.pathname === '/airtelcode' ? 'bg-green-300' : ''}`}>
              <Link to="/airtelcode" >
                Post Airtel
              </Link>
            </li>
            <li className={`px-4 py-2 text-gray-700 hover:bg-gray-200  ${location.pathname === '/airtel' ? 'bg-green-300' : ''}`}>
              <Link to="/airtel">
                Airtel Code
              </Link>  
            </li>
            <li className={`px-4 py-2 text-gray-700 hover:bg-gray-200  ${location.pathname === '/mtn' ? 'bg-green-300' : ''}`}>
              <Link to="/mtn" >
               MTN Codes
              </Link>  
            </li>
            <li className={`px-4 py-2 text-gray-700 hover:bg-gray-200  ${location.pathname === '/mtnpost' ? 'bg-green-300' : ''}`}>
              <Link to="/mtnpost" >
               MTN Post
              </Link>  
            </li>
            <li className={`px-4 py-2 text-gray-700 hover:bg-gray-200 ${location.pathname === '/vodafonepost' ? 'bg-green-300' : ''}`}>
              <Link to="/vodafonepost">
               Vodafone Post
              </Link>  
            </li>
            <li className={`px-4 py-2 text-gray-700 hover:bg-gray-200 ${location.pathname === '/vodafone' ? 'bg-green-300' : ''}`}>
              <Link to="/vodafone" >
               Vodafone Codes
              </Link>  
            </li>
            <li className={`px-4 py-2 text-gray-700 hover:bg-gray-200 ${location.pathname === '/emergencypost' ? 'bg-green-300' : ''}`}>
              <Link to="/emergencypost" >
               Post Emergency
              </Link>  
            </li>
            <li className={`px-4 py-2 text-gray-700 hover:bg-gray-200 ${location.pathname === '/emergency' ? 'bg-green-300' : ''}`}>
              <Link to="/emergency" >
               Emergency Codes
              </Link>  
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
