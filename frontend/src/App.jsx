import { useState } from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import './App.css'
import Home from './components/pages/Home';
import GuestLayout from './components/layout/GuestLayout';

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GuestLayout />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
