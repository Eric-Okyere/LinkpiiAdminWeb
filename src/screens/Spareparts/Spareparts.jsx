import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import baseURL from '../../assets/baseURL';
import Loader from "../../components/Loader"
import Categories from '../Cars/Categories';
import SearchSpareparts from './SearchSpareparts';
import SearchBar from "@/components/ui/SearchBar";
import ListingCard from "@/components/ui/ListingCard";
import EmptyState from "@/components/ui/EmptyState";
import LoadMoreButton from "@/components/ui/LoadMoreButton";
import Container from "@/components/ui/Container";


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
    <div className="pb-8">
      <SearchBar
        keyword={input}
        onKeywordChange={searchProducts}
        keywordPlaceholder="Search for a spare part"
        region={regionInput}
        onRegionChange={searchByRegion}
        onClear={clearSearch}
        className="mb-2"
      />

      {input || regionInput ? (
        <SearchSpareparts productFiltered={filteredProducts} />
      ) : (
        <Container className="px-0">
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
                <EmptyState title="No spare parts found" subtitle="Try a different category or search term." />
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                  {visibleProducts.map((product) => (
                    <ListingCard
                      key={product._id}
                      href={`/sparepart/${product._id}`}
                      image={product.picture || fallbackImage}
                      title={product.name}
                      price={product.price ? `Gh¢${product.price}` : undefined}
                      meta={[product.region, product.town].filter(Boolean).join(', ')}
                    />
                  ))}
                </div>
              )}

              {filteredProducts.length > visibleProducts.length && (
                <LoadMoreButton onClick={handleLoadMore} />
              )}
            </>
          )}
        </Container>
      )}
    </div>
  );
};

export default Spareparts;
