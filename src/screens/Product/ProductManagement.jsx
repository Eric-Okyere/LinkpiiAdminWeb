import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import ListProduct from "./ListProducts";
import baseURL from "../../assets/baseURL";
import { IoArrowBack } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";

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
    <div className="flex flex-col h-screen bg-[#f5a53d] pt-18">
      {/* Header */}
      <div className="flex items-center justify-center px-4 mt-2 bg-[#f5a53d]">
        {/* <Link to="/dash">
          <IoArrowBack size={30} />
        </Link> */}
        <div className="relative w-3/4 rounded-full flex items-center px-4">
          <i className="fas fa-search text-black"></i>
          <input
            type="text"
            placeholder="Search by name"
            className="w-full rounded-3xl h-12 border-none outline-none"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              searchProducts(e.target.value);
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full"></div>
          </div>
        ) : productFilter.length > 0 ? (
          <>
            <div className="flex flex-row bg-[#f5a53d] py-2 px-1 text-lg font-bold">
              <div className="w-1/6">Image</div>
              <div className="w-1/6">Image</div>
              <div className="w-1/6">Name</div>
              <div className="w-1/6">Price</div>
              <div className="w-1/6 text-center mr-4">Approve</div>
              <div className="w-1/6 text-center">Views</div>
            </div>
            {productFilter.map((item, index) => (
              <ListProduct
                key={item.id}
                {...item}
                index={index}
                delete={deleteProducts}
                onViewDetails={() => handleViewDetails(item)} // Pass details handler
              />
            ))}
          </>
        ) : (
          <div className="text-center text-lg font-medium">
            No products found. Please add some products to manage.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;
