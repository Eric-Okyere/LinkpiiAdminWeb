import React, { useState } from "react";
import { FcCancel } from "react-icons/fc";
import { IoMdCheckmark } from "react-icons/io";


const ListProducts = (props) => {
  return (
    <div
      className={`flex items-center justify-between p-2 ${
        props.index % 2 === 0 ? "bg-white" : "bg-[#f5a53d]"
      }`}
      onClick={props.onViewDetails} // Trigger view details
    >
      <img
        src={props.picture}
        alt="Product"
        className="h-12 md:h-40 md:w-40 w-12 mr-2 object-cover"
      />
      <img
        src={props.picturesec}
        alt="Poor Network"
        className="h-12 md:h-40 md:w-40 w-12 mr-2 object-cover"
      />
      <p className="md:ml-16 truncate w-1/6 text-sm md:text-lg md:font-bold font-bold md:w-44">{props.name}</p>
      <p className="w-1/6 truncate md:text-lg md:font-bold text-center">{props.price}</p>
      <p className="w-1/6 flex md:text-lg md:font-bold justify-center md:ml-16">
        {props.approved ? (
          <IoMdCheckmark color="green"  size={30} />
        ) : (
          <FcCancel size={30} />
        )}
      </p>
      <p className="w-1/6 text-center">{props.views}</p>
    </div>
  );
};


export default ListProducts;
