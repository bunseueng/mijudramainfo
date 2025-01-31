export const dynamic = "force-dynamic";

import Link from "next/link";
import React from "react";

const ContactUsPage = () => {
  return (
    <div className="relative min-h-screen z-1 pt-14">
      <div className="max-w-6xl mx-auto">
        <div className="min-h-8 text-center py-7 mx-auto"></div>
        <div className="mx-auto px-4">
          <div className="relative float-right bg-white dark:bg-[#242526] border-[1px] border-[#00000024] rounded-md shadow-md mb-6">
            <div className="relative py-3 px-4">
              <h1 className="text-2xl font-bold">Contact Us</h1>
            </div>
            <div className="relative py-3 px-4">
              <div className="-mx-3">
                <div className="relative float-left w-full md:w-[75%] px-3">
                  <div className="block">
                    <h1 className="font-bold text-md mb-1">How to Reach Us</h1>
                    <h1 className="font-bold text-md">
                      For Support or Technical Assistance:
                    </h1>
                    <p className="text-sm mb-5">
                      Email us at support@mijudramainfo.com. Our dedicated
                      support team is ready to assist you with any technical
                      issues or questions you may have.
                    </p>
                    <h1 className="font-bold text-md mb-1">
                      Interested in Advertising?
                    </h1>
                    <p className="text-sm mb-5">
                      If you’re looking to advertise on our platform, reach out
                      to us at advertise@mijudramainfo.com. Our sales team is
                      eager to discuss advertising opportunities and help you
                      connect with our vibrant community of drama and movie
                      enthusiasts.
                    </p>
                    <h1 className="font-bold text-md mb-1">
                      For General Inquiries or Feedback:
                    </h1>
                    <p className="text-sm mb-5">
                      We value your input! For general inquiries or to provide
                      feedback, please email us at info@mijudramainfo.com. Your
                      suggestions and comments are important to us, and we look
                      forward to hearing from you.
                    </p>
                    <p className="text-sm mb-5">
                      We hope you enjoy exploring MijuDramaInfo and find your
                      next favorite drama or movie!
                    </p>
                  </div>
                </div>
                <div className="relative float-left w-full md:w-[25%] px-3">
                  <div className="flex flex-col items-start">
                    <Link href="/faq" className="py-2 md:py-3">
                      F.A.Q
                    </Link>
                    <Link href="/about_us" className="py-2 md:py-3">
                      About Us
                    </Link>
                    <Link href="/contact_us" className="py-2 md:py-3">
                      Contact Us
                    </Link>
                    <Link href="/terms" className="py-2 md:py-3">
                      Terms of Use
                    </Link>
                    <Link href="/privacy" className="py-2 md:py-3">
                      Privacy
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
