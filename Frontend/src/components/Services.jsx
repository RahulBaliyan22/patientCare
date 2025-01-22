import React from "react";
import "./Services.css"; // Import styling for ServicesPage
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import styles for react-toastify
const Services = () => {
  return (
    <div className="services-container">
      <h1>Our Services</h1>
      <p>At PatientCare, we provide a range of services aimed at improving patient care through efficient management of medical records, medications, and health histories. Our platform ensures secure, reliable, and seamless experiences for both healthcare providers and patients.</p>

      {/* Service 1: Patient Record Management */}
      <div className="service">
        <h2>Patient Record Management</h2>
        <p>Our system allows healthcare providers to securely store, access, and update patient records, ensuring that they have the most accurate and up-to-date medical information available at all times.</p>
      </div>

      {/* Service 2: Medication Tracking */}
      <div className="service">
        <h2>Medication Tracking</h2>
        <p>Our medication tracking system ensures patients adhere to prescribed treatments. Healthcare providers can track dosages, schedules, and medication history, reducing errors and improving treatment outcomes.</p>
      </div>

      {/* Service 3: Medical History Archive */}
      <div className="service">
        <h2>Medical History Archive</h2>
        <p>Access a comprehensive archive of each patient's medical history, including past treatments, surgeries, lab results, and consultations. This helps healthcare providers make informed decisions based on a patient's complete health profile.</p>
      </div>

      {/* Service 4: Secure Data Storage */}
      <div className="service">
        <h2>Secure Data Storage</h2>
        <p>We prioritize the security of your medical data. All patient records, medication history, and other sensitive data are stored with state-of-the-art encryption, ensuring privacy and confidentiality at all times.</p>
      </div>

      {/* Service 5: Health Analytics and Reports */}
      <div className="service">
        <h2>Health Analytics and Reports</h2>
        <p>Our platform provides advanced analytics tools that help healthcare providers generate patient reports, track health progress over time, and gain insights into trends to improve patient outcomes.</p>
      </div>
    </div>
  );
};

export default Services;
