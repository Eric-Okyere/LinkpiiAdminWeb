import React, { useState } from "react";
import { FcCancel } from "react-icons/fc";
import { IoMdCheckmark } from "react-icons/io";
import { MdDelete, MdModeEditOutline } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";

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
        className="h-12 w-12 mr-2 object-cover"
      />
      <img
        src={props.picturesec}
        alt="Product secondary"
        className="h-12 w-12 mr-2 object-cover"
      />
      <p className="truncate text-sm font-bold w-1/4">{props.name}</p>
      <p className="w-1/6 truncate text-center">{props.price}</p>
      <p className="w-1/6 flex justify-center">
        {props.approved ? (
          <IoMdCheckmark color="green" size={30} />
        ) : (
          <FcCancel size={30} />
        )}
      </p>
      <p className="w-1/6 text-center">{props.views}</p>
    </div>
  );
};


export default ListProducts;
