import { useState } from 'react'
import './App.css'
import MainLayout from './components/layout/MainLayout'
import AdminLayout from './components/layout/AdminLayout' 
import UserDashboard from './pages/admin/UserDashboard'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProductPage from './pages/admin/AdminProductPage'
import AdminOrderPage from './pages/admin/AdminOrderPage'
import AdminArticlePage from './pages/admin/AdminArticlePage'
import Home from './pages/Home'
import LoginPage from './pages/auth/LoginPage'
import SignupPage from './pages/auth/SignupPage'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import NotFoundPage from './pages/NotFoundPage'
import ProductsPage from './pages/ProductsPage'
import ProfilePage from './pages/Profile'
import ProductDetail from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderSuccessPage from './pages/OrderSuccessPage'
import OrderPage from './pages/OrderPage'
import OrderDetail from './pages/OrderDetailPage'
import ForgotPassword from './pages/auth/ForgotPasswordPage'
import ArticleList from './components/common/ArticleList'
import ArticleDetail from './pages/ArticleDetail'
import useAuthStore from './store/auth.store' 

function App() {
  const { user } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        {/* --- PUBLIC & CUSTOMER ROUTES (Sử dụng MainLayout) --- */}
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

        {/* --- ADMIN ROUTES (Sử dụng AdminLayout) --- */}
        {/* Chỉ cho phép vào nếu là ADMIN, nếu không thì đá về trang chủ */}
        <Route 
          path="/admin" 
          element={
            user?.role === 'ADMIN' ? <AdminLayout /> : <Navigate to="/" replace />
          } 
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserDashboard />} />
          <Route path="products" element={<AdminProductPage />} />
          <Route path="orders" element={<AdminOrderPage />} />
          <Route path="articles" element={<AdminArticlePage />} />
          <Route index element={<Navigate to="dashboard" replace />} /> 
        </Route>

        <Route path="*" element={<MainLayout><NotFoundPage /></MainLayout>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App