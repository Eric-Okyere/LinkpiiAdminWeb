import React from "react";
import { FaPhoneAlt, FaWhatsappSquare } from 'react-icons/fa';
import ListingCard from "../../components/ui/ListingCard";
import EmptyState from "../../components/ui/EmptyState";

const ServicesSearch = ({ productFiltered }) => {
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
        <div className="grid grid-cols-2 gap-4 pb-16 sm:grid-cols-3 lg:grid-cols-4">
          {productFiltered.map((item) => (
            <ListingCard
              key={item._id}
              href={`/servicesdetail/${item._id}`}
              image={item.picture}
              title={item.name}
              meta={[item.region, item.town, item.location].filter(Boolean).join(", ")}
            />
          ))}
        </div>
      ) : (
        <div className="pb-16">
          <EmptyState
            title="No matches found"
            subtitle="Contact us to help link you to the service you're looking for."
          />
          <div className="mt-5 flex justify-center gap-8">
            <button onClick={openDial} className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-600 transition-colors hover:bg-green-100" aria-label="Call">
                <FaPhoneAlt size={26} />
            </button>

            <button onClick={openOfficeWhatsapp} className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-600 transition-colors hover:bg-green-100" aria-label="WhatsApp">
                <FaWhatsappSquare size={30} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesSearch;
