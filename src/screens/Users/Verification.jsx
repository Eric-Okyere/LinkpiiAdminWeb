import React, { useState, useEffect } from 'react';
import axios from 'axios';
import splash from "../../assets/screen.png";
import baseURL from '../../assets/baseURL';

const Verification = () => {
    const [userData, setUserData] = useState(null);
    
    useEffect(() => {
        const userId = localStorage.getItem('userId'); 
        if (userId) {
            fetchUserData(userId);
        }
    }, []);

    
    useEffect(() => {
        console.log("User:", userData); // Logs when userData is updated
    }, [userData]);


    const fetchUserData = async (userId) => {
        try {
            const response = await axios.get(`${baseURL}userbyid/${userId}`);
            setUserData(response.data);
          
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    console.log("User:", userData)

    const openDial = () => {
        window.location.href = 'tel:+233209317581';
    };

    const openWhatsApp = () => {
        window.open('https://wa.me/233209317581', '_blank');
    };

    return (
        <div className="bg-black min-h-screen p-5 text-center text-white">
            <div className="mt-12">
            {userData.avatar ? (
                <img src={userData.avatar} alt="pic" className="w-48 h-48 mx-auto" />
            ) : (
                <img src={splash} alt="pic" className="w-48 h-48 mx-auto" />
            )}
                
            </div>

            <h2 className="mt-12 text-xl font-bold">Registration Successful.</h2>

            {userData ? (
                <>
                    <div className="mt-10">
                        <h3 className="text-lg font-semibold">Name: <span className="text-yellow-500">{userData.name} {userData?.lastname}</span></h3>
                        <h3 className="text-lg font-semibold">Email: <span className="text-yellow-500">{userData.email}</span></h3>
                        <h3 className="text-lg font-semibold">Phone Number: <span className="text-yellow-500">{userData.phone}</span></h3>
                        <p className="text-yellow-500 mt-5">{userData.name}, send your picture and your Ghana card or any national ID for verification before you can contact a driver or a mechanic.</p>
                    </div>

                    <div className="mt-8 flex justify-center gap-6">
                        <button onClick={openWhatsApp} className="text-2xl text-green-500 hover:text-green-400 transition">
                            WhatsApp
                        </button>
                        <button onClick={openDial} className="text-2xl text-green-500 hover:text-green-400 transition">
                            Call
                        </button>
                    </div>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Verification;
