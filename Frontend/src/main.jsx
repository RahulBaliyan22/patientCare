import React, { useState, useEffect, createContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createRoot } from "react-dom/client";
import Login from "./components/Auth/Login";
import SignUp from "./components/Auth/Signup";
import Home from "./components/Home";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Contact from "./components/Contact";
import Services from "./components/Services";
import AboutUs from "./components/AboutUs";
import PrivacyPolicies from "./components/PrivacyPolicies";
import TermsAndConditions from "./components/TermsAndConditions";
import Dashboard from "./components/Entry/Dashboard";
import ViewRecords from "./components/Entry/ViewRecords";
import Medications from "./components/Entry/Medications";
import Settings from "./components/Entry/Settings";
import AddRecord from "./components/Entry/AddRecord";
import Error from "./Error";
import ForgotPassword from "./ForgotPassword";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ViewRecord from "./components/Entry/ViewRecord";
import 'react-photo-view/dist/react-photo-view.css';
import EditRecord from "./components/Entry/EditRecord";
import Create from "./components/Medication/Create";
import Update from "./components/Medication/Update";
import ContactForm from "./components/Contact/ContactForm";
import UpdateContactForm from "./components/Contact/UpdateContactForm";
import ProfilePage from "./components/Entry/ProfilePage";
import ContactsPage from "./components/Contact/ContactsPage";
import ResetPassword from "./components/ResetPassword";

// Create a context for user authentication
export const AuthContext = createContext();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  console.log(isLoggedIn)
  useEffect(() => {
    // Check if there's a user in localStorage
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true); // Set logged-in status based on localStorage
    }
  }, []);
  
  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <BrowserRouter basename="/myapp">
        <Navbar />
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/privacy-policy" element={<PrivacyPolicies />} />
          <Route path="/terms-of-service" element={<TermsAndConditions />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/records" element={<ViewRecords />} />
          <Route path="/medications" element={<Medications />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/add-record" element={<AddRecord />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/view-record/:id" element={<ViewRecord/>}/>
          <Route path="/edit-record/:id" element={<EditRecord/>}/>
          <Route path="/medications/add" element={<Create/>}/>
          <Route path="/medications/update/:id" element={<Update/>}/>
          <Route path="/contact/add" element={<ContactForm/>}/>
          <Route path="/contact/update/:id" element={<UpdateContactForm/>}/>
          <Route path="/profile" element={<ProfilePage/>}/>
          <Route path="/contact/show" element={<ContactsPage/>}/>
          <Route path="/reset-password/:token" element={<ResetPassword/>} />
          <Route path="*" element={<Error />} />
          
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

createRoot(document.getElementById("root")).render(<App />);
