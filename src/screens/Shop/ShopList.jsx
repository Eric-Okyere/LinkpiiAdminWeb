import React, { useState } from "react";
import { FcCancel } from "react-icons/fc";
import { IoMdCheckmark } from "react-icons/io";
import { MdDelete, MdModeEditOutline } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";

const ShopList = (props) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleNavigateToFashionSig = () => {
    const {
      picture,
      picturesec,
      name,
      video,
      price,
      category,
      views,
      _id,
      index,
      description,
      phone,
      whatsapp,
      town,
      location,
      region,
    } = props;
    props.navigation.navigate("fashionsig", {
      picture,
      picturesec,
      video,
      name,
      price,
      category,
      views,
      _id,
      index,
      description,
      phone,
      whatsapp,
      town,
      location,
      region,
    });
  };

  const handleNavigateToElectronics = () => {
    props.navigation.navigate("electronics", { item: props });
    setModalVisible(false);
  };

  return (
    <div>
      {/* Modal */}
      {modalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 relative">
            <button
              className="absolute top-2 right-2 text-black"
              onClick={() => setModalVisible(false)}
            >
              <AiOutlineClose size={20}/>
            </button>
            <div className="flex flex-col items-center">
              <button
                className="p-2 rounded-md mb-4"
                onClick={handleNavigateToElectronics}
              >
               <MdModeEditOutline  size={30}/>
              </button>
              <button
                className="p-2 rounded-md"
                onClick={() => {
                  props.delete(props._id);
                  setModalVisible(false);
                }}
              >
               <MdDelete color="red" size={30} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Item */}
      <div
        className={`flex items-center justify-between p-2 ${
          props.index % 2 === 0 ? "bg-white" : "bg-[#f5a53d]"
        }`}
        onClick={handleNavigateToFashionSig}
        onContextMenu={(e) => {
          e.preventDefault();
          setModalVisible(true);
        }}
      >
        <img
          src={props.picture}
          alt="Product"
          className="h-12 md:h-40 md:w-40 w-12 mr-2 object-cover"
        />
        <img
          src={props.picturesec}
          alt="Product secondary"
          className="h-12 md:h-40 md:w-40 w-12 mr-2 object-cover"
        />
     <p
    className="truncate text-sm sm:text-base md:text-lg lg:text-xl font-bold text-center w-1/4 sm:w-1/5 md:w-1/6"
  >
    {props.name}
  </p>
        <p className="w-1/6 truncate md:flex md:text-lg md:font-bold md:justify-center">{props.region}</p>
        <p className="w-1/6 flex justify-center md:mr-20">
          {props.approved ? (
            <IoMdCheckmark color="green"  size={30}/>
          ) : (
            <FcCancel color="red" size={30}/>
          )}
        </p>
        <p className="w-1/6 md:text-lg md:font-bold text-center">{props.views}</p>
      </div>
    </div>
  );
};

export default ShopList;
