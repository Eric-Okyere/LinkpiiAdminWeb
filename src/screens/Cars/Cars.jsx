import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import baseURL from "../../assets/baseURL";
import { BiSolidPhoneCall } from "react-icons/bi";
import Loader from "../../components/Loader";
import CarSearch from "./CarSearch";
import SearchBar from "@/components/ui/SearchBar";
import EmptyState from "@/components/ui/EmptyState";
import LoadMoreButton from "@/components/ui/LoadMoreButton";

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
    <div className="min-h-screen pb-8">
      <SearchBar
        keyword={input}
        onKeywordChange={searchProducts}
        keywordPlaceholder="Where are you?"
        onClear={clearSearch}
        className="mb-4"
      />

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader />
        </div>
      ) : (
        <>
          {input && <CarSearch productFiltered={productFiltered} />}
          {!input && productFiltered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {productFiltered.slice(0, displayedProducts).map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl shadow-soft border border-ink-100 p-3 flex items-center gap-3"
                >
                  <img
                    src={item.driverpic}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-xl shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-ink-900 truncate">
                      {item.name}
                    </h3>
                    <p className="text-xs text-ink-500 truncate">
                      {[item.region, item.town, item.location]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                    <p className="text-xs text-ink-400 mt-0.5">{item.carnum}</p>
                  </div>
                  <div className="flex flex-col items-center gap-2 shrink-0">
                    <img
                      src={item.carpic}
                      alt={`${item.name}'s vehicle`}
                      className="w-12 h-12 object-cover rounded-full ring-2 ring-brand-100"
                    />
                    <Link
                      to={`/calldriver/${item._id}`}
                      aria-label={`Call ${item.name}`}
                      className="h-9 w-9 flex items-center justify-center rounded-full bg-green-50 text-green-600 hover:bg-green-100 text-lg"
                    >
                      <BiSolidPhoneCall />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            !input &&
            productFiltered.length === 0 && (
              <EmptyState
                title="No drivers found"
                subtitle="Please check your internet connection or try a different search."
              />
            )
          )}

          {!input && displayedProducts < productFiltered.length && (
            <LoadMoreButton onClick={loadMoreProducts} />
          )}
        </>
      )}

      {networkError && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 px-4">
          <div className="bg-white p-6 rounded-2xl shadow-2xl text-center max-w-xs">
            <h2 className="text-lg font-bold text-red-500">
              No internet connection
            </h2>
            <p className="text-ink-500 mt-2 text-sm">
              Check your internet connection and try again
            </p>
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

export default MyDriver;
