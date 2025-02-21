import React, { useCallback, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "tailwindcss/tailwind.css";
import baseURL from "../../assets/baseURL";
import { BiSolidPhoneCall } from "react-icons/bi";
import Loader from "../../components/Loader";
import SearchMechanic from "./SearchMechanic";
import { MdCancel } from "react-icons/md";

const Mechanics = () => {
  const [products, setProducts] = useState([]);
  const [productFiltered, setProductsFiltered] = useState([]);
  const [focus, setFocus] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [displayedProducts, setDisplayedProducts] = useState(20);
  const productsPerPage = 20;
  const [regionInput, setRegionInput] = useState(""); 
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await fetch(`${baseURL}newmechmain/approved`);
        // console.log(productsResponse);
        if (!productsResponse.ok) {
          throw new Error(`HTTP error! status: ${productsResponse.status}`);
        }
        const productsData = await productsResponse.json();
        // console.log(productsData);

        setProducts(productsData);
        setProductsFiltered(productsData);
        setLoading(false); // Set loading to false after fetching
      } catch (error) {
        console.error("Error fetching data: ", error);
        setLoading(false); // Ensure loading is set to false even on error
      }
    };

    fetchData();
  }, []);



  const searchProducts = (text) => {
    setInput(text);
    setProductsFiltered(
      products.filter((item) => {
        const name = item.name?.toLowerCase() || "";
        const description = item.description?.toLowerCase() || "";

        return (
          name.includes(text.toLowerCase()) ||
          description.includes(text.toLowerCase())
        );
      })
    );
  };

  const searchByRegion = (text) => {
    setRegionInput(text);
    setProductsFiltered(
      products.filter((item) => {
        const region = item.region?.toLowerCase() || "";
        const town = item.town?.toLowerCase() || "";
        const location = item.location?.toLowerCase() || "";

        return (
          region.includes(text.toLowerCase()) ||
          town.includes(text.toLowerCase()) || 
          location.includes(text.toLowerCase())
        );
      })
    );
  };

  const clearSearch = () => {
    setInput("");
    setRegionInput(""); // Clear region input as well
    setProductsFiltered(products);
  };


  const loadMoreProducts = () => {
    setDisplayedProducts(displayedProducts + productsPerPage);
  };

  return (
    <div className="flex flex-col bg-white min-h-screen md:pt-0 lg:pt-0 md:-mt-14 -mt-10 font-serif">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Loader />
        </div>
      ) : (
        <div>
          {/* Search Input */}
          <div className="w-full right-3 mt-6 mb-4 relative flex">
            <input
              type="text"
              value={input}
              onChange={(e) => searchProducts(e.target.value)}
              placeholder="Search for product"
              className="w-full h-10 p-3 border  rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
            />
            <input
              type="text"
              value={regionInput}
              onChange={(e) => searchByRegion(e.target.value)}
              placeholder="Search by region, town or location"
              className="w-full h-10 p-3 border rounded-lg ml-2 focus:outline-none focus:ring-1 focus:ring-black"
            />
            {input || regionInput ? (
              <button
                onClick={clearSearch}
                className="-mt-1 ml-2 p-2 rounded-full text-white hover:text-gray-800"
              >
               <MdCancel color="black"  className="text-3xl"/>
              </button>
            ) : null}
          </div>

          {/* Show search results when input is not empty */}
          {input || regionInput ? (
            <SearchMechanic productFiltered={productFiltered} />
          ) : (
            <>
              {/* Default Product List */}
              <div className="flex flex-wrap justify-center gap-6 p-2">
                {products.slice(0, displayedProducts).map((item) => (
                  <div key={item._id} className="bg-gray-200 rounded-lg shadow-md px-2">
                    <div className="flex">
                      <div>
                        <h3 className="md:text-lg w-40 md:font-semibold truncate overflow-hidden whitespace-nowrap">
                          {item.name}
                        </h3>
                        <p className="text-sm md:font-semibold w-32 truncate overflow-hidden whitespace-nowrap">
                          {item.region}
                        </p>
                        <p className="text-sm md:font-semibold w-32 truncate overflow-hidden whitespace-nowrap">
                          {item.town}
                        </p>
                        <p className="w-40 truncate overflow-hidden whitespace-nowrap text-sm md:font-semibold">
                          {item.location}
                        </p>
                        <div className="flex">
                          <img
                            src={item.picturesec}
                            alt={item.name}
                            className="md:w-14 lg:w-14 w-14 object-cover rounded-full"
                          />
                          <Link
                            to={`/callmechanics/${item._id}`}
                            className="mt-2 text-center ml-6 h-10 text-4xl text-green-400 rounded-lg hover:bg-black"
                          >
                            <BiSolidPhoneCall />
                          </Link>
                        </div>
                      </div>
                      <div>
                        <img
                          src={item.picture}
                          alt={item.name}
                          className="md:w-[12vh] sm:w-[12vh] lg:w-[13vh] w-28 mt-2 object-cover rounded-lg"
                        />
                      </div>
                    </div>
                    <p className="w-72 truncate overflow-hidden whitespace-nowrap text-sm md:font-semibold">
                      {item.services}
                    </p>
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {displayedProducts < products.length && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={loadMoreProducts}
                    className="bg-black text-orange-500 px-6 py-2 rounded-lg hover:bg-gray-800"
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Mechanics;
