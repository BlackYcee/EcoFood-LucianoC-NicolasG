import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
function AppRouter() {
 return (
 <BrowserRouter>
  <Routes>
   <Route path="/" element={<Home />} />
   <Route path="/login" element={<Login />} />
   <Route path="/Register" element={<Register/>} />
   </Routes>
   </BrowserRouter>
 );
}
export default AppRouter;