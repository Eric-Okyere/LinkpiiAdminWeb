import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation
import AgricMana from "../Agric/AgricManagement";
import { GiAutoRepair, GiFruitBowl } from "react-icons/gi";
import { FaShoppingCart } from "react-icons/fa";
import { FaBasketShopping } from "react-icons/fa6";
import ServicesMana from "../Services/ServicesMana";
import ShopManagement from "../Shop/ShopManagement";
import HousingMana from "../Housing/HousingMana";
import ProductManagement from "../Product/ProductManagement";

const Admin = () => {
  const location = useLocation(); // Get navigation state
  const [activeComponent, setActiveComponent] = useState("agric");

  // Set activeComponent when navigating with state
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveComponent(location.state.activeTab);
    }
  }, [location.state]);

  const Stylediv = `flex flex-col items-center`;

  return (
    <div className="pt-28 bg-[#f5a53d] min-h-screen">
      <div className="flex flex-col">
        <h1 className="text-xl text-center mb-4">Below are your dashboards</h1>

        <div className="flex justify-between">
          {/* Services */}
          <button
            onClick={() => setActiveComponent("services")}
            className={`p-2 rounded-lg ${
              activeComponent === "services" ? "bg-white" : "bg-transparent"
            }`}
          >
            <div className={Stylediv}>
              <GiAutoRepair className="text-3xl" />
              <h1 className="text-xl hidden md:block lg:block">Services</h1>
            </div>
          </button>

          {/* General */}
          <button
            onClick={() => setActiveComponent("general")}
            className={`p-2 rounded-lg ${
              activeComponent === "general" ? "bg-white" : "bg-transparent"
            }`}
          >
            <div className={Stylediv}>
              <FaBasketShopping className="text-3xl" />
              <h1 className="text-xl hidden md:block lg:block">General</h1>
            </div>
          </button>

          {/* Agric */}
          <button
            onClick={() => setActiveComponent("agric")}
            className={`p-2 rounded-lg ${
              activeComponent === "agric" ? "bg-white" : "bg-transparent"
            }`}
          >
            <div className={Stylediv}>
              <GiFruitBowl className="text-3xl sm:text-3xl md:text-3xl" />
              <h1 className="text-xl hidden md:block lg:block">Agric</h1>
            </div>
          </button>

          {/* Shop */}
          <button
            onClick={() => setActiveComponent("shop")}
            className={`p-2 rounded-lg ${
              activeComponent === "shop" ? "bg-white" : "bg-transparent"
            }`}
          >
            <div className={Stylediv}>
              <FaShoppingCart className="text-3xl sm:text-3xl md:text-3xl" />
              <h1 className="text-xl hidden md:block lg:block">Shop</h1>
            </div>
          </button>

          {/* Building */}
          <button
            onClick={() => setActiveComponent("building")}
            className={`p-2 rounded-lg ${
              activeComponent === "building" ? "bg-white" : "bg-transparent"
            }`}
          >
            <div className={Stylediv}>
              <GiAutoRepair className="text-3xl sm:text-3xl md:text-3xl" />
              <h1 className="text-xl hidden md:block lg:block">Building</h1>
            </div>
          </button>
        </div>
      </div>

      {/* Render Active Component */}
      {activeComponent === "services" && <ServicesMana />}
      {activeComponent === "agric" && <AgricMana />}
      {activeComponent === "shop" && <ShopManagement />}
      {activeComponent === "building" && <HousingMana />}
      {activeComponent === "general" && <ProductManagement />}
    </div>
  );
};

export default Admin;
