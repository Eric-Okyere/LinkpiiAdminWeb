import React, { useEffect, useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { FaShoppingCart } from 'react-icons/fa';
import HousingScreen from './HousingScreen';
import EquipmentScreen from '../Equipments/EquipmentScreen';
import Delivery from '../Delivery/Delivery';
import { MdDeliveryDining } from "react-icons/md";
import { useLocation, useNavigate } from 'react-router-dom';
import { FaBuildingColumns } from "react-icons/fa6";
import { MdHomeRepairService } from "react-icons/md";

export default function RentTabView() {
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
    <div className="flex flex-col h-full pt-20">
      <Tabs selectedIndex={selectedIndex} onSelect={(index) => setSelectedIndex(index)}>
        <TabList className="flex justify-around bg-white p-4 shadow-md">
          <Tab
            className={`flex-1 text-center py-2 text-sm cursor-pointer ${
              selectedIndex === 0 ? 'bg-[#f5a53d] text-white rounded-lg' : ''
            }`}
          >
            <div className="flex justify-center">
            <FaBuildingColumns className="text-lg sm:text-2xl md:text-3xl"/>
             
            </div>
            <div className="text-xs sm:text-sm md:text-base">Housing</div>
          </Tab>
          <Tab
            className={`flex-1 text-center py-2 text-sm cursor-pointer ${
              selectedIndex === 1 ? 'bg-[#f5a53d] text-white rounded-lg' : ''
            }`}
          >
            <div className="flex justify-center">
            <MdHomeRepairService className="text-lg sm:text-2xl md:text-3xl" />
             
            </div>
            <div className="text-xs sm:text-sm md:text-base">Equipment</div>
          </Tab>
           <Tab
            className={`flex-1 text-center py-2 text-sm cursor-pointer ${
              selectedIndex === 2 ? 'bg-[#f5a53d] text-white rounded-lg' : ''
            }`}
          >
            <div className="flex justify-center">
              <MdDeliveryDining className="text-lg sm:text-5xl md:text-5xl"/>
            </div>
            <div className="text-xs sm:text-sm md:text-base">Delivery</div>
          </Tab>
         {/* <Tab
            className={`flex-1 text-center py-2 text-sm cursor-pointer ${
              selectedIndex === 3 ? 'bg-[#f5a53d] text-white rounded-lg' : ''
            }`}
          >
            <div className="flex justify-center">
              <GiFruitBowl className="text-lg sm:text-2xl md:text-3xl" />
            </div>
            <div className="text-xs sm:text-sm md:text-base">Agric</div>
          </Tab> */}
        </TabList>

        <TabPanel className="flex-grow p-4">
         <HousingScreen />
        </TabPanel>
        <TabPanel className="flex-grow p-4">
          <EquipmentScreen />
        </TabPanel>
        <TabPanel className="flex-grow p-4">
          <Delivery />
        </TabPanel>
      
      </Tabs>
    </div>
  );
}
