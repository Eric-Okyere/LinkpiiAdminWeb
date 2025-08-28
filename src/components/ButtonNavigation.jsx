import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux"; // Import useSelector
import { IoIosAddCircle } from "react-icons/io";
import { FaHireAHelper, FaStar } from "react-icons/fa";
import { MdPhoneIphone } from "react-icons/md";
import { FiTruck } from "react-icons/fi";

const ButtonNavigation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeButton, setActiveButton] = useState("");
    const isLoggedIn = useSelector((state) => state.login); // Get login state

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get("tab");

        if (["0", "1", "2", "3"].includes(tab)) {
            if (location.pathname === "/buy") {
                setActiveButton("buy");
            } else if (location.pathname === "/tabs") {
                setActiveButton("tabs");
            } else if (location.pathname === "/rent") {
                setActiveButton("rent");
            }
        } else if (location.pathname === "/") {
            setActiveButton("advert");
        } else if (location.pathname === "/user") {
            setActiveButton("user");
        } else {
            setActiveButton("");
        }
    }, [location]);

    const handleButtonClick = (path, button) => {
        setActiveButton(button);
        navigate(path);
    };

    if (!isLoggedIn || location.pathname === "/report") return null;





    return (
        <div className="fixed bottom-0 left-0 w-full bg-[#f5a53d] border-t border-gray-300 flex md:justify-around lg:justify-around justify-center p-3">
            <button
                onClick={() => handleButtonClick("/", "advert")}
                className={`text-black rounded-md px-4 py-2 ${
                    activeButton === "advert" ? "bg-white" : "bg-[#f5a53d]"
                }`}
            >
                <FaStar className="mx-3 sm:text-xl md:text-4xl text-2xl lg:text-3xl" />
                <h1 className="text-xs sm:text-sm md:text-base">Adverts</h1>
            </button>
       
            <button
                onClick={() => handleButtonClick("/buy?tab=0", "buy")}
                className={`text-black rounded-md px-4 py-2 ${
                    activeButton === "buy" ? "bg-white" : "bg-[#f5a53d]"
                }`}
            >
                <MdPhoneIphone className="sm:text-xl text-2xl md:text-4xl lg:text-3xl" />
                <h1 className="text-xs sm:text-sm md:text-base">Buy</h1>
            </button>

                 <button
                onClick={() => handleButtonClick("/tabs?tab=0", "tabs")}
                className={`text-black rounded-md px-4 py-2 ${
                    activeButton === "tabs" ? "bg-white" : "bg-[#f5a53d]"
                }`}
            >
                <FiTruck className="sm:text-xl md:text-4xl text-2xl lg:text-3xl" />
                <h1 className="text-xs sm:text-sm md:text-base">KIA</h1>
            </button>

            
            <button
                onClick={() => handleButtonClick("/rent?tab=0", "rent")}
                className={`text-black rounded-md px-4 py-2 ${
                    activeButton === "rent" ? "bg-white" : "bg-[#f5a53d]"
                }`}
            >
                <FaHireAHelper className="sm:text-xl text-2xl md:text-4xl lg:text-3xl" />
                <h1 className="text-xs sm:text-sm md:text-base">Rent</h1>
            </button>
            <button
                onClick={() => handleButtonClick("/user", "user")}
                className={`text-black rounded-md px-4 py-2 ${
                    activeButton === "user" ? "bg-white" : "bg-[#f5a53d]"
                }`}
            >
                <IoIosAddCircle className="mx-3 text-3xl sm:text-4xl md:text-5xl lg:text-4xl" />
                <h1 className="text-xs sm:text-sm md:text-base">My Post</h1>
            </button>
        </div>
    );
};

export default ButtonNavigation;
