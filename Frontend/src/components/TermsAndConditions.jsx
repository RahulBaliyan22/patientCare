import React from "react";
import "./TermsAndConditions.css"; // Import terms and conditions styles
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import styles for react-toastify
const TermsAndConditions = () => {
  return (
    <div className="terms-conditions-container">
      <h1>Terms and Conditions</h1>
      <p>
        Welcome to PatientCare. By using our platform, you agree to comply with and be bound by the following terms and conditions. Please read these terms carefully before using our services.
      </p>

      <div className="section">
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using PatientCare, you agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree with any part of these terms, you must not use our services.
        </p>
      </div>

      <div className="section">
        <h2>2. Use of Our Services</h2>
        <p>
          You may only use our services for lawful purposes and in accordance with these Terms and Conditions.
        </p>
        <ul>
          <li>Any illegal or fraudulent activity.</li>
          <li>Attempting to interfere with or disrupt the platform's operations.</li>
          <li>Uploading or distributing harmful content such as viruses or malware.</li>
        </ul>
      </div>

      <div className="section">
        <h2>3. User Account</h2>
        <p>
          To use our platform, you may be required to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately if you suspect any unauthorized use of your account.
        </p>
      </div>

      <div className="section">
        <h2>4. Intellectual Property</h2>
        <p>
          All content, including but not limited to text, graphics, logos, images, and software, on the PatientCare platform is the property of PatientCare and is protected by intellectual property laws. You may not copy, modify, or distribute any content from our platform without prior written consent.
        </p>
      </div>

      <div className="section">
        <h2>5. Data Privacy and Security</h2>
        <p>
          By using our services, you agree to our Privacy Policy, which outlines how we collect, use, and protect your personal and medical data. We are committed to ensuring the security of your data, but we cannot guarantee absolute security against unauthorized access or data breaches.
        </p>
      </div>

      <div className="section">
        <h2>6. Limitation of Liability</h2>
        <p>
          PatientCare is not liable for any direct, indirect, incidental, or consequential damages that may arise from your use of our platform or services. This includes but is not limited to any errors, interruptions, or data loss caused by using the platform.
        </p>
      </div>

      <div className="section">
        <h2>7. Termination</h2>
        <p>
          We may suspend or terminate your access to the platform at our sole discretion if we believe you have violated these Terms and Conditions. Upon termination, your right to use the platform will immediately cease, and you must stop using our services.
        </p>
      </div>

      <div className="section">
        <h2>8. Changes to the Terms</h2>
        <p>
          We reserve the right to update or modify these Terms and Conditions at any time. Any changes will be effective immediately upon posting on this page. It is your responsibility to review these terms periodically to stay informed about any updates.
        </p>
      </div>

      <div className="section">
        <h2>9. Governing Law</h2>
        <p>
          These Terms and Conditions are governed by and construed in accordance with the laws of the jurisdiction in which PatientCare operates. Any disputes arising from these terms will be subject to the exclusive jurisdiction of the courts in that jurisdiction.
        </p>
      </div>

      <div className="section">
        <h2>10. Contact Us</h2>
        <p>
          If you have any questions about these Terms and Conditions, please contact us at:
        </p>
        <p>Email: support@patientcare.com</p>
        <p>Phone: (123) 456-7890</p>
      </div>
    </div>
  );
};

export default TermsAndConditions;
