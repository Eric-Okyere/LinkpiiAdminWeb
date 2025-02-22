import React from "react";

const TermsOfUse = () => {
  return (
    <div className="container mx-auto p-6 text-gray-800 mb-32">
      <h1 className="text-3xl font-bold mb-4">Linkpii Terms of Use</h1>
      <p className="mb-4">
        These terms and conditions apply to the Linkpii app ("Application") for mobile devices created by Eric Okyere ("Service Provider") as a Free service.
      </p>
      
      <h2 className="text-2xl font-semibold mt-6 mb-2">Agreement</h2>
      <p className="mb-4">
        By downloading or using the Application, you agree to these terms. Unauthorized copying, modification, extraction of source code, or creation of derivative works is prohibited. All intellectual property rights remain the property of the Service Provider.
      </p>
      
      <h2 className="text-2xl font-semibold mt-6 mb-2">Modifications & Charges</h2>
      <p className="mb-4">
        The Service Provider reserves the right to modify the Application or charge for its services. Any charges will be clearly communicated.
      </p>
      
      <h2 className="text-2xl font-semibold mt-6 mb-2">Personal Data</h2>
      <p className="mb-4">
        The Application processes personal data you provide to deliver its service. Jailbreaking or rooting your device is strongly discouraged as it may compromise security and functionality.
      </p>
      
      <h2 className="text-2xl font-semibold mt-6 mb-2">Third-Party Services</h2>
      <p className="mb-4">
        The Application utilizes third-party services with their own terms and conditions. Example:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>
          <a href="https://policies.google.com/terms" className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">
            Google Play Services
          </a>
        </li>
      </ul>
      
      <h2 className="text-2xl font-semibold mt-6 mb-2">Internet & Data Usage</h2>
      <p className="mb-4">
        The Service Provider is not responsible for application failures due to lack of Wi-Fi or exhausted data allowances. Users are responsible for any mobile network charges incurred.
      </p>
      
      <h2 className="text-2xl font-semibold mt-6 mb-2">Device Responsibility</h2>
      <p className="mb-4">
        Users are responsible for keeping their devices charged. The Service Provider is not liable for service interruptions due to low battery levels.
      </p>
      
      <h2 className="text-2xl font-semibold mt-6 mb-2">Updates & Termination</h2>
      <p className="mb-4">
        The Application may be updated, and users agree to accept updates when offered. The Service Provider may terminate the application at any time without notice.
      </p>
      
      <h2 className="text-2xl font-semibold mt-6 mb-2">Changes to Terms</h2>
      <p className="mb-4">
        The Service Provider may update these terms periodically. Users should review this page regularly for changes.
      </p>
      
      <h2 className="text-2xl font-semibold mt-6 mb-2">Effective Date</h2>
      <p className="mb-4">These terms and conditions are effective as of 2024-07-09.</p>
      
      <h2 className="text-2xl font-semibold mt-6 mb-2">Contact Us</h2>
      <p className="mb-4">
        For any questions regarding these Terms and Conditions, contact the Service Provider at:
      </p>
      <p className="font-semibold">ericokyere018@gmail.com</p>
    </div>
  );
};

export default TermsOfUse;
