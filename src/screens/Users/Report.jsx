import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { FaWhatsapp, FaPhoneAlt, FaExclamationTriangle } from "react-icons/fa";
import baseURL from "../../assets/baseURL";


const Report = () => {
  const myProducts = useSelector((state) => state);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (myProducts.user) {
      fetchUserData();
    }
  }, [myProducts.user]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${baseURL}userbyid/${myProducts.user.id}`);
      setUserData(response.data);
      console.log(response.data.report);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

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
    <div className="bg-black min-h-screen flex flex-col items-center justify-center text-white p-5">
      <div className="flex flex-col items-center">
        <FaExclamationTriangle className="text-red-600 text-5xl mb-4" />
        <h2 className="text-xl font-bold mb-6">There is something wrong with your account</h2>
      </div>

      {userData ? (
        <div className="text-center">
          <p className="text-lg mb-3">
            Name: <span className="text-red-500">{userData.name} {userData?.lastname}</span>
          </p>
          <p className="text-lg mb-3">
            Email: <span className="text-red-500">{userData.email}</span>
          </p>
          <p className="text-lg mb-3">
            Phone Number: <span className="text-red-500">{userData.phone}</span>
          </p>
          <p className="text-lg mt-6">
            <span className="text-red-500">{userData.name}</span>, call for your account to be rectified.
          </p>

          <div className="flex justify-between mt-6 mx-6">
            <button onClick={openWhatsApp} className="text-4xl text-green-500 hover:text-green-400 transition">
              <FaWhatsapp />
            </button>
            <button onClick={openDial} className="text-4xl text-green-500 hover:text-green-400 transition">
              <FaPhoneAlt />
            </button>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Report;
