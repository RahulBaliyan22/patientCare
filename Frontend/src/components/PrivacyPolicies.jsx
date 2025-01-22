import React from "react";
import "./PrivacyPolicies.css"; // Import privacy policies styles
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import styles for react-toastify
const PrivacyPolicies = () => {
  return (
    <div className="privacy-policy-container">
      <h1>Privacy Policy</h1>
      <p>
        At PatientCare, we value your privacy and are committed to protecting your personal and medical information. This Privacy Policy outlines how we collect, use, and safeguard your data to ensure the highest level of privacy and security.
      </p>

      <div className="section">
        <h2>1. Information We Collect</h2>
        <p>
          We collect the following types of information to provide a secure and efficient patient care experience:
        </p>
        <ul>
          <li>Personal details (name, email, phone number, etc.)</li>
          <li>Medical records, treatment history, and medication details (if provided by users)</li>
          <li>Log data (IP address, browser type, etc.) to ensure platform security</li>
        </ul>
      </div>

      <div className="section">
        <h2>2. How We Use Your Information</h2>
        <p>
          The information collected is used for the following purposes:
        </p>
        <ul>
          <li>To securely store and manage your medical records and treatment history</li>
          <li>To improve the user experience on our platform</li>
          <li>To respond to your inquiries or requests regarding your healthcare data</li>
          <li>To ensure the security and privacy of your personal and medical information</li>
        </ul>
      </div>

      <div className="section">
        <h2>3. Data Security</h2>
        <p>
          We implement industry-standard security measures to protect your personal and medical data, including encryption, multi-factor authentication, and restricted access controls to ensure the safety of your information.
        </p>
      </div>

      <div className="section">
        <h2>4. Sharing Your Information</h2>
        <p>
          We may share your information with trusted third-party service providers who assist us in operating our platform, such as cloud hosting providers and healthcare technology services. However, we will never sell or rent your personal or medical information to any third parties.
        </p>
      </div>

      <div className="section">
        <h2>5. Your Rights</h2>
        <p>
          You have the following rights regarding your personal and medical information:
        </p>
        <ul>
          <li>Access, update, or delete your personal and medical information at any time</li>
          <li>Opt-out of non-essential communications, such as promotional emails</li>
          <li>Request a copy of your medical records (subject to applicable laws and regulations)</li>
        </ul>
      </div>

      <div className="section">
        <h2>6. Changes to this Privacy Policy</h2>
        <p>
          We may update this Privacy Policy as we enhance our platform or as required by law. Any changes will be posted on this page, and the updated version will be effective immediately upon posting.
        </p>
      </div>

      <div className="section">
        <h2>7. Contact Us</h2>
        <p>
          If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact us:
        </p>
        <p>Email: support@patientcare.com</p>
        <p>Phone: (123) 456-7890</p>
      </div>
    </div>
  );
};

export default PrivacyPolicies;
