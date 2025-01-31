export const dynamic = "force-dynamic";

import { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "About Us",
  description: "About Us.",
};

const AboutUsPage = () => {
  return (
    <div className="relative min-h-screen z-1 pt-14">
      <div className="max-w-6xl mx-auto">
        <div className="min-h-8 text-center py-7 mx-auto"></div>
        <div className="mx-auto px-4">
          <div className="relative float-right bg-white dark:bg-[#242526] border-[1px] border-[#00000024] rounded-md shadow-md mb-6">
            <div className="relative py-3 px-4">
              <h1 className="text-2xl font-bold">About Us</h1>
            </div>
            <div className="relative py-3 px-4">
              <div className="-mx-3">
                <div className="relative float-left w-full md:w-[75%] px-3">
                  <div className="block">
                    <h1 className="font-bold text-md mb-1">
                      Welcome to MijuDramaInfo!
                    </h1>
                    <p className="text-sm mb-5">
                      At MijuDramaInfo, we are passionate about bringing you the
                      best of Asian entertainment. Our website is dedicated to
                      providing comprehensive information and resources about
                      Asian dramas and films, with a special focus on content
                      from South Korea, Japan, China, and Taiwan.
                    </p>
                    <h1 className="font-bold text-md mb-1">Our Mission</h1>
                    <p className="text-sm mb-5">
                      Our mission is to be the go-to destination for fans of
                      Asian entertainment. We strive to create a vibrant
                      community where you can explore, discover, and discuss
                      your favorite TV shows, movies, and actors. Whether
                      you&#34;re a seasoned fan or new to the world of Asian
                      dramas, we&#34;re here to help you find the best content
                      and connect with like-minded enthusiasts.
                    </p>
                    <h1 className="font-bold text-md mb-1">What We Offer</h1>
                    <ul className="list-item pl-8 mb-5">
                      <li className="list-disc text-sm">
                        Extensive Database: Access a vast collection of TV
                        shows, movies, and actors from across Asia. Our database
                        is continuously updated with the latest releases and
                        timeless classics.
                      </li>
                      <li className="list-disc text-sm">
                        User-Generated Content: Share your thoughts with the
                        community by writing reviews, rating shows and movies,
                        and making recommendations. Your contributions help
                        others discover great content.
                      </li>
                      <li className="list-disc text-sm">
                        Personalized Features: Create and manage your own
                        watchlists, track your progress, and receive tailored
                        recommendations based on your interests.
                      </li>
                      <li className="list-disc text-sm">
                        Community Interaction: Connect with other fans through
                        comments, forums, and personal profiles. Build
                        friendships, share your passion, and engage in
                        meaningful discussions about your favorite
                        entertainment.
                      </li>
                    </ul>

                    <h1 className="font-bold text-md mb-1">Our Team</h1>
                    <p className="text-sm mb-5">
                      We are a team of dedicated individuals who love Asian
                      dramas and films. Our diverse backgrounds and shared
                      enthusiasm for Asian entertainment drive us to
                      continuously improve and expand our offerings. We value
                      your feedback and are committed to providing a top-notch
                      experience for all our users.
                    </p>

                    <p className="text-sm mb-5">
                      We invite you to join our community and be part of the
                      MijuDramaInfo family. Whether you’re here to explore new
                      content, contribute reviews, or connect with fellow fans,
                      we’re excited to have you with us!
                    </p>
                    <h1 className="font-bold text-md mb-1">Need Help?</h1>
                    <p className="text-sm mb-5">
                      For any questions or suggestions, feel free to reach out
                      through our Contact Us page. We look forward to hearing
                      from you and enhancing your experience with us.
                    </p>
                    <p className="text-sm mb-5">
                      Thank you for visiting MijuDramaInfo. Enjoy your journey
                      through the world of Asian entertainment!
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

export default AboutUsPage;
