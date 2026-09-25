import './App.css'
import { Routes,Route } from 'react-router-dom'

import Navbar from './components/navigationbar'
import Footer from './components/footer'

import Home from './pages/home'
import Groups from './pages/groups'
import Movies from './pages/movies'
import Profile from './pages/profile'
import Register from './pages/register'
import MyFavorites from './pages/favorites'

import { useState } from 'react'


import React from 'react';




function App() {
  return (
    <>
      <Navbar />

      <div id="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/register" element={<Register />} />
          <Route path="/favorites/:username" element={<MyFavorites />} />
        </Routes>
      </div>

      <Footer />
    </>
  )
}

export default App