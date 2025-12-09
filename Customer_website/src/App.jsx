// App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from "./Pages/Home/Home";
import AuthPage from "./Account/AuthPage";
import AuthLoginTailor from './Pages/Home/AuthLoginTailor';
import Registration from './Account/registration/Registration';
import Dashboard from './Pages/TailorInterface/Dashboard';
import PendingOrders from './Pages/TailorInterface/PendingOrders';
import CompletedOrders from './Pages/TailorInterface/CompletedOrders';
import CancelledOrders from './Pages/TailorInterface/CancelledOrders';
import ServicesCustomization from './Pages/TailorInterface/ServicesCustomization';
import FAQs from './Pages/TailorInterface/FAQs';
import EditProfile from './Pages/TailorInterface/EditProfile';
import ProductList from './Pages/Products/Product';
import ProductDetail from './Pages/Products/ProductDetail';
import Cart from './Pages/Cart/Cart';
import ContactUs from './Pages/ContactUs';
import ProfilePage from './Pages/Profile/ProfilePage'; // Import the Profile page
import Nav from './Components/Nav';
import ProtectedRoute from './Components/ProtectedRoute';
import SavedAddress from './Pages/Profile/SaveAddress';
import Orders from "./Pages/Orders/Orders"
import OrderDetail from './Pages/Orders/OrderDetail';

function App() {
  return (
    <>
      
      <Routes>
        <Route path="/account" element={<AuthPage />} /> 


        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:productId" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/profilepage" element={<ProfilePage />} />
          <Route path="/profilepage/address" element={<SavedAddress />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:orderId" element={<OrderDetail />} />
         </Route>
        
      </Routes>
    </>
  );
}

export default App;