import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import AllCars from './components/AllCars';
import AllUsers from './components/AllUsers';
import AllProducts from './components/AllProducts';
import ApprovedProducts from './screens/ApprovedProducts';
import ApprovedCars from './screens/ApprovedCars';
import Advert from './screens/Advert';
import PostAdvert from './screens/PostAdvert';
import Airtel from './components/codes/Airtel';
import AirtelCode from './screens/AirtelCode';
import MTN from './components/codes/MTN';
import MTNPost from './screens/MTNPost';
import Vodafone from './components/codes/Vodafone';
import VodafonePost from './screens/VodafonePost';
import Emergency from './components/codes/Emergency';
import EmergencyPost from './screens/EmergencyPost';
import Fashion from './components/Fashion';
import ApprovedFashion from './screens/AprrovedFashion';
import AllMechanics from './components/AllMechanics';
import Call from './screens/Call';
import Services from './screens/Services';
import ApprovedServices from './screens/ApprovedServices';
import Okada from './components/codes/Okada';
import SpareParts from './screens/SpareParts';
import Shops from './screens/Shops';
import Whatsapp from './screens/Whatsapp';
import Buildings from './screens/Buildings';
import RentCars from './screens/RentCars';
import Equipment from './components/codes/Equipment';
import Reports from './components/Reports';
import About from './screens/About';

function App() {
  const location = useLocation();

  return (
    <>
      {location.pathname !== '/' && <Navbar />}
      <Routes>
        <Route path="/agric1" element={<AllProducts />} />
       
      </Routes>
    </>
  );
}

export default App;
