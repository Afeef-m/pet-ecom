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
        <Route path="/cart" element={<ProtectedRoute role="user"><Cart /></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute role="user"><Wishlist /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute role="user"><Checkout /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute role="user"><Orders /></ProtectedRoute>} />
        <Route path="/payment" element={<ProtectedRoute role="user"><Payment /></ProtectedRoute>} />

        {/* Admin Protected Routes */}
        <Route path='/admin-dashboard' element={
          <ProtectedRoute role="admin"><AdminDashboard/></ProtectedRoute>} />
        <Route path='/admin-manage-product' element={
          <ProtectedRoute role="admin"><AdminProduct/></ProtectedRoute>} />
        <Route path='/admin-manage-user' element={
          <ProtectedRoute role="admin"><AdminManageUser/></ProtectedRoute>} />
       <Route path='/admin-orders' element={
        <ProtectedRoute><AdminOrders/></ProtectedRoute>
       }/>
      </Routes>
    </>
  );
}

export default App;
