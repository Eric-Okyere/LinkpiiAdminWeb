import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import Logo from "../assets/screen.png";
import { loggedOut } from "../Redux/actions";
import { MdOutlineHorizontalRule } from "react-icons/md";
import baseURL from "../assets/baseURL";
import { LuPhoneCall } from "react-icons/lu";

const NavbarCompo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [networkError, setNetworkError] = useState(false); // Track network errors
  const login = useSelector((state) => state.login);
  const loginId = useSelector((state) => state.user.id);
  const UserData = useSelector((state) => state.user);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (login && ["/loginform", "/signupform"].includes(location.pathname)) {
      navigate("/");
    }
  }, [login, location, navigate]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${baseURL}userbyid/${loginId}`);

        if (response.status === 404) {
          console.warn("User deleted from database, logging out...");
          dispatch(loggedOut());
          navigate("/signupform", { replace: true });
          return;
        }

        if (!response.ok) {
          console.warn("Unexpected server error, not logging out.");
          return;
        }

        const data = await response.json();
        if (!data || !data._id) {
          console.warn("User has no valid _id, logging out...");
          dispatch(loggedOut());
          navigate("/signupform", { replace: true });
        }
      } catch (error) {
        console.error("Network error detected:", error);
        setNetworkError(true); // Show modal on network error
      }
    };

    if (loginId) {
      fetchUserData();
    }
  }, [loginId, dispatch, navigate]);

  return (
    <div>
      <nav className="fixed top-0 left-0 w-full flex items-center justify-between bg-gray-100 p-4 shadow-md z-50">
        <Link to="/">
          <div className="flex items-center">
            <img
              src={Logo}
              className="h-12 w-12 rounded-full md:h-16 md:w-16 lg:w-16 lg:h-16 animate-rotate"
              alt="logo"
            />
            <h1 className="mx-10 text-black text-2xl font-bold font-serif">
              Linkpii
            </h1>
          </div>
        </Link>

        <div>
          {login ? (
            <>
              {["/user", "/sigform", "/shopform", "/servicesform", "/agricpost", "/housing", "/equipment"].includes(location.pathname) && (
                <div className="flex items-center space-x-4">
                  <h1 className="hidden md:block lg:block cursor-pointer text-xl font-semibold text-black" onClick={() => setIsOpen(!isOpen)}>
                    Post
                  </h1>
                  <button className="text-2xl text-black md:hidden lg:hidden" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle navigation">
                    {isOpen ? <FaTimes /> : <FaBars />}
                  </button>
                </div>
              )}
            </>
          ) : (
            <Link to="/loginform" className="block px-4 py-2 text-black hover:text-[#f5a53d] text-lg md:inline-block md:ml-auto" onClick={() => setIsOpen(false)}>
              Login
            </Link>
          )}
        </div>
      </nav>

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 w-64 h-full bg-black text-white transform ${isOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out z-50`}>
        <div className="flex justify-end m-4">
          <button onClick={() => setIsOpen(false)}>
            <FaTimes size={20} />
          </button>
        </div>

        <div className="flex justify-center">
          <img src={Logo} className="md:w-40 lg:w-40 w-32 -mt-10" alt="pic" />
        </div>

        <Link to={"/profile"} onClick={() => setIsOpen(false)}>
          <h1 className="truncate w-full mx-1">{UserData.name}</h1>
          <h1 className="truncate w-full mx-1">{UserData.email}</h1>
          <MdOutlineHorizontalRule className="w-20 mx-auto" />
        </Link>

        <ul className="space-y-4 mx-6">
          <li>
            <Link to="/user" className="block text-white hover:text-[#f5a53d]" onClick={() => setIsOpen(false)}>
              Dashboard
            </Link>
          </li>

          <h1 className="flex justify-center text-[#f5a53d] font-bold">Business Post</h1>
          <li><Link to="/sigform" className="block text-white hover:text-[#f5a53d]" onClick={() => setIsOpen(false)}>Sell Single Product</Link></li>
          <li><Link to="/shopform" className="block text-white hover:text-[#f5a53d]" onClick={() => setIsOpen(false)}>Post Your Shop</Link></li>
          <li><Link to="/servicesform" className="block text-white hover:text-[#f5a53d]" onClick={() => setIsOpen(false)}>Provide Service</Link></li>
          <li><Link to="/agricpost" className="block text-white hover:text-[#f5a53d]" onClick={() => setIsOpen(false)}>Sell Agric Products</Link></li>

          <h1 className="flex justify-center text-[#f5a53d] font-bold">Rent Post</h1>
          <li><Link to="/housing" className="block text-white hover:text-[#f5a53d]" onClick={() => setIsOpen(false)}>Post Building/Hotel</Link></li>
          <li><Link to="/equipment" className="block text-white hover:text-[#f5a53d]" onClick={() => setIsOpen(false)}>Post Equipment for Rent</Link></li>

          <h1 className="flex justify-center text-[#f5a53d] font-bold">Help</h1>
          <li>
            <Link className="flex" to={"/callcenter"}>
              <LuPhoneCall size={26} className="text-green-500" />
              <span className="block hover:text-[#f5a53d] cursor-pointer ml-4">Call Center</span>
            </Link>
          </li>
        </ul>
      </div>

      {/* Network Error Modal */}
      {networkError && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-xl font-bold text-red-500">No internet connection</h2>
          <p className="text-gray-700 mt-2">Check your internet connection and try again</p>
          <button
              className="mt-4 bg-[#f5a53d] text-white px-4 py-2 rounded-md"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavbarCompo;
