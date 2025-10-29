import React from 'react';
import Navbar from './components/navbar/navbar';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import AdminDashboard from './pages/admin/admin-dashboard';
import AdminProduct from './pages/admin/admin-manage-product';
import AdminManageUser from './pages/admin/admin-manage-user';
import AdminOrders from './pages/admin/admin-orders';

import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/publicRoute';

import Register from "./auth/register"
import Login from "./auth/login"

import Home from './pages/users/home';
import ProductDetails from './pages/users/productDetails';
import Cart from "./pages/users/cart"
import Wishlist from './pages/users/wishlist';
import Checkout from './pages/users/checkout';
import Orders from './pages/users/orders';
import Payment from './pages/users/payment';
import Profile from './pages/users/profile';

function App() {
  return (
    <>
      <Navbar />
      <ToastContainer position="top-center" autoClose={1000} />
      <Routes>
        
        <Route path="/" element={<Home />} />

        <Route element={<PublicRoute/>}>
           <Route path="/register" element={<Register />} />
           <Route path="/login" element={<Login />} />
        </Route>

        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/accessory/:id" element={<ProductDetails />} />

       
      <Route element={<ProtectedRoute role="user"/>}>
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/payment" element={<Payment />} />
        <Route path='/profile' element={<Profile/>}/>
      </Route>
      
       
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
