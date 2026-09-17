import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import baseURL from '../../assets/baseURL';
import Loader from "../../components/Loader";
import Categories from '../Cars/Categories';
import SearchProducts from './SearchProducts';
import SearchBar from '../../components/ui/SearchBar';
import ListingCard from '../../components/ui/ListingCard';
import EmptyState from '../../components/ui/EmptyState';
import LoadMoreButton from '../../components/ui/LoadMoreButton';

const General = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(80);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [input, setInput] = useState("");
  const [regionInput, setRegionInput] = useState("");
  const [nameFilteredProducts, setNameFilteredProducts] = useState([]);
  const [networkError, setNetworkError] = useState(false);
  const navigate = useNavigate();

  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          fetch(`${baseURL}fashionpost/approved`),
          fetch(`${baseURL}fashion`),
        ]);

        if (!productsResponse.ok || !categoriesResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const productsData = await productsResponse.json();
        const categoriesData = await categoriesResponse.json();
        setProducts(productsData);
        setFilteredProducts(productsData);
        setVisibleProducts(productsData.slice(0, 80));
        setCategories(categoriesData);
      } catch (err) {
        setError('Failed to fetch data. Connect your Wifi.');
        setNetworkError(true);
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
    const newIndex = currentIndex + 80;
    setCurrentIndex(newIndex);
    setVisibleProducts(filteredProducts.slice(0, newIndex));
  };


  const handleProductClick = async (productId) => {
    try {
      const response = await fetch(`${baseURL}fashionpost/products/${productId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product details');
      }
      const productDetails = await response.json();

      // Navigate to the detail page with the product data
      navigate(`/detail/${productId}`, { state: { product: productDetails } });
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
    <div className="pb-8">
      <SearchBar
        keyword={input}
        onKeywordChange={searchProducts}
        keywordPlaceholder="Search for a product"
        region={regionInput}
        onRegionChange={searchByRegion}
        onClear={clearSearch}
        className="mb-4"
      />

      {(input || regionInput) ? (
        <SearchProducts productFiltered={filteredProducts} />
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
                <EmptyState title="No products found" subtitle="Try a different category or search term." />
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                  {visibleProducts.map((product) => (
                    <ListingCard
                      key={product._id}
                      onClick={() => handleProductClick(product._id)}
                      image={product.picture || fallbackImage}
                      title={product.name}
                      subtitle={product.description}
                      price={product.price ? `Gh¢${product.price}` : undefined}
                      meta={[product.region, product.town].filter(Boolean).join(', ')}
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

      {networkError && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 px-4">
          <div className="bg-white p-6 rounded-2xl shadow-2xl text-center max-w-xs">
            <h2 className="text-lg font-bold text-red-500">No internet connection</h2>
            <p className="text-ink-500 mt-2 text-sm">Check your internet connection and try again</p>
            <button
              className="mt-4 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-xl font-semibold"
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

export default General;
