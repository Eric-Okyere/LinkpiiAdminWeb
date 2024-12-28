import { Route, Routes } from 'react-router-dom';
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


function App() {
  return (
    <>
      <NavbarCompo />
      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/dash" element={<Dashboard />} />
        <Route path="/listproduct" element={<Listproducts />} />
        <Route path="/sigform" element={<SingleProductform /> } />
        <Route path="/shopform" element={<Shopform /> } />
        <Route path="/servicesform" element={<ServiceesForm /> } />
        <Route path="/agricpost" element={<AgricPost /> } />
        <Route path="/housing" element={<BuildingPost /> } />
        <Route path="/equipment" element={<Equipments /> } />
        <Route path="*" element={<ErrorPage />} />
        <Route path="/signupform" element={<Signup />}/>
        <Route path="/listproducts" element={<ProductManagement /> }/>
        <Route path="/loginform" element={<Login />}/>
        <Route path="/shopmana" element={<ShopManagement />}/>
        <Route path="/servmana" element={<ServicesMana />}/>
        <Route path="/agricmana" element={<AgricMana />}/>
        <Route path="/building" element={<HousingMana />}/>
        <Route path="/building/:id" element={<BuildingDetail />}/>
        <Route path="/products/:id" element={<AdminProductDetail />} />
        <Route path="/shoppage/:id" element={<AdminShopDetail />} />
        <Route path="/agricpage/:id" element={<AdminAgricDetail />} />
        <Route path="/adminservices/:id" element={<AdminServicesDetail />} />
        <Route path="/adds" element={<Adds />} />
      </Routes>
    </>
  );
}

export default App;
