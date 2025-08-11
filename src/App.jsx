import React from 'react'
import Home from './pages/Home';
import { Route, Routes } from "react-router-dom";
import Login from './pages/Login';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Home" element={<Home />} />
      </Routes>

    </div>
  )
}

export default App