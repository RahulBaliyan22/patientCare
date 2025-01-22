import React from "react";
import "./AboutUs.css"; // Import the styling for AboutUs
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import styles for react-toastify

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <h1>About PatientCare</h1>
      <p>
        Welcome to PatientCare, your trusted partner in managing and organizing medical records. Our platform is designed to empower patients and healthcare providers with secure, accessible, and accurate health data management.
      </p>

      <div className="mission">
        <h2>Our Mission</h2>
        <p>
          At PatientCare, our mission is to streamline and safeguard the process of managing patient history, medical records, and treatments. We aim to enhance the healthcare experience by providing patients with greater control over their medical data while ensuring that healthcare providers can access crucial information with ease and efficiency.
        </p>
      </div>

      <div className="vision">
        <h2>Our Vision</h2>
        <p>
          Our vision is to create a global platform that connects patients, doctors, and healthcare institutions to provide seamless, integrated, and secure medical record management. By doing so, we aim to elevate the quality of patient care and support better health outcomes.
        </p>
      </div>

      <div className="values">
        <h2>Our Core Values</h2>
        <ul>
          <li><strong>Security:</strong> We prioritize the confidentiality and security of patient data with cutting-edge encryption technology.</li>
          <li><strong>Empathy:</strong> We understand the importance of healthcare and ensure that our services are built around patient-centric care.</li>
          <li><strong>Accessibility:</strong> We aim to make medical records easily accessible for both patients and healthcare providers anytime, anywhere.</li>
          <li><strong>Integrity:</strong> We operate with transparency and ethical standards, always ensuring that we respect patients' privacy and confidentiality.</li>
        </ul>
      </div>

      <div className="team">
        <h2>Meet the Team</h2>
        <p>Our team consists of professionals dedicated to improving patient care through technology, combining expertise in healthcare, data security, and innovation.</p>
        <ul>
          <li><strong>Dr. John Doe:</strong> CEO & Founder - Experienced healthcare visionary with a passion for improving patient care through technology.</li>
          <li><strong>Jane Smith:</strong> CTO - Leading our tech development with a focus on data security and cloud computing solutions.</li>
          <li><strong>Dr. Emily Lee:</strong> Medical Advisor - Providing clinical insights to ensure our platform is beneficial to both patients and healthcare providers.</li>
        </ul>
      </div>
    </div>
  );
};

export default AboutUs;
