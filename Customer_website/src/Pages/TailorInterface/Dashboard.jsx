import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { User, Calendar, DollarSign, ShoppingBag } from 'lucide-react';
import Sidebar from './Sidebar';

const data = [
  { name: 'Jan', income: 4000 },
  { name: 'Feb', income: 3000 },
  { name: 'Mar', income: 5000 },
  { name: 'Apr', income: 4500 },
  { name: 'May', income: 6000 },
  { name: 'Jun', income: 5500 },
];

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        <header className="bg-white shadow-sm z-10">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div className="dashboard-card">
                <div className="flex items-center">
                  <Calendar className="h-10 w-10 text-blue-500" />
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500 truncate">Pending Orders</p>
                    <p className="mt-1 text-3xl font-semibold text-gray-900">12</p>
                  </div>
                </div>
              </div>
              <div className="dashboard-card">
                <div className="flex items-center">
                  <ShoppingBag className="h-10 w-10 text-green-500" />
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500 truncate">Completed Orders</p>
                    <p className="mt-1 text-3xl font-semibold text-gray-900">48</p>
                  </div>
                </div>
              </div>
              <div className="dashboard-card">
                <div className="flex items-center">
                  <DollarSign className="h-10 w-10 text-yellow-500" />
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500 truncate">Total Income</p>
                    <p className="mt-1 text-3xl font-semibold text-gray-900">$4,200</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <div className="dashboard-card">
                <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">Income Overview</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="income" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <div className="dashboard-card">
                <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Orders</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#1234</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">John Doe</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Suit Tailoring</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Completed</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#1235</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Jane Smith</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Dress Alterations</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
