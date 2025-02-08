import React, { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css"; // Ensure this is properly loaded
import { FaTools } from "react-icons/fa";
import { BsTruck } from "react-icons/bs";
import { BiSolidCar } from "react-icons/bi";
import { FaBasketShopping } from "react-icons/fa6";

import CarRent from "./CarRent";
import Cars from "./Cars";
import Mechanics from "./Mechanics";
import CarAnimation from "./CarAnimation";
import Hire from "./Hire";
import Spareparts from "../Spareparts/Spareparts";
import { useLocation, useNavigate } from "react-router-dom";

export default function TabView() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get the tab index from the URL (state passed through routing)
  const initialIndex = new URLSearchParams(location.search).get("tab") || 0;

  const [selectedIndex, setSelectedIndex] = useState(Number(initialIndex));

  // Update URL when selected tab changes
  useEffect(() => {
    // Update the URL query parameter when the tab changes
    navigate(`?tab=${selectedIndex}`, { replace: true });
  }, [selectedIndex, navigate]);

  return (
    <div className="flex flex-col h-full pt-4 md:pt-20">
      <Tabs
        selectedIndex={selectedIndex}
        onSelect={(index) => setSelectedIndex(index)}
      >
        <TabList className="flex justify-around bg-white p-4 shadow-md fixed top-20 md:top-24 left-0 right-0 z-10">
          <Tab
            className={`flex-1 text-center py-2 text-sm cursor-pointer ${
              selectedIndex === 0 ? "bg-[#f5a53d] text-white rounded-lg" : ""
            }`}
          >
            <div className="flex justify-center">
              <CarAnimation />
            </div>
            <div className="text-xs sm:text-sm md:text-base">Order KIA</div>
          </Tab>
          <Tab
            className={`flex-1 text-center py-2 text-sm cursor-pointer ${
              selectedIndex === 1 ? "bg-[#f5a53d] text-white rounded-lg" : ""
            }`}
          >
            <div className="flex justify-center">
              <BiSolidCar className="text-4xl sm:text-2xl md:text-3xl " />
            </div>
            <div className="text-xs sm:text-sm md:text-base pt-1">Truck</div>
          </Tab>
          <Tab
            className={`flex-1 text-center py-2 text-sm cursor-pointer ${
              selectedIndex === 2 ? "bg-[#f5a53d] text-white rounded-lg" : ""
            }`}
          >
            <div className="flex justify-center">
              <FaTools className="text-4xl sm:text-2xl md:text-3xl" />
            </div>
            <div className="text-xs sm:text-sm md:text-base pt-1">Mechanics</div>
          </Tab>
          <Tab
            className={`flex-1 text-center py-2 text-sm cursor-pointer ${
              selectedIndex === 3 ? "bg-[#f5a53d] text-white rounded-lg" : ""
            }`}
          >
            <div className="flex justify-center">
              <FaBasketShopping className="text-4xl sm:text-2xl md:text-3xl" />
            </div>
            <h1 className="text-xs sm:text-sm md:text-base pt-1">Spare Parts</h1>
          </Tab>
        </TabList>

        <div className="pt-28">
          <TabPanel className="flex-grow p-4">
            <Cars />
          </TabPanel>
          <TabPanel className="flex-grow p-4">
            <Hire />
          </TabPanel>
          <TabPanel className="flex-grow p-4">
            <Mechanics />
          </TabPanel>
          <TabPanel className="flex-grow p-4">
            <Spareparts />
          </TabPanel>
        </div>
      </Tabs>
    </div>
  

  
  );
}
