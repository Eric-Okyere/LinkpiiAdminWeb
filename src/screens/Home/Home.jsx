import React, { useState, useEffect, useRef } from 'react';
import baseURL from '../../assets/baseURL';
import { FaPhoneAlt, FaWhatsappSquare, FaTimes } from 'react-icons/fa';
import { TbPhoneCall } from "react-icons/tb";
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import Loader from '../../components/Loader';
import { FaArrowRightFromBracket } from "react-icons/fa6";
import Categories from '../Agric/Categories';

function Home() {
  const [items, setItems] = useState([]); // adverts
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();
  const UserState = useSelector((state) => state);
  const swiperRef = useRef(null);
  const [userData, setUserData] = useState({ name: '', email: '', phone: '' });
  const [networkError, setNetworkError] = useState(false);

  // all products
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [columns, setColumns] = useState([[], [], []]); // Masonry layout
  const [categories, setCategories] = useState([]);

  const fallbackImage = "https://via.placeholder.com/300x200?text=No+Image";

  // increment platform used
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

  // fetch adverts + products
  const fetchData = async () => {
    try {
      // adverts separate
      const advertResponse = await fetch(`${baseURL}advert`);
      if (!advertResponse.ok) throw new Error("Failed to fetch adverts");
      const advertData = await advertResponse.json();

      // other hot products
      const [fashionResponse, buildingResponse, shopResponse] = await Promise.all([
        fetch(`${baseURL}fashionpost/hot`),
        fetch(`${baseURL}buildings/hot/building`),
        fetch(`${baseURL}shops/hot/shops`),
      ]);

      if (!fashionResponse.ok || !buildingResponse.ok || !shopResponse.ok) {
        throw new Error("Failed to fetch some product data");
      }

      const fashionData = await fashionResponse.json();
      const buildingData = await buildingResponse.json();
      const shopData = await shopResponse.json();

      // combine with type + random heights
      const combined = [
        ...fashionData.map(item => ({ ...item, type: "fashion", imgHeight: 60 + Math.random() * 80 })),
        ...buildingData.map(item => ({ ...item, type: "building", imgHeight: 60 + Math.random() * 80 })),
        ...shopData.map(item => ({ ...item, type: "shop", imgHeight: 60 + Math.random() * 80 })),
      ];

      // distribute into masonry columns
      const cols = [[], [], []];
      let columnHeights = [0, 0, 0];
      combined.forEach(item => {
        const shortest = columnHeights.indexOf(Math.min(...columnHeights));
        cols[shortest].push(item);
        columnHeights[shortest] += item.imgHeight;
      });

      setColumns(cols);
      setItems(advertData);
      setProducts(combined);
      setFilteredProducts(combined);

      setIsLoading(false);
      setNetworkError(false);
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setIsLoading(false);
      setNetworkError(true);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${baseURL}userbyid/${UserState.user.id}`);
      const data = response.data;
      setUserData({ name: data.name, email: data.email, phone: data.phone });

      if (data.report) {
        navigate('/report');
        return;
      }
      await updateLastSeen();
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const updateLastSeen = async () => {
    try {
      await axios.put(`${baseURL}${UserState.user.id}/lastseen`);
    } catch (error) {
      console.error('Failed to update lastSeen:', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchUserData();
  }, [UserState.user, navigate]);

  // swiper images (adverts)
  const images = items.map((item) => item.picture).filter(Boolean);

  const handleSlideChange = () => {
    const swiper = swiperRef.current?.swiper;
    if (swiper) {
      const currentSlide = swiper.slides[swiper.activeIndex];
      swiper.params.autoplay.delay = currentSlide?.dataset.type === "video" ? 10000 : 3000;
      swiper.autoplay.start();
    }
  };

  const handlePressCallButton = () => {
    if (swiperRef.current?.swiper) {
      const activeIndex = swiperRef.current.swiper.activeIndex;
      const item = items[activeIndex];
      setSelectedItem(item);
      setIsModalVisible(true);
    }
  };

  // open dial / whatsapp for advert
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

  const openDial = () => window.location.href = "tel:+233209317581";
  const openOfficeWhatsapp = () => {
    const url = "https://wa.me/233209317581";
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) window.location.href = url;
    else window.open(url, "_blank");
  };

  // loader
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <Loader />
      </div>
    );
  }


const handleProductClick = async (product) => {
  try {
    let productData;

    if (product.type === "fashion") {
      const response = await fetch(`${baseURL}fashionpost/products/${product._id}`);
      if (!response.ok) throw new Error("Failed to fetch fashion product details");
      productData = await response.json();
    } else if (product.type === "building") {
      const response = await fetch(`${baseURL}buildings/products/${product._id}`);
      if (!response.ok) throw new Error("Failed to fetch building product details");
      productData = await response.json();
    } else if (product.type === "shop") {
      const response = await fetch(`${baseURL}shops/products/${product._id}`);
      if (!response.ok) throw new Error("Failed to fetch shop product details");
      productData = await response.json();
    }

    // Navigate with product data
    navigate(`/detail/${product.type}/${product._id}`, { state: { ...productData, type: product.type } });
  } catch (error) {
    console.error("Error fetching product details:", error);
    alert("Something went wrong. Please check your internet connection.");
  }
};



  return (
    <div className="flex flex-col min-h-screen bg-[#f5a53d] md:pt-20 lg:pt-20 pt-16 px-4 md:px-12 font-serif">

      {/* Advert Slider */}
      <div className="shadow-md rounded-lg mt-10 mb-10">
        <Swiper
          ref={swiperRef}
          modules={[Pagination, Navigation, Autoplay]}
          // pagination={{ clickable: true }}
          // navigation
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          onSlideChange={handleSlideChange}
          className="relative overflow-hidden rounded-lg"
        >
          {images.length > 0 &&
            images.map((image, index) => (
              <SwiperSlide key={index} className="flex justify-center items-center">
                <img className="w-[260vh] h-[50vh] sm:h-[60vh] md:h-[70vh] object-contain" src={image} alt={`Slide ${index}`} />
                <button
                  onClick={handlePressCallButton}
                  className="absolute bg-transparent p-1 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 text-green-500 z-30 animate-heartbeat"
                >
                  <TbPhoneCall className="md:text-5xl text-3xl"  />
                <h1 className='-ml-1'>Call now</h1>
                </button>
              </SwiperSlide>
            ))}
        </Swiper>

         <div className="flex justify-between mx-4 md:mx-32 ">
        <button onClick={openDial} className="text-green-500">
          <FaPhoneAlt className='text-xl md:text-2xl' />
        </button>
          <div className='flex justify-center font-bold md:text-lg lg:text-lg  text-sm animate-heartbeat'>
       <h4 className='text-[10px] md:text-sm md:mt-5'>Send your flier to be posted here for advertisement. </h4>
                </div>
        <button onClick={openOfficeWhatsapp} className="text-green-500">
          <FaWhatsappSquare className='text-xl md:text-2xl'/>
        </button>
      </div>
      </div>

      {/* Office contact buttons */}
     

       {/* <div className='flex justify-center font-bold -mt-8 text-sm md:text-xl lg:text-xl'>
                                <h1 className=''>Use your thumb or your mouse pointer to stop the adds.</h1>
                                </div> */}
                                


               

     
      {/* Masonry Products */}
      <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 mb-10">
        {columns.map((col, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-4">
            {col.map((product) => (
              <div key={product._id}  onClick={() => handleProductClick(product)}>
                 <div className="mb-2 bg-gray-200 rounded-lg shadow-lg p-3 break-inside-avoid">
                   {product.discount && (
                    <div className="absolute bg-[#f5a53d] text-black text-xs font-bold px-2 py-1 rounded-tr-lg rounded-bl-lg ">
                      {product.discount}% OFF
                    </div>
                   )}
                    {/* Product Image */}
                    <img
                      src={product.picture || fallbackImage}
                      alt={product.name || "No Image"}
                      className="w-full object-cover rounded-lg"
                      style={{ height: `${120 + Math.random() * 100}px` }} // Random heights
                    />

                    {/* Product Details */}
                    <div className="mt-3 w-full text-center sm:text-left">
                      <h3 className="text-sm font-semibold truncate">{product.name}</h3>
                      {!product.price ?
                    (<>
                    <h3 className="text-md text-[#f5a53d] font-bold">Call for price</h3>
                    </>
                    ):(
                    <>
                     <p className="text-md text-[#f5a53d] font-bold">Gh¢{product.price}</p>
                    </>)  
                    }
                     
                      <p className="text-xs text-gray-600 truncate">
                        {product.region}, {product.town}, {product.location}
                      </p>
                      {product.condition && (
                         <p className="text-xs text-end text-[#f5a53d] ">
                        {product.condition}
                      </p>
                      )}
                     
                    </div>
                  </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Advert Modal */}
      {isModalVisible && selectedItem && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-10">
          <div className="bg-white p-6 rounded-lg w-4/5 max-w-md shadow-lg">
            <button onClick={() => setIsModalVisible(false)} className="text-black font-bold text-lg float-right">
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

      {/* Network Error */}
    
    </div>
  );
}

export default Home;
