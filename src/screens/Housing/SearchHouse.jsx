import React from "react";
import { FaPhoneAlt, FaWhatsappSquare } from 'react-icons/fa';
import ListingCard from "../../components/ui/ListingCard";
import EmptyState from "../../components/ui/EmptyState";

const SearchHouse = ({ productFiltered }) => {
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
    <div className="relative">
      {productFiltered.length > 0 ? (
        <div className="grid max-h-[600px] grid-cols-2 gap-3 overflow-y-auto pb-16 sm:grid-cols-3">
          {productFiltered.map((item) => (
            <ListingCard
              key={item._id}
              href={`/buildingdetail/${item._id}`}
              image={item.picture}
              title={item.name}
              meta={[item.region, item.town, item.location].filter(Boolean).join(", ")}
            />
          ))}
        </div>
      ) : (
        <div className="mt-6 flex flex-col items-center">
          <EmptyState
            title="Wrong input"
            subtitle="Contact us to link you to your preferred product."
          />

          <div className="mt-5 flex gap-8">
            <button
              onClick={openDial}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-600 transition-colors hover:bg-green-100"
              aria-label="Call"
            >
              <FaPhoneAlt size={28} />
            </button>

            <button
              onClick={openOfficeWhatsapp}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-600 transition-colors hover:bg-green-100"
              aria-label="WhatsApp"
            >
              <FaWhatsappSquare size={32} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchHouse;
