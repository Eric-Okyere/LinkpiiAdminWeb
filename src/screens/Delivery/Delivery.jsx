import React, { useCallback, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "tailwindcss/tailwind.css";
import baseURL from "../../assets/baseURL";
import { BiSolidPhoneCall } from "react-icons/bi";
import Loader from "../../components/Loader";
import SearchBar from "../../components/ui/SearchBar";
import EmptyState from "../../components/ui/EmptyState";
import LoadMoreButton from "../../components/ui/LoadMoreButton";


const Delivery = () => {
  const [products, setProducts] = useState([]);
  const [productFiltered, setProductsFiltered] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [displayedProducts, setDisplayedProducts] = useState(20);
  const productsPerPage = 20;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await fetch(`${baseURL}okada/motor/approved`);
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
    <div className="min-h-screen pb-8">
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader />
        </div>
      ) : (
        <div>
          <div className="mb-4 rounded-2xl bg-white border border-ink-100 shadow-soft p-4">
            <p className="text-sm text-ink-600">
              Need a rider to deliver something across town? Find one nearby and call them.
            </p>
          </div>

          <SearchBar
            keyword={input}
            onKeywordChange={searchProducts}
            keywordPlaceholder="Where are you?"
            onClear={() => searchProducts("")}
            className="mb-4"
          />

          {productFiltered.length > 0 ? (
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
                    <h3 className="font-semibold text-ink-900 truncate">{item.name}</h3>
                    <p className="text-xs text-ink-500 truncate">
                      {[item.region, item.town, item.location].filter(Boolean).join(", ")}
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
                      to={`/calldelivery/${item._id}`}
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
            <EmptyState title="No riders found" subtitle="Please check your internet connection." />
          )}

          {displayedProducts < productFiltered.length && (
            <LoadMoreButton onClick={loadMoreProducts} />
          )}
        </div>
      )}
    </div>
  );
};

export default Delivery;
