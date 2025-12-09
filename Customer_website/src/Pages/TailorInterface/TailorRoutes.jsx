import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Registration from './Registration';
import Dashboard from './Dashboard';
import PendingOrders from './PendingOrders';
import CompletedOrders from './CompletedOrders';
import CancelledOrders from './CancelledOrders';
import ServicesCustomization from './ServicesCustomization';
import FAQs from './FAQs';
import EditProfile from './EditProfile';

function TailorRoutes() {
    console.log("TailorRoutes is rendered");
  return (
    <Routes>
      <Route path="/tailor-registration" element={<Registration />} />
      <Route path="/tailor-dashboard" element={<Dashboard />} />
      <Route path="/pending-orders" element={<PendingOrders />} />
      <Route path="/completed-orders" element={<CompletedOrders />} />
      <Route path="/cancelled-orders" element={<CancelledOrders />} />
      <Route path="/services-customization" element={<ServicesCustomization />} />
      <Route path="/faqs" element={<FAQs />} />
      <Route path="/edit-profile" element={<EditProfile />} />
    </Routes>
  );
}

export default TailorRoutes;
