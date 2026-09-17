import React from "react";
import { FcCancel } from "react-icons/fc";
import { IoMdCheckmark } from "react-icons/io";

const ListProducts = (props) => {
  return (
    <div
      onClick={props.onViewDetails} // Trigger view details
      className="group cursor-pointer overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover"
    >
      <div className="flex h-32 gap-0.5">
        <img
          src={props.picture}
          alt="Product"
          className="h-full w-1/2 object-cover"
        />
        <img
          src={props.picturesec}
          alt="Product secondary"
          className="h-full w-1/2 object-cover"
        />
      </div>
      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate text-sm font-semibold text-ink-900">{props.name}</h3>
          {props.approved ? (
            <IoMdCheckmark className="shrink-0 text-green-600" size={18} />
          ) : (
            <FcCancel className="shrink-0" size={18} />
          )}
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="truncate text-sm font-extrabold text-brand-600">
            {props.price ? `Gh¢${props.price}` : "Call for price"}
          </span>
          <span className="rounded-full bg-ink-100 px-2 py-0.5 text-[11px] font-semibold text-ink-600">
            {props.views} views
          </span>
        </div>
      </div>
    </div>
  );
};


export default ListProducts;
