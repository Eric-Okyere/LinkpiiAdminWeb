import { Route, Routes } from 'react-router-dom';
import About from './screens/About';
import Adds from './components/Adds';
import ForgotPassowrd from './components/ForgotPassowrd';


function App() {

  return (

        <>
        
          <Routes>
            <Route path="/" element={<About />} />
            <Route path="/add" element={<Adds />} />
            <Route path="/forgot-password/:id" element={<ForgotPassowrd />} />
          </Routes>
        </>
 
  );
}

export default App;
