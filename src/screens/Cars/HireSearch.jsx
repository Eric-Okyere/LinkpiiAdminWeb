import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaPhoneAlt, FaWhatsappSquare } from 'react-icons/fa'; 

const HireSearch = ({ productFiltered }) => {
  const navigate = useNavigate();

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
        <div className="max-h-[500px] overflow-y-auto mb-20">
          {productFiltered.map((item) => (
          
                <Link
                  to={`/hiredetail/${item._id}`}
                   className="block w-full p-2"
                   key={item._id}
                >
              <div className="mx-5 bg-gray-200 shadow-lg rounded-lg flex p-1 md:space-x-4 lg:space-x-4">
                <img
                  src={item.picture}
                  alt="Car"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <img
                  src={item.picturesec}
                  alt="Driver"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <div className="flex-1">
                  <p className="truncate md:w-36 lg:w-36 w-32 font-semibold">{item.name}</p>
                  <p className="truncate md:w-36 lg:w-36 w-32 text-sm text-gray-600">{item.description}</p>
                  <p className="truncate md:w-36 lg:w-36 w-32 text-sm text-gray-600">{item.region}</p>
                  <p className="truncate md:w-36 lg:w-36 w-32 text-sm text-gray-600">{item.town}</p>
                 
                </div>
              </div>
           
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center mt-6 flex-col">
          <p className="text-gray-600 text-center">
            Wrong input. Contact us to link you to our drivers.
          </p>

           <div className="flex space-x-32 mt-5">
              <button onClick={openDial} className="text-green-500">
                  <FaPhoneAlt size={36} />
              </button>

              <button onClick={openOfficeWhatsapp} className="text-green-500">
                  <FaWhatsappSquare size={40} />
              </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HireSearch;
