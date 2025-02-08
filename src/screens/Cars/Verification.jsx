import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { FaWhatsappSquare, FaPhoneAlt } from 'react-icons/fa';
import screen from "../../assets/screen.png";
import baseURL from '../../assets/baseURL';

const Verification = () => {
    const myProducts = useSelector((state) => state);
    const [userData, setUserData] = useState(null);

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`${baseURL}userbyid/${myProducts.user.id}`);
            setUserData(response.data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        if (myProducts.user) {
            fetchUserData();
        }
    }, [myProducts.user]);

  
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

            {userData ? (
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
                        <p className="mb-4 text-lg font-bold">
                            <span className="text-orange-400">{userData.name}</span> send your picture and your Ghana card or any national ID for verification before you can call a driver or a mechanic.
                        </p>
                    </div>

                    <div className="flex justify-between space-x-6 mt-10 mx-24 md:mx-96">
                        <button onClick={openWhatsApp} className="text-green-500">
                            <FaWhatsappSquare size={40} />
                        </button>
                        <button onClick={openDial} className="text-green-500">
                            <FaPhoneAlt size={36} />
                        </button>
                    </div>
                </>
            ) : (
                <p className="text-center">Loading...</p>
            )}
        </div>
    );
};

export default Verification;
