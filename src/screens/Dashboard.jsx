import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loggedOut} from '../Redux/actions';
import ListProducts from "./Product/ListProducts";
import {useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import baseURL from "../assets/baseURL";
import { IoArrowBack } from "react-icons/io5";
import { FcCancel } from "react-icons/fc";
import { IoMdCheckmark } from "react-icons/io";

const Dashboard = (props) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };


  const handleLogout = () => {
    dispatch(loggedOut(""));
    navigate("/loginform");
  };

  const [productList, setProductList] = useState([]);
  const [productFilter, setProductFilter] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");
  const [input, setInput] = useState("");
  const [focus, setFocus] = useState(false);

  const myProducts = useSelector((state) => state);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedToken = localStorage.getItem("keepLoggedIn");
        setToken(storedToken);

        const response = await axios.get(
          `${baseURL}fashionpost/user/${myProducts.user}`
        );
        setProductList(response.data);
        setProductFilter(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();

    return () => {
      setProductList([]);
      setProductFilter([]);
      setLoading(true);
    };
  }, [myProducts.user]);

  const searchProducts = (text) => {
    setProductFilter(
      productList.filter((i) =>
        i.name.toLowerCase().includes(text.toLowerCase())
      )
    );
  };

  const deleteProducts = async (id) => {
    try {
      await axios.put(`${baseURL}fashionpost/${id}/deactivate`);
      setProductFilter(productFilter.filter((item) => item.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const ListHeader = () => (
    <div className="flex flex-row bg-[#f5a53d] px-1 text-lg">
      <div className="w-1/6 font-semibold">Image</div>
      <div className="w-1/6 font-semibold">Image</div>
      <div className="w-1/6 font-semibold">Name</div>
      <div className="w-1/6 font-semibold">Price</div>
      <div className="w-1/6 font-semibold">Approve</div>
      <div className="w-1/6 font-semibold text-center">Views</div>
    </div>
  );


  const handleProductClick = (product) => {
    navigate(`/products/${product.id}`); // Navigate to the product detail page
  };

  return (
    <div>
    <div className="pt-28">
      <div className="flex justify-between mx-10">
        <div>
            <Link to="/building" className="mx-2">
            Housing
            </Link>
          
            </div>
        <div>
          <Link to="/shopmana">My Shop</Link>
          </div>
        <div>
          <Link to="/servmana">
          My Services
          </Link>
         
          </div>
        <div>
          <Link to={"/agricmana"} >
          My Agric
          </Link>
       
          </div>
        <div
          className="cursor-pointer text-blue-500 hover:underline"
          onClick={toggleSidebar}
        >
          Post
        </div>
      </div>

      {/* Sidebar */}
      {isSidebarOpen && (
        <div className="fixed top-0 right-0 w-64 h-full bg-gray-200 shadow-lg p-4 z-50">
          {/* Sidebar Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Post Options</h2>
            <button
              className="text-red-500 text-xl font-bold"
              onClick={toggleSidebar}
            >
              ×
            </button>
          </div>

          {/* Sidebar Links */}
          <ul className="space-y-4">
            <li>
              <Link
                to="/sigform"
                className="block text-black hover:text-blue-500"
                onClick={toggleSidebar}
              >
                Sell Single Product
              </Link>
            </li>
            <li>
              <Link
                to="/shopform"
                className="block text-black hover:text-blue-500"
                onClick={toggleSidebar}
              >
                Post Your Shop
              </Link>
            </li>
            <li>
              <Link
                to="/servicesform"
                className="block text-black hover:text-blue-500"
                onClick={toggleSidebar}
              >
                Provide Service
              </Link>
            </li>
            <li>
              <Link
                to="/agricpost"
                className="block text-black hover:text-blue-500"
                onClick={toggleSidebar}
              >
                Sell Agric Products
              </Link>
            </li>
            <li>
              <Link
                to="/housing"
                className="block text-black hover:text-blue-500"
                onClick={toggleSidebar}
              >
                Post Building/Hotel
              </Link>
            </li>
            {/* <li>
              <Link
                to="/agricpost"
                className="block text-black hover:text-blue-500"
                onClick={toggleSidebar}
              >
                Post car For Rent
              </Link>
            </li> */}
            <li>
              <Link
                to="/equipment"
                className="block text-black hover:text-blue-500"
                onClick={toggleSidebar}
              >
                Post Equipments for Rent
              </Link>
            </li>
            <li>
            <span
              className="block text-black hover:text-blue-500 cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </span>
            </li>
          </ul>
        </div>
      )}
    </div>

    
{/* Products */}

<div className="flex flex-col h-full bg-[#f5a53d] pt-6">
      {/* Header */}
      <div className="flex items-center justify-between px-4 mt-2 bg-[#f5a53d]">
        <Link to="/dash">
          <IoArrowBack size={30} />
        </Link>
        <div className="relative w-3/4 rounded-full flex items-center px-4">
          <i className="fas fa-search text-black"></i>
          <input
            type="text"
            placeholder="Search by name"
            className="w-full rounded-3xl focus:border-none h-12 border-none outline-none"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              searchProducts(e.target.value);
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full"></div>
          </div>
        ) : productFilter.length > 0 ? (
          <>
            <ListHeader />
            {productFilter.map((item, index) => (
              <div
                key={item.id}
                className={`flex items-center justify-between p-2 ${
                  index % 2 === 0 ? "bg-white" : "bg-[#f5a53d]"
                }`}
                onClick={() => handleProductClick(item)} // Add navigation on click
              >
                <img
                  src={item.picture}
                  alt="Product"
                  className="h-12 md:h-40 md:w-40 w-12 mr-2 object-cover"
                />
                <img
                  src={item.picturesec}
                  alt="Product secondary"
                  className="h-12 md:h-40 md:w-40 w-12 mr-2 object-cover"
                />
                <p  className="truncate text-sm sm:text-base md:text-lg lg:text-xl font-bold text-center w-1/4 sm:w-1/5 md:w-1/6">
                  {item.name}
                </p>
                <p className="w-1/6 truncate md:flex md:text-lg md:font-bold md:justify-center">{item.region}</p>
                <p className="w-1/6 flex justify-center md:mr-20">
                  {item.approved ? (
                    <IoMdCheckmark color="green" size={30} />
                  ) : (
                    <FcCancel size={30} />
                  )}
                </p>
                <p className="w-1/6 md:text-lg md:font-bold text-center">{item.views}</p>
              </div>
            ))}
          </>
        ) : (
          <div className="text-center text-lg font-medium">
            No products found. Please add products to manage.
          </div>
        )}
      </div>
    </div>



    </div>
  );
};

export default Dashboard;
