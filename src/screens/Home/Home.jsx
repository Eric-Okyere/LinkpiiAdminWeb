import React, { useState, useEffect, useRef } from 'react';
import baseURL from '../../assets/baseURL';
import { FaPhoneAlt, FaWhatsappSquare, FaTimes } from 'react-icons/fa';
import { TbPhoneCall } from "react-icons/tb";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import Loader from '../../components/Loader';
import axios from 'axios';
import PhoneInput from "react-phone-input-2";

function Home() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibleNum, setIsModalVisibleNum] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();
  const UserState = useSelector((state) => state);
  const swiperRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [columns, setColumns] = useState([]);
  const [userData, setUserData] = useState({ name: '', email: '', phone: '' });
  const fallbackImage = "https://via.placeholder.com/300x200?text=No+Image";
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  

  // fetch user data
  const fetchUserData = async () => {
    try {

       if (!UserState?.user?.id) {
      console.warn("No user ID found, skipping fetchUserData");
      return;
    }


      const response = await axios.get(`${baseURL}userbyid/${UserState.user.id}`);
      const data = response.data;
      setUserData({ name: data.name, email: data.email, phone: data.phone });
      if (data.report) {
        navigate('/report');
        return;
      }

       if (!data.phone) {
      setIsModalVisibleNum(true);
      return;
    }
      await updateLastSeen();
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };



  useEffect(() => {
    fetchUserData();
  }, [UserState.user, navigate]);

  // fetch adverts & products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const advertResponse = await fetch(`${baseURL}advert`);
        const adverts = await advertResponse.json();

        const [fashion, building, shop] = await Promise.all([
          fetch(`${baseURL}fashionpost/hot`).then(res => res.json()),
          fetch(`${baseURL}buildings/hot/building`).then(res => res.json()),
          fetch(`${baseURL}shops/hot/shops`).then(res => res.json()),
        ]);

        const combined = [
          ...fashion.map(p => ({ ...p, type: "fashion" })),
          ...building.map(p => ({ ...p, type: "building" })),
          ...shop.map(p => ({ ...p, type: "shop" })),
        ];

        setProducts(combined);
        setItems(adverts);

        // split into columns
        const numCols = 5;
        const colArray = Array.from({ length: numCols }, () => []);
        combined.forEach((product, i) => {
          colArray[i % numCols].push(product);
        });
        setColumns(colArray);
        setIsLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [UserState.user?.id]);

  // increment platfUsed
  useEffect(() => {
    const incrementPlatfUsed = async () => {
      try {
        await axios.get(`${baseURL}user/${UserState.user.id}/platused`);
      } catch (error) {
        console.error("❌ Failed to increment platfUsed:", error.message);
      }
    };
    if (UserState?.user?.id) incrementPlatfUsed();
  }, [UserState.user?.id]);

  const images = items.map((item) => item.picture).filter(Boolean);

