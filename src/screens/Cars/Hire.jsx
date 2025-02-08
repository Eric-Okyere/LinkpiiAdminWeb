import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import baseURL from '../../assets/baseURL';
import Categories from './Categories';
import Loader from "../../components/Loader"
import { FaArrowRightFromBracket } from "react-icons/fa6";
import HireSearch from './HireSearch';
import { MdCancel } from "react-icons/md";

const Hire = () => {
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
  const [productFiltered, setProductsFiltered] = useState([]);

  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          fetch(`${baseURL}rentcar/approved`),
          fetch(`${baseURL}rentcarcats`),
        ]);

        if (!productsResponse.ok || !categoriesResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const productsData = await productsResponse.json();
        const categoriesData = await categoriesResponse.json();

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

  return (
    <div className="pb-8 font-serif">
      {loading ? (
        <div className='flex justify-center items-center'><Loader /></div>
        
      ) : (
        <>
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
                className="-mt-1 ml-2 p-2 rounded-full hover:text-gray-800"
              >
                <MdCancel color="black"  className="text-3xl"/>
              </button>
            ) : null}
          </div>
  
          {input || regionInput ? (
            <HireSearch productFiltered={productFiltered} />
          ) : (
            <>
              <div className="flex justify-end mb-0 md:hidden">
                <FaArrowRightFromBracket className="text-xs" />
              </div>
  
              <Categories categories={categories} onCategoryClick={handleCategoryClick} />
  
              <div className="flex flex-wrap justify-center gap-6 p-2">
                {filteredProducts.length === 0 ? (
                  <div className="text-center text-gray-500 text-lg col-span-full">
                    No products found. Please try a different category or search term.
                  </div>
                ) : (
                  visibleProducts.map((product) => (
                    <Link to={`/hiredetail/${product._id}`} key={product._id}>
                      <div className="p-2 bg-gray-200 rounded-lg w-80 shadow-md flex lg md:w-80">
                        <img
                          src={product.picture || fallbackImage}
                          alt={product.name || "No Image"}
                          className="md:w-20 sm:w-30 lg:w-30 w-20 object-cover rounded-lg"
                        />
                        <div className="ml-2">
                          <h3 className="md:text-sm md:font-semibold md:w-52 lg:w-52 w-40 sm:w-52 truncate overflow-hidden whitespace-nowrap">
                            {product.name}
                          </h3>
                          <h3 className="md:text-sm md:font-semibold md:w-52 lg:w-52 w-40 sm:w-52 truncate overflow-hidden whitespace-nowrap">
                            {product.description}
                          </h3>
                          <p className="truncate overflow-hidden whitespace-nowrap md:w-52 lg:w-56 w-40 sm:w-52 text-sm text-[#f5a53d] font-semibold">
                            Gh¢{product.price}
                          </p>
                          <p className="text-sm md:w-60 lg:w-60 w-40 sm:w-52 truncate overflow-hidden whitespace-nowrap">
                            {product.region}
                          </p>
                          <p className="text-sm md:w-60 lg:w-60 w-40 sm:w-52 truncate overflow-hidden whitespace-nowrap">
                            {product.town}
                          </p>
  
                          <div className="text-end px-4">
                            <p className="text-sm text-[#f5a53d] px-2 md:px-2 truncate overflow-hidden whitespace-nowrap">
                              {product?.condition}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
  
              {filteredProducts.length > visibleProducts.length && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={handleLoadMore}
                    className="px-6 py-2 text-white bg-black hover:bg-[#f5a53d] rounded-lg"
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Hire;
