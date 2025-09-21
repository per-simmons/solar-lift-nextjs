import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Solar Lift",
  description: "Privacy Policy for Solar Lift - Learn how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

      <p className="text-sm text-gray-600 mb-8">Effective Date: September 14, 2025</p>

      <div className="prose prose-lg max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
          <p>
            Solar Lift ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website solarlift.co or use our solar installation services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Information We Collect</h2>
          <h3 className="text-xl font-semibold mt-6 mb-3">Personal Information</h3>
          <p>We may collect personal information that you provide directly to us, including:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Name and contact information (email address, phone number, mailing address)</li>
            <li>Property information relevant to solar installation</li>
            <li>Energy usage data and utility bill information</li>
            <li>Financial information for financing options</li>
            <li>Communications you send to us</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">Automatically Collected Information</h3>
          <p>When you visit our website, we may automatically collect:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>IP address and location data</li>
            <li>Browser type and operating system</li>
            <li>Pages visited and time spent on our site</li>
            <li>Referring website addresses</li>
            <li>Device information</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide solar consultation and installation services</li>
            <li>Process your inquiries and respond to your requests</li>
            <li>Send you marketing communications (with your consent)</li>
            <li>Improve our website and services</li>
            <li>Comply with legal obligations</li>
            <li>Protect our rights and prevent fraud</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Information Sharing</h2>
          <p>We may share your information with:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Service providers and contractors who assist in our operations</li>
            <li>Financial institutions for financing purposes (with your consent)</li>
            <li>Government agencies when required by law</li>
            <li>Business partners for joint marketing initiatives (with your consent)</li>
            <li>Potential buyers in case of a business sale or merger</li>
          </ul>
          <p className="mt-4">We do not sell your personal information to third parties.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Data Security</h2>
          <p>
            We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access and receive a copy of your personal information</li>
            <li>Correct inaccurate or incomplete information</li>
            <li>Request deletion of your personal information</li>
            <li>Opt-out of marketing communications</li>
            <li>Withdraw consent where we rely on consent to process your information</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Cookies and Tracking</h2>
          <p>
            We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and understand where our visitors are coming from. You can control cookies through your browser settings.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Third-Party Links</h2>
          <p>
            Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">9. Children's Privacy</h2>
          <p>
            Our services are not directed to individuals under 18 years of age. We do not knowingly collect personal information from children under 18.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">10. California Privacy Rights</h2>
          <p>
            California residents have additional rights under the California Consumer Privacy Act (CCPA), including the right to know what personal information we collect, the right to delete personal information, and the right to opt-out of the sale of personal information.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">11. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Effective Date" above.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">12. Contact Us</h2>
          <p>If you have questions about this Privacy Policy or our privacy practices, please contact us at:</p>
          <div className="mt-4 p-4 bg-gray-50 rounded">
            <p className="font-semibold">Solar Lift</p>
            <p>Email: privacy@solarlift.co</p>
            <p>Phone: 1-800-SOLAR-LIFT</p>
          </div>
        </section>
      </div>
    </div>
  );
}