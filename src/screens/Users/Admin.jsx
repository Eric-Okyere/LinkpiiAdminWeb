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
import Container from "../../components/ui/Container";
import SectionHeading from "../../components/ui/SectionHeading";

const Admin = () => {
  const location = useLocation(); // Get navigation state
  const [activeComponent, setActiveComponent] = useState("agric");

  // Set activeComponent when navigating with state
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveComponent(location.state.activeTab);
    }
  }, [location.state]);

  const tabItemClass = (active) =>
    `flex flex-1 flex-col items-center justify-center gap-1 rounded-xl px-2 py-2.5 text-center transition-colors select-none ${
      active
        ? "bg-brand-600 text-white shadow-soft"
        : "text-ink-500 hover:bg-brand-50 hover:text-brand-700"
    }`;

  return (
    <div className="min-h-screen bg-ink-50 pb-10 pt-24 sm:pt-28">
      <Container>
        <SectionHeading eyebrow="Your listings" title="My Post" subtitle="Below are your dashboards" />

        <div className="flex items-center gap-1.5 overflow-x-auto rounded-2xl border border-ink-100 bg-white p-1.5 shadow-soft">
          {/* Services */}
          <button
            onClick={() => setActiveComponent("services")}
            className={tabItemClass(activeComponent === "services")}
          >
            <GiAutoRepair className="text-2xl" />
            <span className="text-xs font-semibold sm:text-sm">Services</span>
          </button>

          {/* General */}
          <button
            onClick={() => setActiveComponent("general")}
            className={tabItemClass(activeComponent === "general")}
          >
            <FaBasketShopping className="text-2xl" />
            <span className="text-xs font-semibold sm:text-sm">General</span>
          </button>

          {/* Agric */}
          <button
            onClick={() => setActiveComponent("agric")}
            className={tabItemClass(activeComponent === "agric")}
          >
            <GiFruitBowl className="text-2xl" />
            <span className="text-xs font-semibold sm:text-sm">Agric</span>
          </button>

          {/* Shop */}
          <button
            onClick={() => setActiveComponent("shop")}
            className={tabItemClass(activeComponent === "shop")}
          >
            <FaShoppingCart className="text-2xl" />
            <span className="text-xs font-semibold sm:text-sm">Shop</span>
          </button>

          {/* Building */}
          <button
            onClick={() => setActiveComponent("building")}
            className={tabItemClass(activeComponent === "building")}
          >
            <GiAutoRepair className="text-2xl" />
            <span className="text-xs font-semibold sm:text-sm">Building</span>
          </button>
        </div>

        <div className="mt-6">
          {/* Render Active Component */}
          {activeComponent === "services" && <ServicesMana />}
          {activeComponent === "agric" && <AgricMana />}
          {activeComponent === "shop" && <ShopManagement />}
          {activeComponent === "building" && <HousingMana />}
          {activeComponent === "general" && <ProductManagement />}
        </div>
      </Container>
    </div>
  );
};

export default Admin;
