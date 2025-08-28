import React, { useCallback, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "tailwindcss/tailwind.css";
import baseURL from "../../assets/baseURL";
import { BiSolidPhoneCall } from "react-icons/bi";
import Loader from "../../components/Loader";
import CarSearch from "./CarSearch";

const MyDriver = () => {
  const [products, setProducts] = useState([]);
  const [productFiltered, setProductsFiltered] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [displayedProducts, setDisplayedProducts] = useState(20);
  const productsPerPage = 20;
  const [networkError, setNetworkError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await fetch(`${baseURL}send/car/approved`);
        if (!productsResponse.ok) {
          throw new Error(`HTTP error! status: ${productsResponse.status}`);
        }
        const productsData = await productsResponse.json();
        setProducts(productsData);
        setProductsFiltered(productsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setLoading(false);
        setNetworkError(true);
      }
    };
    fetchData();
  }, []);

  const loadMoreProducts = () => {
    setDisplayedProducts(displayedProducts + productsPerPage);
  };

  const searchProducts = (text) => {
    setInput(text);
    setProductsFiltered(
      products.filter((item) => {
        const name = item.name?.toLowerCase() || "";
        const region = item.region?.toLowerCase() || "";
        const town = item.town?.toLowerCase() || "";
        const location = item.location?.toLowerCase() || "";
        return (
          name.includes(text.toLowerCase()) ||
          region.includes(text.toLowerCase()) ||
          town.includes(text.toLowerCase()) ||
          location.includes(text.toLowerCase())
        );
      })
    );
  };

  const clearSearch = () => {
    setInput("");
    setProductsFiltered(products);
  };

  return (
    <div className="flex flex-col bg-white min-h-screen md:pt-0 lg:pt-0 pt-10 font-serif">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Loader />
        </div>
      ) : (
        <div className="w-full sm:w-11/12 md:w-10/12 mx-auto">
          <div className="w-full mt-6 mb-4 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => searchProducts(e.target.value)}
              placeholder="Where are you?"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
            />
            {input && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-3 text-gray-600 hover:text-gray-800"
              >
                &#x2715;
              </button>
            )}
          </div>
          {input && <CarSearch productFiltered={productFiltered} />}
          {!input && productFiltered.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-6 p-2">
              {productFiltered.slice(0, displayedProducts).map((item) => (
                <div
                  key={item._id}
                  className="px-2 w-full md:w-auto bg-gray-200 rounded-lg shadow-md flex justify-between"
                >
                  <div className="mt-2">
                      <div className="flex gap-x-20 md:gap-x-10">
                      <img
                        src={item.carpic}
                        alt={item._id}
                        className="md:w-14 lg:w-14 w-14 object-cover rounded-full"
                      />
                      <Link
                        to={`/calldriver/${item._id}`}
                        className="mt-4 text-center h-10 text-4xl text-green-400 rounded-lg hover:bg-black"
                      >
                        <BiSolidPhoneCall />
                      </Link>
                    </div>

                  <div className="md:pt-1">
                    <h3 className="md:text-lg md:w-40 w-48 md:font-semibold truncate overflow-hidden whitespace-nowrap">
                      {item.name}
                    </h3>
                    <p className="text-sm md:font-semibold md:w-40 w-48 truncate overflow-hidden whitespace-nowrap">
                      {item.region}
                    </p>
                    <p className="text-sm md:font-semibold md:w-40 w-48 truncate overflow-hidden whitespace-nowrap">
                      {item.town}
                    </p>
                  
                    <p className="md:w-40  w-48 truncate overflow-hidden whitespace-nowrap text-sm md:font-semibold">
                      {item.location}
                    </p>

                    </div>
                  </div>
                  <div>
                    <img
                      src={item.driverpic}
                      alt={item.name}
                      className="md:w-[12vh] sm:w-[12vh] lg:w-[13vh] w-28 mt-2 object-cover rounded-lg"
                    />
                    <h1 className="text-sm md:font-semibold mt-2 md:mt-0">{item.carnum}</h1>
                  </div>
                </div>
              ))}
            </div>
          ) : !input && productFiltered.length === 0 && (
            <p className="text-center mt-4">No drivers found. Please check your internet.</p>
          )}
          {displayedProducts < productFiltered.length && (
            <button
              onClick={loadMoreProducts}
              className="mt-6 bg-black text-orange-500 px-6 py-2 rounded-lg hover:bg-gray-800"
            >
              Load More
            </button>
          )}
        </div>
      )}



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

export default MyDriver;
