import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import baseURL from "../../assets/baseURL";
import { IoArrowBack } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { FcCancel } from "react-icons/fc";
import { IoMdCheckmark } from "react-icons/io";
import { MdDelete, MdModeEditOutline } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";

const AgricMana = () => {
  const [productList, setProductList] = useState([]);
  const [productFilter, setProductFilter] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");
  const [input, setInput] = useState("");
  const [focus, setFocus] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  const myProducts = useSelector((state) => state);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedToken = localStorage.getItem("keepLoggedIn");
        setToken(storedToken);

        const response = await axios.get(
          `${baseURL}send/user/${myProducts.user}`
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
    navigate(`/agricpage/${product.id}`); // Navigate to the product detail page
  };

  const ListHeader = () => (
    <div className="flex flex-row bg-[#f5a53d] py-2 px-1 text-lg">
      <div className="w-1/6 font-semibold">Image</div>
      <div className="w-1/6 font-semibold">Image</div>
      <div className="w-1/6 font-semibold">Name</div>
      <div className="w-1/6 font-semibold">Price</div>
      <div className="w-1/6 font-semibold">Approve</div>
      <div className="w-1/6 font-semibold text-center">Views</div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#f5a53d] pt-20">
      {/* Header */}
      <div className="flex items-center justify-between px-4 mt-2 md:mt-8 bg-[#f5a53d]">
        <Link to="/dash">
          <IoArrowBack size={30} />
        </Link>
        <div className="relative w-3/4 rounded-full flex items-center px-4">
          <i className="fas fa-search text-black"></i>
          <input
            type="text"
            placeholder="Search by name"
            className="w-full rounded-3xl focus:border-none h-12 border-none outline-none"
            value={input}
            onFocus={() => setFocus(true)}
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
            <ListHeader />
            {productFilter.map((item, index) => (
              <div
                key={item.id}
                className={`flex items-center justify-between p-2 ${
                  index % 2 === 0 ? "bg-white" : "bg-[#f5a53d]"
                }`}
                onClick={() => handleProductClick(item)}
              >
                <img
                  src={item.picture}
                  alt="Product"
                  className="h-12 md:h-40 md:w-40 w-12 mr-2 object-cover"
                />
                <img
                  src={item.picturesec}
                  alt="Product secondary"
                  className="h-12 md:h-40 md:w-40 w-12 mr-2 object-cover"
                />
                <p className="truncate text-sm sm:text-base md:text-lg lg:text-xl font-bold text-center w-1/4 sm:w-1/5 md:w-1/6">
                  {item.name}
                </p>
                <p className="w-1/6 truncate md:flex md:text-lg md:font-bold md:justify-center">
                  {item.price}
                </p>
                <p className="w-1/6 flex justify-center md:mr-20">
                  {item.approved ? (
                    <IoMdCheckmark color="green" size={30} />
                  ) : (
                    <FcCancel size={30} />
                  )}
                </p>
                <p className="w-1/6 md:text-lg md:font-bold text-center">
                  {item.views}
                </p>
              </div>
            ))}
          </>
        ) : (
          <div className="text-center text-lg font-medium">
            You have not posted any fashion or electronic product yet. Please
            feel free to sell your products.
          </div>
        )}
      </div>

      {/* Modal */}
      {modalVisible && selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 relative">
            <button
              className="absolute top-2 right-2 text-black"
              onClick={() => setModalVisible(false)}
            >
              <AiOutlineClose size={20} />
            </button>
            <div className="flex flex-col items-center">
              <button className="p-2 rounded-md mb-4">
                <MdModeEditOutline size={30} />
              </button>
              <button
                className="p-2 rounded-md"
                onClick={() => {
                  deleteProducts(selectedProduct.id);
                  setModalVisible(false);
                }}
              >
                <MdDelete color="red" size={30} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgricMana;
