import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { FaWhatsappSquare, FaPhoneAlt } from 'react-icons/fa';
import screen from "../../assets/screen.png";
import baseURL from '../../assets/baseURL';

const Verification = () => {
    const myProducts = useSelector((state) => state.user._id);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${baseURL}userbyid/${myProducts}`);
            setUserData(response.data);
            // console.log("User data response:", response.data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (myProducts) {
            fetchUserData();
        }
    }, [myProducts]);

    const openDial = () => {
        window.location.href = "tel:+233247747624";
    };
    
    const openWhatsApp = () => {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile) {
            window.location.href = "https://wa.me/233209317581";
        } else {
            window.open("https://wa.me/233209317581", "_blank");
        }
    };

    return (
        <div className="flex flex-col bg-black min-h-screen pt-24 md:pt-32 pb-10 text-white">
            <div className="flex justify-center mb-8">
                <img src={screen} alt="Splash" className="w-48 h-48" />
            </div>

            <div className="text-center mb-8">
                <h1 className="text-lg font-bold">Call Requirements</h1>
            </div>

            {loading ? (
                <p className="text-center">Loading...</p>
            ) : userData ? (
                <>
                    <div className="text-center mb-6">
                        <p className="mb-4 text-lg font-bold">
                            Name: <span className="text-orange-400">{userData.name} {userData.lastname}</span>
                        </p>
                        <p className="mb-4 text-lg font-bold">
                            Email: <span className="text-orange-400">{userData.email}</span>
                        </p>
                        <p className="mb-4 text-lg font-bold">
                            Phone Number: <span className="text-orange-400">{userData.phone}</span>
                        </p>
                        <p className="mb-4 text-lg font-bold mx-4">
                            <span className="text-orange-400">{userData.name}</span> send your picture and your Ghana card or any national ID for verification before you can call a driver or a mechanic.
                        </p>
                    </div>

                    <div className="flex justify-between space-x-6 mt-10 mx-24 md:mx-96">
                        <button onClick={openWhatsApp} aria-label="Open WhatsApp" className="text-green-500 hover:scale-110 transition-transform">
                            <FaWhatsappSquare size={40} />
                        </button>
                        <button onClick={openDial} aria-label="Call Phone Number" className="text-green-500 hover:scale-110 transition-transform">
                            <FaPhoneAlt size={36} />
                        </button>
                    </div>
                </>
            ) : (
                <p className="text-center text-red-500">Failed to load user data</p>
            )}
        </div>
    );
};

export default Verification;
