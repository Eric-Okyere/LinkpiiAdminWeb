import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import baseURL from '../../assets/baseURL';
import Loader from "../../components/Loader"
import Categories from '../Cars/Categories';
import { FaArrowRightFromBracket } from "react-icons/fa6";
import SearchSpareparts from './SearchSpareparts';
import { MdCancel } from "react-icons/md";


const Spareparts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(16);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [input, setInput] = useState("");
  const [regionInput, setRegionInput] = useState(""); 

  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          fetch(`${baseURL}sparepartsmainpost/approved`),
          fetch(`${baseURL}sparecatnew`),
        ]);

        if (!productsResponse.ok || !categoriesResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const productsData = await productsResponse.json();
        const categoriesData = await categoriesResponse.json();
      //  console.log(productsData)
        setProducts(productsData);
        setFilteredProducts(productsData);
        setVisibleProducts(productsData.slice(0, 16));
        setCategories(categoriesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (query) {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
      setVisibleProducts(filtered.slice(0, 16));
      setCurrentIndex(16);
    } else if (selectedCategoryId) {
      const filtered = products.filter(
        (product) => product.category?._id === selectedCategoryId
      );
      setFilteredProducts(filtered);
      setVisibleProducts(filtered.slice(0, 16));
      setCurrentIndex(16);
    } else {
      setFilteredProducts(products);
      setVisibleProducts(products.slice(0, 16));
      setCurrentIndex(16);
    }
  }, [query, selectedCategoryId, products]);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategoryId(categoryId);
  };

  const handleLoadMore = () => {
    const newIndex = currentIndex + 16;
    setCurrentIndex(newIndex);
    setVisibleProducts(filteredProducts.slice(0, newIndex));
  };

  const fallbackImage =
    'https://via.placeholder.com/150?text=Image+Not+Available';

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }


  const searchProducts = (text) => {
    setInput(text);
   setFilteredProducts(
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
   setFilteredProducts(
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
  }



  const clearSearch = () => {
    setInput("");
    setRegionInput(""); // Clear region input as well
    setFilteredProducts(products);
  };


  return (
    <div className="pb-8   md:-mt-28 -mt-20 font-serif">
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
      {input || regionInput? (
        <SearchSpareparts productFiltered={filteredProducts} />
      ) : (
        <div className="container mx-auto px-4 pb-8">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader />
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center text-red-500 mt-10 text-lg">
              No categories available at the moment. Please try again later.
            </div>
          ) : (
            <>
             <div className='flex justify-end mb-0 md:hidden'>
                  <FaArrowRightFromBracket className='text-xs' />
                </div>
              {/* Categories */}
              <div className="mb-4">
                <Categories
                  categories={categories}
                  onCategoryClick={handleCategoryClick}
                />
              </div>

              {/* Products Grid */}
              <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4">
                {filteredProducts.length === 0 ? (
                  <div className="text-center text-gray-500 text-lg col-span-full">
                    No products found. Please try a different category or search term.
                  </div>
                ) : (
                  visibleProducts.map((product) => (
                    <Link to={`/sparepart/${product._id}`} key={product._id}>
                      <div className="mb-2 bg-gray-200 rounded-lg shadow-lg p-3 break-inside-avoid">
                        {/* Product Image */}
                        <img
                          src={product.picture || fallbackImage}
                          alt={product.name || "No Image"}
                          className="w-full object-cover rounded-lg"
                          style={{
                            height: `${120 + Math.random() * 100}px`, // Random heights
                          }}
                        />

                        {/* Product Details */}
                        <div className="mt-3 w-full text-center sm:text-left">
                          <h3 className="text-sm font-semibold truncate">
                            {product.name}
                          </h3>
                          <p className="text-md text-[#f5a53d] font-bold">
                            Gh¢{product.price}
                          </p>
                          <p className="text-xs text-gray-600 truncate">
                            {product.region}, {product.town}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>

              {/* Load More Button */}
              {filteredProducts.length > visibleProducts.length && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={handleLoadMore}
                    className="px-6 py-2 text-white bg-blue-700 hover:bg-blue-800 rounded-lg"
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

export default Spareparts;
