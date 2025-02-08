import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import baseURL from '../../assets/baseURL';
import Loader from "../../components/Loader"
import Categories from '../Cars/Categories';
import { FaArrowRightFromBracket } from "react-icons/fa6";
import SearchShops from './SearchShops';
import { MdCancel } from "react-icons/md";

const ShopScreen = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(40);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [input, setInput] = useState("");
    const [regionInput, setRegionInput] = useState(""); 
    const [nameFilteredProducts, setNameFilteredProducts] = useState([]);
    const navigate = useNavigate()

  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          fetch(`${baseURL}shops/approved`),
          fetch(`${baseURL}shopscat`),
        ]);

        if (!productsResponse.ok || !categoriesResponse.ok) {
          throw new Error('Failed to fetch data. Connect your Wifi.');
        }

        const productsData = await productsResponse.json();
        const categoriesData = await categoriesResponse.json();
        // console.log(`Spare categories`,categoriesData)
        setProducts(productsData);
        setFilteredProducts(productsData);
        setVisibleProducts(productsData.slice(0, 40));
        setCategories(categoriesData);
      } catch (err) {
        setError('Failed to fetch data. Connect your Wifi.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategoryId(categoryId);
  };

  const handleLoadMore = () => {
    const newIndex = currentIndex + 40;
    setCurrentIndex(newIndex);
    setVisibleProducts(filteredProducts.slice(0, newIndex));
  };




    useEffect(() => {
      if (query) {
        const filtered = products.filter((product) =>
          product.name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredProducts(filtered);
        setVisibleProducts(filtered.slice(0, 80));
        setCurrentIndex(16);
      } else if (selectedCategoryId) {
        const filtered = products.filter(
          (product) => product.category?._id === selectedCategoryId
        );
        setFilteredProducts(filtered);
        setVisibleProducts(filtered.slice(0, 80));
        setCurrentIndex(80);
      } else {
        setFilteredProducts(products);
        setVisibleProducts(products.slice(0, 80));
        setCurrentIndex(80);
      }
    }, [query, selectedCategoryId, products]);
  
  
  
  
    const searchProducts = (text) => {
      setInput(text);
      const filtered = products.filter((item) => 
        item.name?.toLowerCase().includes(text.toLowerCase())
      );
      setNameFilteredProducts(filtered); // Store name-filtered products
      setFilteredProducts(filtered);
      setVisibleProducts(filtered.slice(0, 80));
    };
  
    
   
   
    const searchByRegion = (text) => {
      setRegionInput(text);
      const sourceData = nameFilteredProducts.length > 0 ? nameFilteredProducts : products;
    
      const filtered = sourceData.filter((item) => {
        const region = item.region?.toLowerCase() || "";
        const town = item.town?.toLowerCase() || "";
        const location = item.location?.toLowerCase() || "";
    
        return (
          region.includes(text.toLowerCase()) ||
          town.includes(text.toLowerCase()) ||
          location.includes(text.toLowerCase())
        );
      });
    
      setFilteredProducts(filtered);
      setVisibleProducts(filtered.slice(0, 80));
    };
    
    
    
   
    
    const clearSearch = () => {
      setInput("");
      setRegionInput(""); 
      setFilteredProducts(products);
      setVisibleProducts(products.slice(0, 80)); // Ensure visible products are reset
      setCurrentIndex(80);
    };


    const handleProductClick = async (productId) => {
      try {
        const response = await fetch(`${baseURL}shops/products/${productId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product details');
        }
        const productDetails = await response.json();
    
        // Navigate to the detail page with the product data
        navigate(`/shopdetail/${productId}`, { state: { product: productDetails } });
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };
    
    



  const fallbackImage =
    'https://via.placeholder.com/150?text=Image+Not+Available';

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="pb-8 md:-mt-16 -mt-16 font-serif">
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

      {(input || regionInput) ? (
<SearchShops productFiltered={filteredProducts}/>
) : (
<>
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
        <div className='flex justify-end mb-0 md:hidden'> <FaArrowRightFromBracket className='text-xs' /> </div>
          <Categories  categories={categories} onCategoryClick={handleCategoryClick} />

          <div className="flex flex-wrap justify-center gap-6 p-2">
            {filteredProducts.length === 0 ? (
              <div className="text-center text-gray-500 text-lg col-span-full">
                No products found. Please try a different category or search term.
              </div>
            ) : (
              visibleProducts.map((product) => (
                <Link onClick={() => handleProductClick(product._id)}  key={product._id}>
                <div className="p-2 bg-gray-200 w-80 rounded-lg shadow-md flex  md:w-80"
                >
                  <img
                    src={product.picture || fallbackImage}
                    alt={product.name || "No Image"}
                    className="md:w-20 sm:w-30 lg:w-30 w-20 object-cover rounded-lg"
                  />
                  <div className="ml-2">
                 
                    <h3 className="md:text-sm md:font-semibold md:w-52 lg:w-52 w-40 sm:w-52 truncate overflow-hidden whitespace-nowrap">
                      {product.name} 
                    </h3>
                    <h3 className="md:text-sm text-[#f5a53d] md:font-semibold md:w-52 lg:w-52 w-40 sm:w-52 truncate overflow-hidden whitespace-nowrap">
                      {product.description} 
                    </h3>
                   
                    <p className="text-sm md:w-60 lg:w-60 w-40 sm:w-52 truncate overflow-hidden whitespace-nowrap">
                      {product.region}
                    </p>
                    <p className="text-sm  md:w-60 lg:w-60 w-40 sm:w-52 truncate overflow-hidden whitespace-nowrap">
                      {product.town}
                    </p>
                    <p className="text-sm  md:w-60 lg:w-60 w-40 sm:w-52 truncate overflow-hidden whitespace-nowrap">
                      {product.location}
                    </p>
                    
                    <div className='text-end px-4'>
                      
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

export default ShopScreen;
