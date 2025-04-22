import React from 'react'
import AdminNav from "../Components/AdminNavbar"
import AdminTop from "../Components/AdminTop"

function AdminReview() {
  return (
    <div className="h-screen flex ">
        <AdminNav />
        <div className='flex-1 flex flex-col'>
        <AdminTop />
        </div>
        </div>
  )
}

export default AdminReview