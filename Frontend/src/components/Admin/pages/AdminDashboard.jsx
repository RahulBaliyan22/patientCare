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
            <h1>Welcome to Admin Portal</h1>
            <p>Register a new hospital or manage existing hospital information.</p>
            <div className="cta-buttons">
              <Link to="/admin/signup" className="btn-primary">
                Register New Hospital
              </Link>
              <Link to="/admin/login" className="btn-secondary">
                Login
              </Link>
            </div>
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