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
import Container from '../../components/ui/Container';



function Advert() {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false); 
    const [selectedItem, setSelectedItem] = useState(null); 
    const navigate = useNavigate(); 
    const UserState = useSelector((state) => state);
    const swiperRef = useRef(null);
    const [userData, setUserData] = useState({ name: '', email: '', phone: '' });
    const [networkError, setNetworkError] = useState(false); 
  

  


// console.log(UserState)

useEffect(() => {
  const incrementPlatfUsed = async () => {
    try {
      await axios.get(`${baseURL}user/${UserState.user.id}/platused`);
      console.log("✅ platfUsed incremented");
    } catch (error) {
      console.error("❌ Failed to increment platfUsed:", error.message);
    }
  };

  if (UserState?.user?.id) {
    incrementPlatfUsed();
  }
}, [UserState.user?.id]);



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
                const response = await axios.get(`${baseURL}userbyid/${UserState.user.id}`);
                const data = response.data;
                setUserData({ name: data.name, email: data.email, phone: data.phone });
                // console.log("User info",data)
                if (data.report) {
                    navigate('/report'); 
                    return;
                } 
                await updateLastSeen();
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };


        fetchData();
        fetchUserData();
    }, [UserState.user, navigate]);


    const updateLastSeen = async () => {
  try {
    await axios.put(`${baseURL}${UserState.user.id}/lastseen`);
    console.log("Last seen updated");
  } catch (error) {
    console.error('Failed to update lastSeen:', error);
  }
};



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
            <div className="flex items-center justify-center h-screen bg-ink-50">
               <Loader />
            </div>
        );
    }




    return (
        <div className="flex flex-col min-h-screen bg-ink-50 pt-16 pb-10 sm:pt-20 md:pt-24">
            <Container>
                <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white p-4 shadow-card sm:p-6 md:p-8">
                    <div className="flex flex-col gap-6">
                        <div className="relative flex-1 overflow-hidden rounded-2xl bg-ink-900">
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
                                className="relative overflow-hidden rounded-2xl"
                            >
                                {/* Images */}
                                {images.length > 0 &&
                                    images.map((image, index) => (
                                        <SwiperSlide key={index} className="flex justify-center items-center">
                                            <img className="object-contain w-[90%] max-h-[70vh]" src={image} alt={`Slide ${index}`} />

                                            <button
                                                onClick={handlePressCallButton}
                                                className="animate-heartbeat absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-green-600 shadow-soft"
                                            >
                                                <TbPhoneCall className="text-3xl md:text-5xl" />
                                            </button>
                                        </SwiperSlide>
                                    ))}
                            </Swiper>
                        </div>

                        <p className="text-center text-sm font-semibold text-ink-700 md:text-lg">
                            Use your thumb or your mouse pointer to stop the adds.
                        </p>

                        <p className="animate-heartbeat text-center text-sm font-bold text-brand-600 md:text-lg">
                            Send us your flier for advertisement using the buttons below.
                        </p>

                        <div className="flex items-center justify-center gap-6">
                            <button
                                onClick={openDial}
                                aria-label="Call Linkpii"
                                className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-green-600 shadow-soft transition-colors hover:bg-brand-100"
                            >
                                <FaPhoneAlt size={26} />
                            </button>

                            <button
                                onClick={openOfficeWhatsapp}
                                aria-label="Chat with Linkpii on WhatsApp"
                                className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-600 shadow-soft transition-colors hover:bg-green-100"
                            >
                                <FaWhatsappSquare size={30} />
                            </button>
                        </div>

                        {isModalVisible && selectedItem && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/50 px-4">
                                <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                                    <div className="mb-4 flex items-start justify-between gap-4">
                                        <p className="text-lg font-bold text-ink-800">
                                            Welcome to {selectedItem?.name}, feel free to call or chat with us.
                                        </p>
                                        <button
                                            onClick={() => setIsModalVisible(false)}
                                            className="shrink-0 rounded-full p-1.5 text-ink-400 hover:bg-ink-50 hover:text-ink-800"
                                            aria-label="Close"
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                    <div className="flex justify-center gap-4">
                                        <button
                                            onClick={openDialAdvert}
                                            className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600 transition-colors hover:bg-brand-100"
                                            aria-label="Call"
                                        >
                                            <FaPhoneAlt size={22} />
                                        </button>
                                        <button
                                            onClick={WhatsApp}
                                            className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-600 transition-colors hover:bg-green-100"
                                            aria-label="WhatsApp"
                                        >
                                            <FaWhatsappSquare size={26} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Container>

            {networkError && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/50 px-4">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl">
                        <h2 className="font-display text-xl font-bold text-red-500">No internet connection</h2>
                        <p className="mt-2 text-sm text-ink-600">Check your internet connection and try again</p>
                        <button
                            className="mt-4 rounded-xl bg-brand-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-brand-700"
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
