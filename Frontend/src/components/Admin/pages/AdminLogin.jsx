import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../../../main";
import { adminsocket } from "../../../util/socket";

const AdminLogin = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isVisible, setIsVisible] = useState(false);
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoggedIn || localStorage.getItem("user")) {
      setIsLoggedIn(true);
      navigate("/admin/dashboard");
      if (!adminsocket.connected) {
        adminsocket.connect();
      }
      toast.success("Admin Logged In");
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const messageFromUrl = params.get("message");
    if (messageFromUrl) {
      toast.success(messageFromUrl);
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = form;

    if (!email || !password) {
      toast.info("Both fields are required!");
      return;
    }

    try {
      const response = await axios.post(
        "https://patientcare-2.onrender.com/admin/login",
        form,
        { withCredentials: true }
      );

      localStorage.setItem("user", JSON.stringify(response.data.user));
      setIsLoggedIn(true);
      navigate("/admin/dashboard");

      if (!adminsocket.connected) {
        adminsocket.connect();
      }

      toast.success("Admin login successful!");
    } catch (error) {
      console.error("Admin login error:", error);
      toast.error(error.response?.data?.message || "Incorrect email or password");
    }
  };

  return (
    <div className="page-container">
      <div className="medication-form">
        <h2>Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter admin email"
              required
              className="form-input"
            />
          </div>

          <div className="form-group" style={{ position: "relative" }}>
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type={isVisible ? "text" : "password"}
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
              className="form-input"
            />
            <label htmlFor="isVisible" style={{ position: "absolute", top: "40%", right: "10px", cursor: "pointer" }}>
              {isVisible ? (
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="#004d4d">
                  <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="#004d4d">
                  <path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Z" />
                </svg>
              )}
            </label>
            <input
              type="checkbox"
              id="isVisible"
              checked={isVisible}
              onChange={(e) => setIsVisible(e.target.checked)}
              style={{ display: "none" }}
            />
          </div>

          <button type="submit" className="submit-button">Login</button>
        </form>

        <div className="extra-links">
          <p>Back to <Link to="/admin/home">Home</Link></p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
