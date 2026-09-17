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
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink-50 px-6">
      <div className="w-full max-w-md rounded-2xl border border-ink-100 bg-white p-8 text-center shadow-card">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
          <TbPhoneCall className="text-2xl" />
        </div>
        <h1 className="font-display text-2xl font-bold text-ink-900 md:text-3xl">
          Need help? We're here to assist you.
        </h1>

        <p className="mt-2 text-ink-500 md:text-lg">
          Contact us via WhatsApp or call for immediate support.
        </p>

        <div className="mt-8 flex justify-center gap-10">
          {/* WhatsApp Button */}
          <button
            onClick={openOfficeWhatsapp}
            className="flex flex-col items-center gap-2 text-green-600 transition-colors hover:text-green-700"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50 transition-transform hover:scale-105">
              <FaWhatsappSquare size={32} />
            </span>
            <span className="text-sm font-semibold">WhatsApp</span>
          </button>

          {/* Call Button */}
          <button
            onClick={openDial}
            className="flex flex-col items-center gap-2 text-brand-600 transition-colors hover:text-brand-700"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 transition-transform hover:scale-105">
              <TbPhoneCall size={32} />
            </span>
            <span className="text-sm font-semibold">Call</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallCenter;