const handleProductClick = async (product) => {
  if (UserState.login === false) {
    navigate("/loginform");
    return;
  }

  try {
    let url = "";

    if (product.type === "fashion") {
      url = `${baseURL}fashionpost/products/${product._id}`;
    } else if (product.type === "building") {
      url = `${baseURL}buildings/products/${product._id}`;
    } else if (product.type === "shop") {
      url = `${baseURL}shops/products/${product._id}`;
    } else {
      console.warn("Unknown product type:", product.type);
      return;
    }

    const response = await axios.get(url);
    const fullProductData = response.data;

    // ✅ Pass full product data to detail page
    navigate(`/detail/${product.type}/${product._id}`, { state: { ...fullProductData } });
  } catch (error) {
    console.error("Error fetching product details:", error);
  }
};


  // 👉 opens modal for active advert
  const handlePressCallButton = () => {
    if (swiperRef.current?.swiper) {
      const activeIndex = swiperRef.current.swiper.activeIndex;
      const item = items[activeIndex];
      if (item) {
        setSelectedItem(item);
        setIsModalVisible(true);
      }
    }
  };

  const updateLastSeen = async () => {
    try {
      await axios.put(`${baseURL}${UserState.user.id}/lastseen`);
    } catch (error) {
      console.error('Failed to update lastSeen:', error);
    }
  };

  const openDialAdvert = async () => {
    if (!selectedItem) return;
    try {
      await fetch(`${baseURL}call`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          receiverphone: selectedItem.phone,
          recname: selectedItem.name,
          pagename: "Advert Website",
        }),
      });
      if (selectedItem?.phone) window.location.href = `tel:${selectedItem.phone}`;
    } catch (error) {
      console.error("Error sending user info for call:", error);
    }
    setIsModalVisible(false);
  };

  const WhatsApp = async () => {
    if (!selectedItem) return;
    try {
      await fetch(`${baseURL}whatsapp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          receiverphone: selectedItem.phone,
          recname: selectedItem.name,
          pagename: "Advert Website",
        }),
      });
      openWhatsApp();
    } catch (error) {
      console.error("Error sending user info for WhatsApp:", error);
    }
  };

  const openWhatsApp = () => {
    if (!selectedItem?.whatsapp) return;
    const encodedMessage = encodeURIComponent(
      `Hello ${selectedItem.name}, I saw your advertisement on Linkpii. Can I get more info?`
    );
    const whatsappURL = `https://wa.me/${selectedItem.whatsapp}?text=${encodedMessage}`;
    if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
      window.location.href = whatsappURL;
    } else {
      window.open(whatsappURL, "_blank");
    }
    setIsModalVisible(false);
  };

  const openOfficeWhatsapp = () => {
    const url = "https://wa.me/233209317581";
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) window.location.href = url;
    else window.open(url, "_blank");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <Loader />
      </div>
    );
  }

 const handleSaveUserData = async () => {
  try {
    const payload = { ...userData }; 
     const response = await axios.put(`${baseURL}card/${UserState.user.id}/details`, payload);
    if (response.status === 200) {
      // ✅ Success: close modal
      setIsModalVisibleNum(false);

      // update user state
      setUserData(payload);
    }
  
  } catch (err) {
    console.error("Error saving user data", err);
  }
};





  return (
    <div className="flex flex-col min-h-[100vh] bg-[#f5a53d] pt-16 sm:pt-20 md:pt-24 px-4 sm:px-6 md:px-8 font-serif">

      {/* Advert Slider */}
      <div className="shadow-md rounded-lg mb-10">
        <Swiper
          ref={swiperRef}
          modules={[Pagination, Navigation, Autoplay]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          className="rounded-lg"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index} className="flex justify-center items-center">
              <img
                src={image}
                alt={`Slide ${index}`}
                className="w-[260vh] h-[50vh] sm:h-[60vh] md:h-[70vh] object-contain"
              />
              <button
                onClick={handlePressCallButton}
                className="absolute bg-transparent p-2 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-green-500 z-30 animate-heartbeat"
              >
                <TbPhoneCall className="md:text-5xl text-3xl" />
                {/* <h1 className="text-sm md:text-base">Call now</h1> */}
              </button>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Bottom bar */}
        <div className="flex justify-between mx-4 md:mx-32 ">
          <button onClick={handlePressCallButton} className="text-green-500">
            <FaPhoneAlt className='text-xl md:text-2xl' />
          </button>
          <div className='flex justify-center font-bold md:text-lg lg:text-lg  text-sm animate-heartbeat'>
            <h4 className='text-[10px] md:text-sm md:mt-5'>
              Send your flier to be posted here for advertisement.
            </h4>
          </div>
          <button onClick={openOfficeWhatsapp} className="text-green-500">
            <FaWhatsappSquare className='text-xl md:text-2xl' />
          </button>
        </div>
      </div>

      {/* Product Grid */}
      {isSafari ? (
        // Safari → GRID
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-10">
          {products.map((product) => (
            <div
              key={product._id}
              onClick={() => handleProductClick(product)}
              className="bg-gray-200 rounded-lg shadow-lg overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform"
            >
              {product.discount && (
                <div className="absolute bg-[#f5a53d] text-black text-xs font-bold px-2 py-1 rounded-tr-lg rounded-bl-lg">
                  {product.discount}% OFF
                </div>
              )}
              <img
                src={product.picture || fallbackImage}
                alt={product.name || "No Image"}
                className="w-full aspect-[4/3] object-cover"
              />
              <div className="p-3">
                <h3 className="text-sm font-semibold truncate">{product.name}</h3>
                {!product.price ? (
                  <p className="text-md text-[#f5a53d] font-bold">Call for price</p>
                ) : (
                  <p className="text-md text-[#f5a53d] font-bold">Gh¢{product.price}</p>
                )}
                <p className="text-xs text-gray-600 truncate">
                  {product.region}, {product.town}, {product.location}
                </p>
                {product.condition && (
                  <p className="text-xs text-end text-[#f5a53d]">{product.condition}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Others → Masonry
        <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 mb-10">
          {columns.map((col, colIndex) => (
            <div key={colIndex} className="flex flex-col gap-4">
              {col.map((product) => (
                <div key={product._id} onClick={() => handleProductClick(product)}>
                  <div className="mb-2 bg-gray-200 rounded-lg shadow-lg p-3 break-inside-avoid">
                    {product.discount && (
                      <div className="absolute bg-[#f5a53d] text-black text-xs font-bold px-2 py-1 rounded-tr-lg rounded-bl-lg ">
                        {product.discount}% OFF
                      </div>
                    )}
                    <img
                      src={product.picture || fallbackImage}
                      alt={product.name || "No Image"}
                      className="w-full object-cover rounded-lg"
                      style={{ height: "50%" }}
                    />
                    <div className="mt-3 w-full text-center sm:text-left">
                      <h3 className="text-sm font-semibold truncate">{product.name}</h3>
                      {!product.price ? (
                        <h3 className="text-md text-[#f5a53d] font-bold">Call for price</h3>
                      ) : (
                        <p className="text-md text-[#f5a53d] font-bold">Gh¢{product.price}</p>
                      )}
                      <p className="text-xs text-gray-600 truncate">
                        {product.region}, {product.town}, {product.location}
                      </p>
                      {product.condition && (
                        <p className="text-xs text-end text-[#f5a53d]">{product.condition}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalVisible && selectedItem && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-10">
          <div className="bg-white p-6 rounded-lg w-4/5 max-w-md shadow-lg">
            <button
              onClick={() => setIsModalVisible(false)}
              className="text-black font-bold text-lg float-right"
            >
              <FaTimes />
            </button>
            <p className="text-lg font-bold text-gray-800 mb-4">
              Welcome to {selectedItem?.name}, feel free to call or chat with us.
            </p>
            <div className="flex justify-between">
              <button onClick={openDialAdvert} className="p-3">
                <FaPhoneAlt size={30} color="green" />
              </button>
              <button onClick={WhatsApp} className="p-3">
                <FaWhatsappSquare size={35} color="green" />
              </button>
            </div>
          </div>
        </div>
      )}


      {isModalVisibleNum && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-lg p-6 w-96 max-w-full">
      <h2 className="text-lg font-semibold mb-4 text-center">
        Add Your Phone Number
      </h2>
      <p className="text-sm text-gray-500 mb-4 text-center">
        We need your phone number to continue.
      </p>

      {/* Phone input with country selector */}
      <PhoneInput
  country={"gh"} // default Ghana 🇬🇭
  value={userData.phone}
  onChange={(phone) => {
    // If phone starts with +countryCode followed by 0, strip the 0
    const countryCode = "+" + phone.split(" ")[0]; // e.g. +233
    let cleaned = phone;

    if (cleaned.startsWith(countryCode + "0")) {
      cleaned = countryCode + cleaned.slice(countryCode.length + 1); 
    }

    setUserData({ ...userData, phone: cleaned });
  }}
  inputClass="!w-full !h-11 !text-base !rounded-lg !border !border-gray-300 focus:!ring-2 focus:!ring-[#f5a53d]"
  containerClass="mb-4"
/>


      <button
        onClick={handleSaveUserData}
        className="w-full bg-[#f5a53d] text-white py-2 rounded-lg font-bold hover:opacity-90 transition"
      >
        Save
      </button>
    </div>
  </div>
)}

    </div>
  );
}

export default Home;
