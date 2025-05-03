import { useState } from 'react'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Register from "./pages/Register";
import './App.css'

import Home from './pages/Home';

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/register" element ={<Register/>}/>
      <Route path="/" element ={<Home/>}/>

      </Routes>
    </Router>
  )
}

export default App
