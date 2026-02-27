import { useState } from 'react'

import './App.css'
import MainLayout from './components/layout/MainLayout'
import Home from './pages/Home'
import LoginPage from './components/auth/Login'
import SignupPage from './components/auth/Signup'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import NotFoundPage from './components/layout/NotFoundPage'
import ProductsPage from './components/product/ProductPage'
import ProfilePage from './pages/Profile'
import ProductDetail from './components/product/ProductDetail'
import CartPage from './components/cart/CartPage'
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
        <Route path="/profile" element={<MainLayout><ProfilePage /></MainLayout>} />
        <Route path="*" element={<MainLayout><NotFoundPage /></MainLayout>} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
