import React, { useCallback, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "tailwindcss/tailwind.css";
import baseURL from "../../assets/baseURL";
import { BiSolidPhoneCall } from "react-icons/bi";
import Loader from "../../components/Loader";


const Delivery = () => {
  const [products, setProducts] = useState([]);
  const [productFiltered, setProductsFiltered] = useState([]);
  const [focus, setFocus] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [displayedProducts, setDisplayedProducts] = useState(20);
  const productsPerPage = 20;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await fetch(`${baseURL}okada/motor/approved`);
        console.log(productsResponse);
        if (!productsResponse.ok) {
          throw new Error(`HTTP error! status: ${productsResponse.status}`);
        }
        const productsData = await productsResponse.json();
        console.log(productsData);

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
        const name = item.name ? item.name.toLowerCase() : "";
        const region = item.region ? item.region.toLowerCase() : "";
        const town = item.town ? item.town.toLowerCase() : "";
        const location = item.location ? item.location.toLowerCase() : "";

        return (
          name.includes(text.toLowerCase()) ||
          region.includes(text.toLowerCase()) ||
          town.includes(text.toLowerCase()) ||
          location.includes(text.toLowerCase())
        );
      })
    );
  };

  const loadMoreProducts = () => {
    setDisplayedProducts(displayedProducts + productsPerPage);
  };

  return (
    <div className="flex flex-col bg-white min-h-screen -mt-24 md:mb-10 ">
     
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
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {focus && (
              <button
                onClick={() => setFocus(false)}
                className="absolute right-10 top-3 text-gray-600 hover:text-gray-800"
              >
                &#x2715;
              </button>
            )}
          </div>

          {productFiltered.length > 0 ? (
           <div className="flex flex-wrap justify-center gap-6 p-2">
           {productFiltered.slice(0, displayedProducts).map((item) => (
             <div
               key={item._id}
               className="px-2 w-full md:w-auto bg-gray-200 rounded-lg shadow-md flex justify-between"
             >
               <div>
                 <h3 className="md:text-lg md:w-40 w-48 md:font-semibold truncate overflow-hidden whitespace-nowrap">
                  {item.name}
                 </h3>
                 <p className="text-sm md:font-semibold md:w-40 w-48 truncate overflow-hidden whitespace-nowrap">
                  {item.region}
                  </p>
                 <p className="text-sm md:font-semibold md:w-40 w-48 truncate overflow-hidden whitespace-nowrapd">
                  {item.town}
 
                  </p>
                 <div className="flex gap-x-20 md:gap-x-10">
                   <img
                     src={item.carpic}
                     alt={item._id}
                     className="md:w-14 lg:w-14 w-14 object-cover rounded-full"
                   />
                   <Link
                  // onClick={()=>alert("Hello")}
                     to={`/calldelivery/${item._id}`}
                     className="mt-2 text-center h-10 text-4xl text-green-400 rounded-lg hover:bg-black"
                   >
                     <BiSolidPhoneCall />
                   </Link>
                 </div>
                 <p className="md:w-40 w-48 md:mt-4 truncate overflow-hidden whitespace-nowrap text-sm md:font-semibold">
                      {item.location}
                   
                    </p>



               </div>
         
               <div>
                 <img
                   src={item.driverpic}
                   alt={item.name}
                   className="md:w-[12vh] sm:w-[12vh] lg:w-[13vh] w-28 mt-2  object-cover rounded-lg"
                 />
                 <h1 className="text-sm md:font-semibold lg:pt-1 sm:pt-2 md:pt-2">{item.carnum}</h1>
               </div>
             </div>
           ))}
         </div>
         
          ) : (
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
    </div>
  );
};

export default Delivery;
