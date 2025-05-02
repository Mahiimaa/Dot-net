import React from 'react'
import Navbar from './Layout/Navbar'

const Home = () => {
  return (
    <>
    <Navbar/>
    <div className="w-full h-screen flex items-center justify-center">
      <h1 className="text-2xl font-bold">Welcome to Foliana!</h1>
    </div>
    </>
  )
}

export default Home