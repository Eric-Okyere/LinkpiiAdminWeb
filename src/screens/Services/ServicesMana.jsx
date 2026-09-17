import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import baseURL from "../../assets/baseURL";
import { FcCancel } from "react-icons/fc";
import { IoMdCheckmark } from "react-icons/io";
import { FiSearch } from "react-icons/fi";
import Loader from "../../components/Loader";
import Container from "../../components/ui/Container";
import EmptyState from "../../components/ui/EmptyState";
import SectionHeading from "../../components/ui/SectionHeading";


const ServicesMana = () => {
  const [productList, setProductList] = useState([]);
  const [productFilter, setProductFilter] = useState([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const myProducts = useSelector((state) => state);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${baseURL}services/user/${myProducts.user.id}`
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

  const handleProductClick = (product) => {
    navigate(`/adminservices/${product.id}`); // Navigate to the product detail page
  };

  return (
    <div className="min-h-screen bg-ink-50 pt-20 sm:pt-24 pb-12">
      <Container>
        <SectionHeading
          eyebrow="Manage"
          title="My services"
          subtitle="Every service you've posted, in one place — tap a card to review it."
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
            {productFilter.map((item) => (
              <div
                key={item.id}
                onClick={() => handleProductClick(item)}
                className="group cursor-pointer overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover"
              >
                <div className="flex h-32 gap-0.5">
                  <img
                    src={item.picture}
                    alt="Product"
                    className="h-full w-1/2 object-cover"
                  />
                  <img
                    src={item.picturesec}
                    alt="Product secondary"
                    className="h-full w-1/2 object-cover"
                  />
                </div>
                <div className="p-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="truncate text-sm font-semibold text-ink-900">{item.name}</h3>
                    {item.approved ? (
                      <IoMdCheckmark className="shrink-0 text-green-600" size={18} />
                    ) : (
                      <FcCancel className="shrink-0" size={18} />
                    )}
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="truncate text-xs text-ink-500">{item.region}</span>
                    <span className="rounded-full bg-ink-100 px-2 py-0.5 text-[11px] font-semibold text-ink-600">
                      {item.views} views
                    </span>
                  </div>
                </div>
              </div>
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

export default ServicesMana;
