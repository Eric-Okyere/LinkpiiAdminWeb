import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import ListProduct from "./ListProducts";
import baseURL from "../../assets/baseURL";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import Loader from "../../components/Loader";
import Container from "../../components/ui/Container";
import EmptyState from "../../components/ui/EmptyState";
import SectionHeading from "../../components/ui/SectionHeading";

const ProductManagement = (props) => {
  const [productList, setProductList] = useState([]);
  const [productFilter, setProductFilter] = useState([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const navigate = useNavigate(); // Navigation hook

  const myProducts = useSelector((state) => state);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${baseURL}fashionpost/user/${myProducts.user.id}`
        );
        setProductList(response.data);
        setProductFilter(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
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
      await axios.put(`${baseURL}fashionpost/${id}/deactivate`);
      setProductFilter(productFilter.filter((item) => item.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleViewDetails = (product) => {
    localStorage.setItem("selectedProduct", JSON.stringify(product));
    navigate(`/products/${product.id}`);
  };

  return (
    <div className="min-h-screen bg-ink-50 pt-20 sm:pt-24 pb-12">
      <Container>
        <SectionHeading
          eyebrow="Manage"
          title="My products"
          subtitle="Every product you've posted, in one place — tap a card to review it."
        />

        <div className="relative mb-6 max-w-md">
          <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            placeholder="Search by name"
            className="h-11 w-full rounded-xl border border-transparent bg-white pl-10 pr-3 text-sm text-ink-800 shadow-soft placeholder:text-ink-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              searchProducts(e.target.value);
            }}
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader />
          </div>
        ) : productFilter.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {productFilter.map((item, index) => (
              <ListProduct
                key={item.id}
                {...item}
                index={index}
                delete={deleteProducts}
                onViewDetails={() => handleViewDetails(item)} // Pass details handler
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No products found"
            subtitle="Please add products to manage."
          />
        )}
      </Container>
    </div>
  );
};

export default ProductManagement;
