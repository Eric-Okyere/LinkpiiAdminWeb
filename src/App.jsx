import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import About from './screens/About';
import Adds from './components/Adds';


function App() {

  return (

        <>
        
          <Routes>
            <Route path="/" element={<About />} />
            <Route path="/add" element={<Adds />} />
          </Routes>
        </>
 
  );
}

export default App;
