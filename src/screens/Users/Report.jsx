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
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink-50 p-5">
      <div className="w-full max-w-md rounded-2xl border border-ink-100 bg-white p-6 text-center shadow-card sm:p-8">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
          <FaExclamationTriangle className="text-3xl" />
        </div>
        <h2 className="font-display text-xl font-bold text-ink-900">There is something wrong with your account</h2>

        {userData ? (
          <div className="mt-4">
            <p className="mb-2 text-ink-600">
              Name: <span className="font-semibold text-red-500">{userData.name} {userData?.lastname}</span>
            </p>
            <p className="mb-2 text-ink-600">
              Email: <span className="font-semibold text-red-500">{userData.email}</span>
            </p>
            <p className="mb-2 text-ink-600">
              Phone Number: <span className="font-semibold text-red-500">{userData.phone}</span>
            </p>
            <p className="mt-4 text-ink-600">
              <span className="font-semibold text-red-500">{userData.name}</span>, call for your account to be rectified.
            </p>

            <div className="mt-6 flex justify-center gap-6">
              <button
                onClick={openWhatsApp}
                aria-label="WhatsApp"
                className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-3xl text-green-600 transition-colors hover:bg-green-100"
              >
                <FaWhatsapp />
              </button>
              <button
                onClick={openDial}
                aria-label="Call"
                className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-3xl text-green-600 transition-colors hover:bg-green-100"
              >
                <FaPhoneAlt />
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-ink-500">Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Report;
