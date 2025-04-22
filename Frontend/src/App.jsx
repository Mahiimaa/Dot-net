import { useState } from 'react'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Register from "./pages/Register";
import './App.css'
import Home from './pages/Home';
import ProtectedRoute from "./Components/ProtectedRoute";
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  )
}

export default App
