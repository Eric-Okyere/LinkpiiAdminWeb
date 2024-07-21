import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import About from './screens/About';


function App() {

  return (

        <>
        
          <Routes>
            <Route path="/" element={<About />} />
          </Routes>
        </>
 
  );
}

export default App;
