import React from "react";
import { FaPhoneAlt, FaWhatsappSquare } from "react-icons/fa";
import { TbPhoneCall } from "react-icons/tb";

const CallCenter = () => {
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-6">
      <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 text-center">
        Need help? We're here to assist you.
      </h1>

      <p className="text-gray-600 text-center mt-2 md:text-lg">
        Contact us via WhatsApp or call for immediate support.
      </p>

      <div className="mt-10 flex gap-10">
        {/* WhatsApp Button */}
        <button
          onClick={openOfficeWhatsapp}
          className="flex flex-col items-center space-y-2 text-green-600 hover:text-green-700 transition duration-300"
        >
          <FaWhatsappSquare size={50} className="hover:scale-110 transition" />
          <span className="text-lg font-medium">WhatsApp</span>
        </button>

        {/* Call Button */}
        <button
          onClick={openDial}
          className="flex flex-col items-center space-y-2 text-green-500  transition duration-300"
        >
          <TbPhoneCall size={50} className="hover:scale-110 transition" />
          <span className="text-lg font-medium">Call</span>
        </button>
      </div>
    </div>
  );
};

export default CallCenter;
