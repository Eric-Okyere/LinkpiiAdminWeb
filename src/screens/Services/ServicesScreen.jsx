import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import baseURL from '../../assets/baseURL';
import Loader from "../../components/Loader"
import Categories from '../Cars/Categories';
import ServicesSearch from './ServicesSearch';
import SearchBar from '../../components/ui/SearchBar';
import ListingCard from '../../components/ui/ListingCard';
import EmptyState from '../../components/ui/EmptyState';
import LoadMoreButton from '../../components/ui/LoadMoreButton';

const ServicesScreen = () => {
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
          fetch(`${baseURL}services/approved`),
          fetch(`${baseURL}servcat`),
        ]);

        if (!productsResponse.ok || !categoriesResponse.ok) {
          throw new Error('Failed to fetch data');
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

  const handleProductClick = async (productId) => {
    try {
      const response = await fetch(`${baseURL}services/products/${productId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product details');
      }
      const productDetails = await response.json();

      // Navigate to the detail page with the product data
      navigate(`/servicesdetail/${productId}`, { state: { product: productDetails } });
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  return (
    <div className="pb-8">
      <SearchBar
        keyword={input}
        onKeywordChange={searchProducts}
        keywordPlaceholder="Search for a service"
        region={regionInput}
        onRegionChange={searchByRegion}
        onClear={clearSearch}
        className="mb-2"
      />

      {(input || regionInput) ? (
        <ServicesSearch productFiltered={filteredProducts} />
      ) : (
        <>
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader />
            </div>
          ) : categories.length === 0 ? (
            <EmptyState title="No categories available" subtitle="Please try again later." />
          ) : (
            <>
              <Categories categories={categories} onCategoryClick={handleCategoryClick} />

              {filteredProducts.length === 0 ? (
                <EmptyState title="No services found" subtitle="Try a different category or search term." />
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                  {visibleProducts.map((product) => (
                    <ListingCard
                      key={product._id}
                      onClick={() => handleProductClick(product._id)}
                      image={product.picture || fallbackImage}
                      title={product.name}
                      subtitle={product.description}
                      meta={[product.region, product.town, product.location].filter(Boolean).join(", ")}
                      tag={product.condition}
                    />
                  ))}
                </div>
              )}

              {filteredProducts.length > visibleProducts.length && (
                <LoadMoreButton onClick={handleLoadMore} />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ServicesScreen;
