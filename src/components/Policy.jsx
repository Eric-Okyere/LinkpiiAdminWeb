import React from "react";
import { Helmet } from "react-helmet-async";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-ink-50 pb-20 pt-24 sm:pt-28">
      <Helmet>
        <title>Privacy Policy</title>
        <meta name="description" content="Read Linkpii's privacy policy to learn what information the app collects and how it's used." />
      </Helmet>
      <div className="mx-auto mb-32 max-w-3xl rounded-2xl border border-ink-100 bg-white p-6 text-ink-700 shadow-card sm:p-10">
      <h1 className="font-display text-3xl font-bold text-ink-900 mb-6">Privacy Policy</h1>
      <p className="mb-4">This privacy policy applies to the Linkpii app (hereby referred to as "Application") for mobile devices that was created by Eric Okyere (hereby referred to as "Service Provider") as a Free service. This service is intended for use "AS IS".</p>

      <h2 className="text-2xl font-display font-semibold mt-6 mb-4 text-ink-900">Information Collection and Use</h2>
      <p className="mb-4">The Application collects information when you download and use it. This information may include:</p>
      <ul className="list-disc pl-6 mb-4">
        <li>Your device's Internet Protocol address (e.g. IP address).</li>
        <li>The pages of the Application that you visit, the time and date of your visit, the time spent on those pages.</li>
        <li>The operating system you use on your mobile device.</li>
      </ul>
      <p className="mb-4">The Application does not gather precise information about the location of your mobile device.</p>

      <h2 className="text-2xl font-display font-semibold mt-6 mb-4 text-ink-900">Location Data Usage</h2>
      <p className="mb-4">The Application collects your device's location for:</p>
      <ul className="list-disc pl-6 mb-4">
        <li><strong>Geolocation Services:</strong> Providing personalized content and location-based services.</li>
        <li><strong>Analytics and Improvements:</strong> Analyzing user behavior and improving the Application.</li>
        <li><strong>Third-Party Services:</strong> Sending anonymized location data to enhance the Application.</li>
      </ul>

      <h2 className="text-2xl font-display font-semibold mt-6 mb-4 text-ink-900">Third Party Access</h2>
      <p className="mb-4">Aggregated, anonymized data is shared with third-party services for application improvement. The Application utilizes third-party services with their own privacy policies, including:</p>
      <ul className="list-disc pl-6 mb-4">
        <li><a href="https://policies.google.com/privacy" className="text-brand-600 hover:text-brand-700" target="_blank" rel="noopener noreferrer">Google Play Services</a></li>
      </ul>

      <h2 className="text-2xl font-display font-semibold mt-6 mb-4 text-ink-900">Opt-Out Rights</h2>
      <p className="mb-4">You can stop all collection of information by uninstalling the Application.</p>

      <h2 className="text-2xl font-display font-semibold mt-6 mb-4 text-ink-900">Data Retention Policy</h2>
      <p className="mb-4">User Provided data is retained as long as you use the Application. To request deletion of your data, contact <a href="mailto:ericokyere018@gmail.com" className="text-brand-600 hover:text-brand-700">ericokyere018@gmail.com</a>.</p>

      <h2 className="text-2xl font-display font-semibold mt-6 mb-4 text-ink-900">Children</h2>
      <p className="mb-4">The Application does not knowingly collect data from children under 13. If you believe a child has provided personal information, please contact the Service Provider.</p>

      <h2 className="text-2xl font-display font-semibold mt-6 mb-4 text-ink-900">Security</h2>
      <p className="mb-4">The Service Provider takes measures to safeguard your information through physical, electronic, and procedural security measures.</p>

      <h2 className="text-2xl font-display font-semibold mt-6 mb-4 text-ink-900">Changes</h2>
      <p className="mb-4">This Privacy Policy may be updated periodically. Continued use of the Application signifies acceptance of changes.</p>

      <h2 className="text-2xl font-display font-semibold mt-6 mb-4 text-ink-900">Your Consent</h2>
      <p className="mb-4">By using the Application, you consent to this Privacy Policy.</p>

      <h2 className="text-2xl font-display font-semibold mt-6 mb-4 text-ink-900">Contact Us</h2>
      <p className="mb-4">For privacy-related inquiries, contact <a href="mailto:ericokyere018@gmail.com" className="text-brand-600 hover:text-brand-700">ericokyere018@gmail.com</a>.</p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
