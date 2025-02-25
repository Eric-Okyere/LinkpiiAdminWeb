import React from "react";
import { Routes, Route, useNavigate, Navigate, useLocation } from "react-router-dom";
import About from './screens/About';
import NavbarCompo from './components/NavbarCompo';
import Dashboard from './screens/Dashboard';
import Listproducts from './components/Listproducts';
import SingleProductform from './screens/Product/SingleProductform';
import Shopform from './screens/Shop/Shopform';
import ServiceesForm from './screens/Services/ServicesForm';
import AgricPost from './screens/Agric/AgricPost';
import BuildingPost from './screens/Housing/BuidingPost';
import Equipments from './screens/Equipments/Equipments';
import Signup from './screens/Users/Signup';
import Login from './screens/Users/Login';
import ErrorPage from './screens/ErrorPage';
import ProductManagement from './screens/Product/ProductManagement';
import ShopManagement from './screens/Shop/ShopManagement';
import ServicesMana from './screens/Services/ServicesMana';
import AgricMana from './screens/Agric/AgricManagement';
import HousingMana from './screens/Housing/HousingMana';
import BuildingDetail from './screens/Housing/BuildingDetail';
import AdminProductDetail from './screens/Product/AdminProductDetail';
import AdminShopDetail from './screens/Shop/AdminShopDetail';
import AdminAgricDetail from './screens/Agric/AdminAgricDetail';
import AdminServicesDetail from './screens/Services/AdminServicesDetail';
import Adds from './components/Adds';
import Advert from "./screens/Advert/Advert";
import TabView from "./screens/Cars/TabView";
import ButtonNavigation from "./components/ButtonNavigation";
import BuyTabView from "./screens/Product/BuyTabView";
import RentTabView from "./screens/Housing/RentTabView";
import CallDriver from "./screens/Cars/CallDriver";
import Verification from "./screens/Cars/Verification";
import HireDetail from "./screens/Cars/HireDetail";
import CallMechanics from "./screens/Cars/CallMechanics";
import SparepartDetail from "./screens/Spareparts/SparepartDetail";
import Detail from "./screens/Product/Detail";
import ShopDetail from "./screens/Shop/ShopDetail";
import ServicesDetail from "./screens/Services/ServicesDetail";
import AgricDetail from "./screens/Agric/AgricDetail";
import MainDetail from "./screens/Housing/MainDetail";
import EquipmentDetail from "./screens/Equipments/EquipmentDetail";
import CallDelivery from "./screens/Delivery/CallDelivery";
import Admin from "./screens/Users/Admin";
import ForgotPassword from "./screens/Users/ForgotPassword";
import { useSelector } from "react-redux";
import MyProfile from "./screens/Users/MyProfile";
import Report from "./screens/Users/Report";
import CallCenter from "./screens/Users/CallCenter";
import PrivacyPolicy from "./components/Policy";
import TermsOfUse from "./components/Terms";


const App = () => {
    const isLoggedIn = useSelector((state) => state.login);
    const location = useLocation();

    return (
      <>
     {(isLoggedIn || location.pathname === "/") && <NavbarCompo />} 
        <div className="pb-16"> {/* Reserve space for the fixed navigation */}
          <Routes>
            {!isLoggedIn ? (
              <>
                <Route path="/" element={<About />} />
                <Route path="/loginform" element={<Login />} />
                <Route path="*" element={<ErrorPage />} />  {/* Show error page for unknown routes */}
                <Route path="/signupform" element={<Signup />} />
                <Route path="/about" element={<About />} />
                <Route path="/forgotpassword" element={<ForgotPassword />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy /> } />
                <Route path="/terms" element={<TermsOfUse /> } />
              </>
            ) : (
              <>
                <Route path="/" element={<About />} />
                <Route path="/about" element={<About />} />
                <Route path="/advert" element={<Advert />} />
                <Route path="/tabs" element={<TabView />} />
                <Route path="/buy" element={<BuyTabView />} />
                <Route path="/rent" element={<RentTabView />} />
                <Route path="/user" element={<Admin />} />
                {/* <Route path="/dash" element={<Dashboard />} /> */}
                {/* <Route path="/signupform" element={<Signup />} />
                <Route path="/loginform" element={<Login />} /> */}
                <Route path="/listproduct" element={<Listproducts />} />
                <Route path="/sigform" element={<SingleProductform />} />
                <Route path="/shopform" element={<Shopform />} />
                <Route path="/servicesform" element={<ServiceesForm />} />
                <Route path="/agricpost" element={<AgricPost />} />
                <Route path="/housing" element={<BuildingPost />} />
                <Route path="/equipment" element={<Equipments />} />
                <Route path="/listproducts" element={<ProductManagement />} />
                <Route path="/shopmana" element={<ShopManagement />} />
                <Route path="/servmana" element={<ServicesMana />} />
                <Route path="/agricmana" element={<AgricMana />} />
                <Route path="/building" element={<HousingMana />} />
                <Route path="/building/:id" element={<BuildingDetail />} />
                <Route path="/products/:id" element={<AdminProductDetail />} />
                <Route path="/shoppage/:id" element={<AdminShopDetail />} />
                <Route path="/agricpage/:id" element={<AdminAgricDetail />} />
                <Route path="/adminservices/:id" element={<AdminServicesDetail />} />
                <Route path="/calldriver/:id" element={<CallDriver />} />
                <Route path="/adds" element={<Adds />} />
                <Route path="/verification" element={<Verification />} />
                <Route path="/hiredetail/:id" element={<HireDetail />} />
                <Route path="/callmechanics/:id" element={<CallMechanics />} />
                <Route path="/sparepart/:id" element={<SparepartDetail />} />
                <Route path="/detail/:id" element={<Detail />} />
                <Route path="/shopdetail/:id" element={<ShopDetail />} />
                <Route path="/servicesdetail/:id" element={<ServicesDetail />} />
                <Route path="/agricdetail/:id" element={<AgricDetail />} />
                <Route path="/buildingdetail/:id" element={<MainDetail />} />
                <Route path="/equipmentdetail/:id" element={<EquipmentDetail />} />
                <Route path="/calldelivery/:id" element={<CallDelivery />} />
                <Route path="/forgotpassword" element={<ForgotPassword />} />
                <Route path="/profile" element={<MyProfile />} />
                <Route path="/verification" element={<Verification />} />
                <Route path="/report" element={<Report />} />
                <Route path="/callcenter" element={<CallCenter />} />
                <Route path="*" element={<ErrorPage />} /> 
                <Route path="/privacy-policy" element={<PrivacyPolicy /> } />
                <Route path="/terms" element={<TermsOfUse /> } />
              </>
            )}
          </Routes>
        </div>
        <ButtonNavigation />
      </>
  );
};

export default App;
