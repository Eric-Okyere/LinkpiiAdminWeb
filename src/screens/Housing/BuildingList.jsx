import React, { useState } from "react";
import PropTypes from "prop-types";
import { FcCancel } from "react-icons/fc";
import { IoMdCheckmark } from "react-icons/io";
import { MdDelete, MdModeEditOutline } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const BuildingList = (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();

  const {
    picture,
    picturesec,
    name,
    price,
    amenities,
    views,
    approved,
    index,
    _id,
  } = props;

  const handleNavigateToBuildingDetail = () => {
    navigate(`/building/${_id}`);
  };

  const handleNavigateToEditBuilding = () => {
    navigate("/edit-building", { state: { ...props } });
    setModalVisible(false);
  };

  return (
    <div>
      {/* Modal */}
      {modalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white rounded-lg shadow-lg p-6 relative">
            <button
              className="absolute top-2 right-2 text-black"
              onClick={() => setModalVisible(false)}
            >
              <AiOutlineClose size={20} />
            </button>
            <div className="flex flex-col items-center">
              <button
                className="p-2 rounded-md mb-4 hover:bg-gray-100"
                onClick={handleNavigateToEditBuilding}
              >
                <MdModeEditOutline size={30} />
              </button>
              <button
                className="p-2 rounded-md hover:bg-gray-100"
                onClick={() => {
                  props.delete(_id);
                  setModalVisible(false);
                }}
              >
                <MdDelete color="red" size={30} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Building Item */}
      <div
        className={`flex items-center justify-between p-4 ${
          index % 2 === 0 ? "bg-white" : "bg-[#f5a53d]"
        }`}
        onClick={handleNavigateToBuildingDetail}
        onContextMenu={(e) => {
          e.preventDefault();
          setModalVisible(true);
        }}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleNavigateToBuildingDetail();
        }}
      >
        <img
          src={picture}
          alt="Building"
          className="h-16 md:h-40 md:w-40 w-16 mr-2 object-cover rounded-lg"
        />
        {picturesec && (
          <img
            src={picturesec}
            alt="Building secondary"
            className="h-16 md:h-40 md:w-40 w-16 mr-2 object-cover rounded-lg"
          />
        )}
        <p className="truncate text-sm sm:text-base md:text-lg lg:text-xl font-bold text-center w-1/4 sm:w-1/5 md:w-1/6">
          {name}
        </p>
        <p className="w-1/6 truncate md:flex md:text-lg md:font-bold md:justify-center">
          {price}
        </p>
        <p className="w-1/6 flex justify-center md:mr-20">
          {approved ? (
            <IoMdCheckmark color="green" size={30} />
          ) : (
            <FcCancel size={30} />
          )}
        </p>
        <p className="w-1/6 md:text-lg md:font-bold text-center">{views}</p>
      </div>

      {/* Amenities Section */}
      {amenities && amenities.length > 0 && (
        <div className="p-4 mt-2 bg-gray-100 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Amenities:</h3>
          <div className="flex flex-wrap">
            {amenities.map((amenity, index) => (
              <span
                key={index}
                className="bg-blue-200 text-blue-800 rounded-full py-1 px-4 m-1 text-sm"
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

BuildingList.propTypes = {
  picture: PropTypes.string.isRequired,
  picturesec: PropTypes.string,
  name: PropTypes.string.isRequired,
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  views: PropTypes.number.isRequired,
  approved: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  _id: PropTypes.string.isRequired,
  delete: PropTypes.func.isRequired,
  amenities: PropTypes.array.isRequired,
};

export default BuildingList;
