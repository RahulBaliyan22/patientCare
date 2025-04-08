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
import ChatbotButton from "./components/ChatBot/ChatbotButton";
import Live from "./components/LiveMonitor/Live";
import AdminHome from "./components/Admin/pages/AdminHome";
import AdminSignup from "./components/Admin/pages/AdminSignup";
import AdminLogin from "./components/Admin/pages/AdminLogin";
import AdminDashboard from "./components/Admin/pages/AdminDashboard";
import AdminShowpatient from "./components/Admin/pages/AdminShowpatient";
import AdminSearchPatient from "./components/Admin/pages/AdminSearchPatient";
import Allpatient from "./components/Admin/pages/Allpatient";
import AdminShowRecords from "./components/Admin/pages/AdminShowRecords";
import AllMeds from "./components/Admin/pages/AllMeds";
import AdminShowMed from "./components/Admin/pages/AdminShowMed";
import AdminShowRecord from "./components/Admin/pages/AdminShowRecord";
import AdminEditRecord from "./components/Admin/pages/AdminEditRecord";
import AdminEditMed from "./components/Admin/pages/AdminEditMed";
import AdminSettings from "./components/Admin/pages/AdminSettings";
import { connectSocketByRole } from "./util/socket";

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
    connectSocketByRole(user?.role);
  }, []);
  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <BrowserRouter basename="/">
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
          <Route path="/vital-check" element={<Live/>}/>

          <Route path="/admin/home" element={<AdminHome/>}/> {/*all hospitals list data*/}
          <Route path="/admin/signup" element = {<AdminSignup/>}/>
          <Route path="/admin/login" element = {<AdminLogin/>}/>
          <Route path="/admin/dashboard" element = {<AdminDashboard/>}/>
          <Route path="/admin/showpatient" element = {<AdminShowpatient/>}/>
          <Route path="/admin/SearchPatient" element = {<AdminSearchPatient/>}/>
          <Route path="/admin/Allpatient" element = {<Allpatient/>}/>
          <Route path="/admin/showRecords/:patientId" element = {<AdminShowRecords/>}/>
          <Route path="/admin/showMedcations/:patientId" element = {<AllMeds/>}/>
          <Route path="/admin/showRecord/:id" element = {<AdminShowRecord/>}/>
          <Route path="/admin/showMedication/:patientId/:medId" element = {<AdminShowMed/>}/>
          <Route path="/admin/EditRecord/:patientId/:recordId" element = {<AdminEditRecord/>}/>
          <Route path="/admin/EditMadication/:patientId/:medId" element = {<AdminEditMed/>}/> 
          <Route path="/admin/settings" element={<AdminSettings/>}/>
          <Route path="*" element={<Error />} />
          
        </Routes>
        <ChatbotButton/>
        <Footer />
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

createRoot(document.getElementById("root")).render(<App />);
