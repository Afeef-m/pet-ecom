import React from 'react';
import Navbar from './components/navbar';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import AdminDashboard from './pages/admin-dashboard';
import AdminProduct from './pages/admin-manage-product';
import AdminManageUser from './pages/admin-manage-user';
import AdminOrders from './pages/admin-orders';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/home';
import ProductDetails from './pages/productDetails';
import Register from './pages/register';
import Login from './pages/login';
import Cart from './pages/cart';
import Wishlist from './pages/wishlist';
import Checkout from './pages/checkout';
import Orders from './pages/orders';
import Payment from './pages/payment';

function App() {
  return (
    <>
      <Navbar />
      <ToastContainer position="top-center" autoClose={1000} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/accessory/:id" element={<ProductDetails />} />

        {/* User Protected Routes */}
      <Route element={<ProtectedRoute role="user"/>}>
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/payment" element={<Payment />} />
      </Route>
      
        {/* Admin Protected Routes */}
       <Route element={<ProtectedRoute role="admin"/>}>
         <Route path='/admin-dashboard' element={<AdminDashboard/>} />
        <Route path='/admin-manage-product' element={<AdminProduct/>} />
        <Route path='/admin-manage-user' element={<AdminManageUser/>} />
       <Route path='/admin-orders' element={<AdminOrders/>}/>
       </Route>
      </Routes>
    </>
  );
}

export default App;
