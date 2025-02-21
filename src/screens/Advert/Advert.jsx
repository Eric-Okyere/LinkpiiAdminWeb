import React, { useState, useEffect, useRef } from 'react';
import baseURL from '../../assets/baseURL';
import { FaPhoneAlt, FaWhatsappSquare } from 'react-icons/fa'; 
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import { TbPhoneCall } from "react-icons/tb";
import Loader from '../../components/Loader';
import { FaTimes } from "react-icons/fa";



function Advert() {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false); 
    const [selectedItem, setSelectedItem] = useState(null); 
    const navigate = useNavigate(); 
    const myProducts = useSelector((state) => state);
    const swiperRef = useRef(null);
    const [userData, setUserData] = useState({ name: '', email: '', phone: '' });
    const [networkError, setNetworkError] = useState(false); 
  

  


// console.log(myProducts)


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${baseURL}advert`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch data: ${response.statusText}`);
                }
                const data = await response.json();
                setItems(data);
                setIsLoading(false); 
                
            } catch (error) {
                console.error('Error fetching data:', error.message);
               
                setIsLoading(false); 
                setNetworkError(true);
            }
        };

        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${baseURL}userbyid/${myProducts.user.id}`);
                const data = response.data;
                setUserData({ name: data.name, email: data.email, phone: data.phone });
                // console.log("User info",data)
                if (data.report) {
                    navigate('/report'); 
                    return;
                } 
                
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };


        fetchData();
        fetchUserData();
    }, [myProducts.user, navigate]);

    const images = items.map((item) => item.picture).filter(Boolean);

    const openDialAdvert = async () => {
        if (!selectedItem) return;
    
        try {
            // Send user data to the backend
            const response = await fetch(`${baseURL}call`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: userData.name,
                    email: userData.email,
                    phone: userData.phone,
                    receiverphone: selectedItem.phone,
                    recname: selectedItem.name,
                    pagename: "Advert Website",
                }),
            });
    
            if (!response.ok) {
                throw new Error(`Failed to send user data. Server responded with ${response.status}`);
            }
    
            const result = await response.json();
            // console.log("User info sent successfully for call:", result);
    
            // Redirect to dial phone number
            if (selectedItem?.phone) {
                window.location.href = `tel:${selectedItem.phone}`;
            }
        } catch (error) {
            console.error("Error sending user info to backend for call:", error);
        }
    
        setIsModalVisible(false);
    };
    

    const handleSlideChange = () => {
        const swiper = swiperRef.current?.swiper; 
        if (swiper) {
            const currentSlide = swiper.slides[swiper.activeIndex];
    
            if (currentSlide && currentSlide.dataset.type === "video") {
                swiper.params.autoplay.delay = 10000; // 10 seconds for videos
            } else {
                swiper.params.autoplay.delay = 3000; // 3 seconds for images
            }
            swiper.autoplay.start();
        }
    };

    useEffect(() => {
        const swiper = swiperRef.current?.swiper;
    
        if (swiper) {
            swiper.params.autoplay.reverseDirection = false; // Start with normal direction
            swiper.autoplay.start(); // Ensure autoplay starts
        }
    }, []);



      const handlePressCallButton = () => {
        if (swiperRef.current?.swiper) {
            const activeIndex = swiperRef.current.swiper.activeIndex;
            const item = items[activeIndex]; // Get item from active slide
            setSelectedItem(item); // Store selected item to keep details static
            setIsModalVisible(true);
        }
    };
    

    const WhatsApp = async () => {
        if (!selectedItem) return;
    
        try {
            // Send user data to the backend
            const response = await fetch(`${baseURL}whatsapp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: userData.name,
                    email: userData.email,
                    phone: userData.phone,
                    receiverphone: selectedItem.phone,
                    recname: selectedItem.name,
                    pagename: "Advert Website",
                }),
            });
    
            if (!response.ok) {
                throw new Error(`Failed to send user data. Server responded with ${response.status}`);
            }
    
            const result = await response.json();
            // console.log("User info sent successfully:", result);
    
            // Open WhatsApp after successful API call
            openWhatsApp();
        } catch (error) {
            console.error("Error sending user info to backend:", error);
            // alert("Failed to send data. Please try again.");
        }
    };
    
    

    const openWhatsApp = () => {
        if (!selectedItem?.whatsapp) {
            console.error("WhatsApp number is missing.");
            return;
        }
    
        const encodedMessage = encodeURIComponent(
            `Hello ${selectedItem.name},I saw your advertisement Linkpii. Can I get more info?`
        );
        const whatsappURL = `https://wa.me/${selectedItem.whatsapp}?text=${encodedMessage}`;
    
        // Use location.href for mobile users
        if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
            window.location.href = whatsappURL;
        } else {
            window.open(whatsappURL, "_blank");
        }
    
        setIsModalVisible(false);
    };


   
    const openDial = () => {
        window.location.href = "tel:+233209317581";
      };
    
     
      
      const openOfficeWhatsapp = () => {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile) {
            window.location.href = "https://wa.me/233209317581";
        } else {
            window.open("https://wa.me/233209317581", "_blank");
        }
    };
    

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
               <Loader />
            </div>
        );
    }




    return (
        <div className="flex flex-col min-h-screen bg-[#f5a53d] md:pt-20 lg:pt-20 pt-16 px-4 md:px-12 font-serif">
            <div className="shadow-md rounded-lg p-6 md:p-8 mb-10">
                <div className="flex flex-col gap-8">
                    <div className="flex-1">
                        <Swiper
                            ref={swiperRef}
                            modules={[Pagination, Navigation, Autoplay]}
                            pagination={{ clickable: true }}
                            navigation
                            autoplay={{
                                delay: 3000, // Default to 3 seconds
                                disableOnInteraction: false,
                            }}
                            onSlideChange={handleSlideChange}
                            className="relative overflow-hidden rounded-lg"
                        >
                            {/* Images */}
                            {images.length > 0 &&
                                images.map((image, index) => (
                                    <SwiperSlide key={index} className="flex justify-center items-center">
                                        <img className="object-contain w-[90%] max-h-[70vh]" src={image} alt={`Slide ${index}`} />
                                    
                           <button     
                            onClick={handlePressCallButton}  
                            className="absolute bg-[#f5a53d] p-1 rounded-full md:mt-40 lg:top-[50%] top-[50%] left-1/2 transform -translate-x-1/2 text-green-500 z-30 animate-heartbeat"
                        >
                           <TbPhoneCall className='md:text-5xl text-3xl lg:text'/>
                        </button>
                                    </SwiperSlide>
                                ))}

                          
                        </Swiper>

                       
                       
                    </div>

                                <div className='flex justify-center font-bold -mt-8 text-sm md:text-xl lg:text-xl'>
                                <h1 className=''>Use your thumb or your mouse pointer to stop the adds.</h1>
                                </div>
                                


                                <div className='flex justify-center font-bold md:text-lg lg:text-lg -mt-6 text-sm animate-heartbeat'>
                                    <h1>Send us your flier for advertisement using the buttons below.</h1>
                                </div>
                   


                       <div className="flex justify-between -mt-6 mx-4 md:mx-32 lg:mx-32">
                        
                        <button onClick={openDial} className="text-green-500">
                            <FaPhoneAlt size={36} />
                        </button>

                        <button onClick={openOfficeWhatsapp} className="text-green-500">
                            <FaWhatsappSquare size={40} />
                        </button>
                    </div>




                                {isModalVisible && selectedItem && (
                        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-10">
                            <div className="bg-white p-6 rounded-lg w-4/5 max-w-md shadow-lg">
                            <button onClick={() => setIsModalVisible(false)} className="text-black font-bold text-lg text-end flext justify-end items-end"><FaTimes /></button>
                                <p className="text-lg font-bold text-gray-800 mb-4">
                                    Welcome to {selectedItem?.name}, feel free to call or chat with us.
                                </p>
                                <div className="flex justify-between mb-4">
                                    <button onClick={openDialAdvert} className="p-3 text-white text-lg">
                                        <FaPhoneAlt size={30} color="green" />
                                    </button>
                                    <button onClick={WhatsApp} className="p-3 text-white text-lg">
                                        <FaWhatsappSquare size={35} color="green" />
                                    </button>
                                </div>
                                
                            </div>
                        </div>
                    )}


                </div>
            </div>


            {networkError && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-xl font-bold text-red-500">No internet connection</h2>
          <p className="text-gray-700 mt-2">Check your internet connection and try again</p>
            <button
              className="mt-4 bg-[#f5a53d] text-white px-4 py-2 rounded-md"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </button>
          </div>
        </div>
      )}







        </div>
    );
}

export default Advert;
