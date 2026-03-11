import { useState } from 'react'
import './App.css'
import MainLayout from './components/layout/MainLayout'
import Home from './pages/Home'
import LoginPage from './components/auth/Login'
import SignupPage from './components/auth/Signup'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import NotFoundPage from './components/layout/NotFoundPage'
import ProductsPage from './components/product/productPage/ProductPage'
import ProfilePage from './pages/Profile'
import ProductDetail from './components/product/ProductDetail'
import CartPage from './components/cart/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderSuccessPage from './components/order/OrderSuccessPage'
import OrderPage from './pages/OrderPage'
import OrderDetail from './components/order/OrderDetail'
import ForgotPassword from './components/auth/ForgotPassword'
import ArticleList from './components/layout/ArticleList'
import ArticleDetail from './pages/ArticleDetail'
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/login" element={<MainLayout>< LoginPage /></MainLayout>} />
        <Route path="/signup" element={<MainLayout><SignupPage /></MainLayout>} />
        <Route path="/products" element={<MainLayout><ProductsPage /></MainLayout>} />
        <Route path="/products/:id" element={<MainLayout><ProductDetail /></MainLayout>} />
        <Route path="/cart" element={<MainLayout><CartPage /></MainLayout>} />
        <Route path="/checkout" element={<MainLayout><CheckoutPage /></MainLayout>} />
        <Route path="/order-success/:orderId" element={<MainLayout><OrderSuccessPage /></MainLayout>} />
        <Route path="/my-orders" element={<MainLayout><OrderPage /></MainLayout>} />
        <Route path="/articles" element={<MainLayout><ArticleList /></MainLayout>} />
         <Route path="/articles/:slug" element={<MainLayout><ArticleDetail /></MainLayout>} />
        <Route path="/order/:id" element={<MainLayout><OrderDetail /></MainLayout>} />
        <Route path="/forgot-password" element={<MainLayout><ForgotPassword /></MainLayout>} />
        <Route path="/profile" element={<MainLayout><ProfilePage /></MainLayout>} />
        <Route path="*" element={<MainLayout><NotFoundPage /></MainLayout>} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
