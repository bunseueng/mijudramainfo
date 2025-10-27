import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how MijuDramaInfo collects, uses, and protects your personal information. Read our comprehensive privacy policy.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-[#111319] dark:to-[#1a1d2e]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Privacy Policy
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Last Updated: October 27, 2025
        </p>

        <div className="bg-white dark:bg-[#1a1d2e] rounded-2xl shadow-xl p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              1. Introduction
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Welcome to MijuDramaInfo. We respect your privacy and are
              committed to protecting your personal data. This privacy policy
              will inform you about how we look after your personal data when
              you visit our website and tell you about your privacy rights and
              how the law protects you.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              2. Information We Collect
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p className="leading-relaxed">
                We may collect, use, store, and transfer different kinds of
                personal data about you:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Identity Data:</strong> Username, profile information
                </li>
                <li>
                  <strong>Contact Data:</strong> Email address
                </li>
                <li>
                  <strong>Technical Data:</strong> IP address, browser type,
                  device information, operating system
                </li>
                <li>
                  <strong>Usage Data:</strong> Information about how you use our
                  website and services
                </li>
                <li>
                  <strong>Profile Data:</strong> Your preferences, feedback, and
                  survey responses
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              3. How We Use Your Information
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p className="leading-relaxed">
                We use your personal data for the following purposes:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>To provide and maintain our services</li>
                <li>To personalize your experience on our platform</li>
                <li>To improve our website and user experience</li>
                <li>To communicate with you about updates and features</li>
                <li>To analyze usage patterns and trends</li>
                <li>To detect and prevent fraud and abuse</li>
                <li>
                  To comply with legal obligations and enforce our terms of
                  service
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              4. Cookies and Tracking Technologies
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p className="leading-relaxed">
                We use cookies and similar tracking technologies to track
                activity on our website and hold certain information. Cookies
                are files with small amounts of data that are sent to your
                browser from a website and stored on your device.
              </p>
              <p className="leading-relaxed">Types of cookies we use:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Essential Cookies:</strong> Required for the website
                  to function properly
                </li>
                <li>
                  <strong>Analytics Cookies:</strong> Help us understand how
                  visitors interact with our website
                </li>
                <li>
                  <strong>Preference Cookies:</strong> Remember your preferences
                  and settings
                </li>
                <li>
                  <strong>Advertising Cookies:</strong> Used to deliver relevant
                  advertisements
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              5. Third-Party Services
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p className="leading-relaxed">
                We may use third-party services that collect, monitor, and
                analyze data to improve our service:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Google Analytics:</strong> To understand how users
                  interact with our website
                </li>
                <li>
                  <strong>Google AdSense:</strong> To display relevant
                  advertisements
                </li>
                <li>
                  <strong>The Movie Database (TMDB) API:</strong> To provide
                  drama and movie information
                </li>
              </ul>
              <p className="leading-relaxed">
                These third parties have their own privacy policies addressing
                how they use such information.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              6. Data Security
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We have implemented appropriate security measures to prevent your
              personal data from being accidentally lost, used, accessed in an
              unauthorized way, altered, or disclosed. We limit access to your
              personal data to those employees, agents, contractors, and other
              third parties who have a business need to know.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              7. Data Retention
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We will only retain your personal data for as long as necessary to
              fulfill the purposes we collected it for, including for the
              purposes of satisfying any legal, accounting, or reporting
              requirements. To determine the appropriate retention period, we
              consider the amount, nature, and sensitivity of the personal data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              8. Your Legal Rights
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p className="leading-relaxed">
                Under certain circumstances, you have rights under data
                protection laws in relation to your personal data:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Request access to your personal data</li>
                <li>Request correction of your personal data</li>
                <li>Request erasure of your personal data</li>
                <li>Object to processing of your personal data</li>
                <li>Request restriction of processing your personal data</li>
                <li>Request transfer of your personal data</li>
                <li>Right to withdraw consent</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              9. Children&apos;s Privacy
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Our service is not directed to children under the age of 13. We do
              not knowingly collect personally identifiable information from
              children under 13. If you are a parent or guardian and you are
              aware that your child has provided us with personal data, please
              contact us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              10. Changes to This Privacy Policy
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We may update our privacy policy from time to time. We will notify
              you of any changes by posting the new privacy policy on this page
              and updating the &apos;Last Updated&apos; date at the top of this
              privacy policy. You are advised to review this privacy policy
              periodically for any changes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              11. Contact Us
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              If you have any questions about this privacy policy or our privacy
              practices, please contact us through our contact page or email us
              directly. We take all privacy concerns seriously and will respond
              to your inquiries as quickly as possible.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
