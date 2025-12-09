import React from 'react';
import { Link } from 'react-router-dom';
import { User, ShoppingBag, CheckSquare, XSquare, Settings, HelpCircle } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <Link to="/edit-profile" className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <span className="ml-3 text-sm font-medium">John Doe</span>
          </Link>
        </div>
        <nav>
          <ul className="space-y-2">
            <li>
              <Link to="/tailor-dashboard" className="flex items-center p-2 text-white hover:bg-blue-700 rounded-md">
                <ShoppingBag className="h-5 w-5 mr-3" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link to="/pending-orders" className="flex items-center p-2 text-white hover:bg-blue-700 rounded-md">
                <ShoppingBag className="h-5 w-5 mr-3" />
                <span>Pending Orders</span>
              </Link>
            </li>
            <li>
              <Link to="/completed-orders" className="flex items-center p-2 text-white hover:bg-blue-700 rounded-md">
                <CheckSquare className="h-5 w-5 mr-3" />
                <span>Completed Orders</span>
              </Link>
            </li>
            <li>
              <Link to="/cancelled-orders" className="flex items-center p-2 text-white hover:bg-blue-700 rounded-md">
                <XSquare className="h-5 w-5 mr-3" />
                <span>Cancelled Orders</span>
              </Link>
            </li>
            <li>
              <Link to="/services-customization" className="flex items-center p-2 text-white hover:bg-blue-700 rounded-md">
                <Settings className="h-5 w-5 mr-3" />
                <span>Services Customization</span>
              </Link>
            </li>
            <li>
              <Link to="/faqs" className="flex items-center p-2 text-white hover:bg-blue-700 rounded-md">
                <HelpCircle className="h-5 w-5 mr-3" />
                <span>FAQs</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
