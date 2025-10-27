import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Read the terms and conditions for using MijuDramaInfo. Understand your rights and responsibilities when using our platform.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-[#111319] dark:to-[#1a1d2e]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Terms of Service
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Last Updated: October 27, 2025
        </p>

        <div className="bg-white dark:bg-[#1a1d2e] rounded-2xl shadow-xl p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              1. Agreement to Terms
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              By accessing and using MijuDramaInfo (&#34;we,&#34; &#34;us,&#34;
              or &#34;our&#34;), you accept and agree to be bound by the terms
              and provisions of this agreement. If you do not agree to these
              Terms of Service, please do not use our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              2. Use License
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p className="leading-relaxed">
                Permission is granted to temporarily access the materials
                (information or software) on MijuDramaInfo for personal,
                non-commercial viewing only. This is the grant of a license, not
                a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Modify or copy the materials</li>
                <li>
                  Use the materials for any commercial purpose or for any public
                  display (commercial or non-commercial)
                </li>
                <li>
                  Attempt to decompile or reverse engineer any software
                  contained on our website
                </li>
                <li>
                  Remove any copyright or other proprietary notations from the
                  materials
                </li>
                <li>
                  Transfer the materials to another person or &#34;mirror&#34;
                  the materials on any other server
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              3. User Accounts
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p className="leading-relaxed">
                When you create an account with us, you must provide information
                that is accurate, complete, and current at all times. Failure to
                do so constitutes a breach of the Terms, which may result in
                immediate termination of your account on our service.
              </p>
              <p className="leading-relaxed">
                You are responsible for safeguarding the password that you use
                to access the service and for any activities or actions under
                your password. You agree not to disclose your password to any
                third party and to take responsibility for any activities using
                your account.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              4. User Content and Conduct
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p className="leading-relaxed">
                Users may post content including reviews, comments, and ratings.
                By posting content, you grant us the right to use, modify,
                publicly perform, publicly display, reproduce, and distribute
                such content on and through the service.
              </p>
              <p className="leading-relaxed">You agree not to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  Post content that is unlawful, harmful, threatening, abusive,
                  harassing, defamatory, or otherwise objectionable
                </li>
                <li>Impersonate any person or entity</li>
                <li>Post spam or unsolicited promotional content</li>
                <li>
                  Upload viruses or any other malicious code that may harm our
                  service
                </li>
                <li>Harass, intimidate, or threaten other users</li>
                <li>
                  Violate any applicable local, state, national, or
                  international law
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              5. Intellectual Property Rights
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p className="leading-relaxed">
                The service and its original content (excluding user-generated
                content), features, and functionality are and will remain the
                exclusive property of MijuDramaInfo and its licensors. The
                service is protected by copyright, trademark, and other laws.
              </p>
              <p className="leading-relaxed">
                Our trademarks and trade dress may not be used in connection
                with any product or service without our prior written consent.
                All drama and movie data, including images and descriptions, are
                sourced from The Movie Database (TMDB) and are subject to their
                terms of use.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              6. Third-Party Links and Content
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Our service may contain links to third-party websites or services
              that are not owned or controlled by MijuDramaInfo. We have no
              control over, and assume no responsibility for, the content,
              privacy policies, or practices of any third-party websites or
              services. You acknowledge and agree that we shall not be
              responsible or liable for any damage or loss caused by or in
              connection with the use of any such content or services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              7. Disclaimer
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p className="leading-relaxed">
                Your use of the service is at your sole risk. The service is
                provided on an &#34;AS IS&#34; and &#34;AS AVAILABLE&#34; basis.
                The service is provided without warranties of any kind, whether
                express or implied.
              </p>
              <p className="leading-relaxed">
                MijuDramaInfo does not warrant that the service will be
                uninterrupted, secure, or error-free. We do not warrant the
                accuracy or completeness of the content provided through the
                service.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              8. Limitation of Liability
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              In no event shall MijuDramaInfo, its directors, employees,
              partners, agents, suppliers, or affiliates be liable for any
              indirect, incidental, special, consequential, or punitive damages,
              including without limitation loss of profits, data, use, goodwill,
              or other intangible losses, resulting from your access to or use
              of or inability to access or use the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              9. Termination
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We may terminate or suspend your account immediately, without
              prior notice or liability, for any reason whatsoever, including
              without limitation if you breach the Terms. Upon termination, your
              right to use the service will immediately cease. If you wish to
              terminate your account, you may simply discontinue using the
              service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              10. Governing Law
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              These Terms shall be governed and construed in accordance with
              applicable laws, without regard to its conflict of law provisions.
              Our failure to enforce any right or provision of these Terms will
              not be considered a waiver of those rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              11. Changes to Terms
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We reserve the right, at our sole discretion, to modify or replace
              these Terms at any time. If a revision is material, we will try to
              provide at least 30 days&#34; notice prior to any new terms taking
              effect. What constitutes a material change will be determined at
              our sole discretion. By continuing to access or use our service
              after those revisions become effective, you agree to be bound by
              the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              12. Contact Us
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              If you have any questions about these Terms of Service, please
              contact us through our contact page. We are committed to
              addressing your concerns and will respond to all inquiries in a
              timely manner.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              13. Acknowledgment
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              By using MijuDramaInfo, you acknowledge that you have read these
              Terms of Service and agree to be bound by them. These terms
              constitute the entire agreement between you and MijuDramaInfo
              regarding your use of the service.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
