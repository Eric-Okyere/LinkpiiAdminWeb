import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import baseURL from "../../assets/baseURL";
import { BiSolidPhoneCall } from "react-icons/bi";
import Loader from "../../components/Loader";
import SearchMechanic from "./SearchMechanic";
import SearchBar from "@/components/ui/SearchBar";
import EmptyState from "@/components/ui/EmptyState";
import LoadMoreButton from "@/components/ui/LoadMoreButton";

const Mechanics = () => {
  const [products, setProducts] = useState([]);
  const [productFiltered, setProductsFiltered] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [displayedProducts, setDisplayedProducts] = useState(20);
  const productsPerPage = 20;
  const [regionInput, setRegionInput] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await fetch(`${baseURL}newmechmain/approved`);
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
      }
    };

    fetchData();
  }, []);

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
              Car trouble? Find a mechanic near you and call them directly — no
              office visit needed.
            </p>
          </div>

          <SearchBar
            keyword={input}
            onKeywordChange={searchProducts}
            keywordPlaceholder="Search for a mechanic"
            region={regionInput}
            onRegionChange={searchByRegion}
            onClear={clearSearch}
            className="mb-4"
          />

          {input || regionInput ? (
            <SearchMechanic productFiltered={productFiltered} />
          ) : (
            <>
              {products.length === 0 ? (
                <EmptyState title="No mechanics found" />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.slice(0, displayedProducts).map((item) => (
                    <div
                      key={item._id}
                      className="bg-white rounded-2xl shadow-soft border border-ink-100 p-3 flex items-center gap-3"
                    >
                      <img
                        src={item.picture}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-xl shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-ink-900 truncate">{item.name}</h3>
                        <p className="text-xs text-ink-500 truncate">
                          {[item.region, item.town, item.location].filter(Boolean).join(", ")}
                        </p>
                        <p className="text-xs text-ink-400 truncate mt-0.5">{item.services}</p>
                      </div>
                      <Link
                        to={`/callmechanics/${item._id}`}
                        aria-label={`Call ${item.name}`}
                        className="h-9 w-9 shrink-0 flex items-center justify-center rounded-full bg-green-50 text-green-600 hover:bg-green-100 text-lg"
                      >
                        <BiSolidPhoneCall />
                      </Link>
                    </div>
                  ))}
                </div>
              )}

              {displayedProducts < products.length && (
                <LoadMoreButton onClick={loadMoreProducts} />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Mechanics;
