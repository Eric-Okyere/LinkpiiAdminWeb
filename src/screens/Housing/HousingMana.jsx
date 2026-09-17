import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import baseURL from "../../assets/baseURL";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import Container from "../../components/ui/Container";
import SearchBar from "../../components/ui/SearchBar";
import ListingCard from "../../components/ui/ListingCard";
import EmptyState from "../../components/ui/EmptyState";
import SectionHeading from "../../components/ui/SectionHeading";

const HousingMana = (props) => {
  const [productList, setProductList] = useState([]);
  const [productFilter, setProductFilter] = useState([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const myProducts = useSelector((state) => state);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedToken = localStorage.getItem("keepLoggedIn");

        const response = await axios.get(
          `${baseURL}buildings/user/${myProducts.user.id}`,
          { headers: { Authorization: `Bearer ${storedToken}` } }
        );
        setProductList(response.data);
        setProductFilter(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product list:", error);
      }
    };

    fetchData();

    return () => {
      setProductList([]);
      setProductFilter([]);
      setLoading(true);
    };
  }, [myProducts.user]);

  const searchProducts = (text) => {
    setProductFilter(
      productList.filter((i) =>
        i.name.toLowerCase().includes(text.toLowerCase())
      )
    );
  };

  const deleteProducts = async (id) => {
    try {
      await axios.put(`${baseURL}buildings/${id}/deactivate`);
      setProductFilter(productFilter.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleProductClick = (product) => {
    navigate(`/building/${product.id}`); // Navigate to the product detail page
  };

  return (
    <div className="min-h-screen bg-ink-50 pt-20 sm:pt-24 pb-16">
      <Container>
        <SectionHeading
          eyebrow="Housing"
          title="Manage my buildings"
          subtitle="Track approval status and views for every building you've listed."
        />

        <SearchBar
          keyword={input}
          onKeywordChange={(text) => {
            setInput(text);
            searchProducts(text);
          }}
          keywordPlaceholder="Search by name"
          onClear={() => {
            setInput("");
            searchProducts("");
          }}
          className="mb-6"
        />

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader />
          </div>
        ) : productFilter.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {productFilter.map((item) => (
              <ListingCard
                key={item.id}
                onClick={() => handleProductClick(item)}
                image={item.picture}
                title={item.name}
                price={item.price ? `Gh¢${item.price}` : undefined}
                meta={`${item.views ?? 0} views`}
                tag={item.approved ? "Approved" : "Pending"}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No buildings found"
            subtitle="Please add a listing to manage it here."
          />
        )}
      </Container>
    </div>
  );
};

export default HousingMana;
