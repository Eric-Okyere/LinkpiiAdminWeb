import React from "react";
import { Link } from "react-router-dom";
import { FaPhoneAlt, FaWhatsappSquare } from "react-icons/fa";
import EmptyState from "@/components/ui/EmptyState";

const SearchMechanic = ({ productFiltered }) => {
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
        <div className="mb-20 max-h-[500px] space-y-2 overflow-y-auto">
          {productFiltered.map((item) => (
            <Link
              to={`/callmechanics/${item._id}`}
              className="flex items-center gap-3 rounded-2xl border border-ink-100 bg-white p-3 shadow-soft transition-shadow hover:shadow-card-hover"
              key={item._id}
            >
              <img
                src={item.picture}
                alt="Mechanic"
                className="h-16 w-16 shrink-0 rounded-xl object-cover"
              />
              <img
                src={item.picturesec}
                alt="Workshop"
                className="h-16 w-16 shrink-0 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-ink-900">{item.name}</p>
                <p className="truncate text-xs text-ink-500">
                  {[item.region, item.town, item.location].filter(Boolean).join(", ")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-6">
          <EmptyState
            title="No mechanics found"
            subtitle="Wrong input. Contact us to link you to our drivers."
          />

          <div className="mt-5 flex justify-center gap-6">
            <button
              onClick={openDial}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-600 transition-colors hover:bg-green-100"
              aria-label="Call us"
            >
              <FaPhoneAlt size={20} />
            </button>

            <button
              onClick={openOfficeWhatsapp}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-600 transition-colors hover:bg-green-100"
              aria-label="Message us on WhatsApp"
            >
              <FaWhatsappSquare size={22} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchMechanic;
