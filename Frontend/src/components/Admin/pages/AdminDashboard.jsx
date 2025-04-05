import React from 'react'
import "../pages/Styles/AdminDashboard.css"
import "../../Home.css"
function AdminDashboard() {
  return (
    <div className="dashContainer">
      <div className='dashChild1'>
        <div className="home-container">
        <section className="hero">
          <div className="hero-content">
          <h1>Welcome, Admin!</h1>
<p>You're now in the control center of patient care.</p>
<p>Monitor vitals, manage patients, and ensure optimal health — all in one place.</p>
          </div>
        </section>
        </div>
         
      </div>
      <div className='dashChild2'></div>
      <div className='dashChild3'></div>
    </div>
  )
}

export default AdminDashboard