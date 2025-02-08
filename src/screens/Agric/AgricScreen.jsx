import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import baseURL from '../../assets/baseURL';
import Loader from "../../components/Loader"
import { FaArrowRightFromBracket } from "react-icons/fa6";
import Categories from './Categories';
import SearchAgric from './SearchAgric';
import { MdCancel } from "react-icons/md";


const AgricScreen = () => {
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
          fetch(`${baseURL}send/approved`),
          fetch(`${baseURL}categories`),
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

  useEffect(() => {
    if (query) {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
      setVisibleProducts(filtered.slice(0, 40));
      setCurrentIndex(40);
    } else if (selectedCategoryId) {
      const filtered = products.filter(
        (product) => product.category?._id === selectedCategoryId
      );
      setFilteredProducts(filtered);
      setVisibleProducts(filtered.slice(0, 40));
      setCurrentIndex(40);
    } else {
      setFilteredProducts(products);
      setVisibleProducts(products.slice(0, 40));
      setCurrentIndex(40);
    }
  }, [query, selectedCategoryId, products]);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategoryId(categoryId);
  };

  const handleLoadMore = () => {
    const newIndex = currentIndex + 40;
    setCurrentIndex(newIndex);
    setVisibleProducts(filteredProducts.slice(0, newIndex));
  };

  const fallbackImage =
    'https://via.placeholder.com/150?text=Image+Not+Available';

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }


// useEffect(() => {
//       if (query) {
//         const filtered = products.filter((product) =>
//           product.name.toLowerCase().includes(query.toLowerCase())
//         );
//         setFilteredProducts(filtered);
//         setVisibleProducts(filtered.slice(0, 80));
//         setCurrentIndex(16);
//       } else if (selectedCategoryId) {
//         const filtered = products.filter(
//           (product) => product.category?._id === selectedCategoryId
//         );
//         setFilteredProducts(filtered);
//         setVisibleProducts(filtered.slice(0, 80));
//         setCurrentIndex(80);
//       } else {
//         setFilteredProducts(products);
//         setVisibleProducts(products.slice(0, 80));
//         setCurrentIndex(80);
//       }
//     }, [query, selectedCategoryId, products]);
  
  
  
  
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
      setVisibleProducts(products.slice(0, 40)); // Ensure visible products are reset
      setCurrentIndex(40);
    };



    const handleProductClick = async (productId) => {
      try {
        const response = await fetch(`${baseURL}send/products/${productId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product details');
        }
        const productDetails = await response.json();
    
        // Navigate to the detail page with the product data
        navigate(`/agricdetail/${productId}`, { state: { product: productDetails } });
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };




  return (
    <div className="pb-8 -mt-24 font-serif">
    {/* Search Bar */}
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
<SearchAgric productFiltered={filteredProducts}/>
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
         <div className='flex justify-end mb-0 md:hidden'> <FaArrowRightFromBracket className='text-xs' /> </div>
          {/* Categories */}
          <div className="mb-4">
            <Categories categories={categories} onCategoryClick={handleCategoryClick} />
          </div>

          {/* Masonry Layout for Products */}
          <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4">
            {filteredProducts.length === 0 ? (
              <div className="text-center text-gray-500 text-lg col-span-full">
                No products found. Please try a different category or search term.
              </div>
            ) : (
              visibleProducts.map((product) => (
                <Link onClick={() => handleProductClick(product._id)} key={product._id}>
                  <div className="mb-2 bg-gray-200 rounded-lg shadow-lg p-3 break-inside-avoid">
                    {/* Product Image */}
                    <img
                      src={product.picture || fallbackImage}
                      alt={product.name || "No Image"}
                      className="w-full object-cover rounded-lg"
                      style={{ height: `${120 + Math.random() * 100}px` }} // Random heights
                    />

                    {/* Product Details */}
                    <div className="mt-3 w-full text-center sm:text-left">
                      <h3 className="text-sm font-semibold truncate">{product.name}</h3>
                      <p className="text-md text-[#f5a53d] font-bold">Gh¢{product.price}</p>
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
            <div className="flex justify-center mt-10">
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

export default AgricScreen;
