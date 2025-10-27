import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about MijuDramaInfo, your ultimate destination for discovering Asian dramas, movies, and entertainment. Our mission is to connect drama enthusiasts worldwide.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-[#111319] dark:to-[#1a1d2e]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            About MijuDramaInfo
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Your comprehensive platform for exploring the captivating world of
            Asian entertainment
          </p>
        </div>

        <div className="space-y-12">
          <section className="bg-white dark:bg-[#1a1d2e] rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Our Story
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p className="leading-relaxed">
                MijuDramaInfo was founded with a passion for Asian entertainment
                and a vision to create a comprehensive platform where drama
                enthusiasts from around the world can discover, explore, and
                discuss their favorite shows and movies. Since our inception, we
                have been dedicated to providing accurate, up-to-date
                information about the ever-growing world of Asian dramas.
              </p>
              <p className="leading-relaxed">
                What started as a small project has evolved into a thriving
                community of drama lovers. We understand that Asian dramas offer
                unique storytelling, compelling characters, and cultural
                insights that resonate with audiences globally. Our platform
                serves as a bridge, connecting viewers with the content they
                love and helping them discover new favorites.
              </p>
            </div>
          </section>

          <section className="bg-white dark:bg-[#1a1d2e] rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Our Mission
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p className="leading-relaxed">
                At MijuDramaInfo, our mission is to be the most trusted and
                comprehensive resource for Asian drama and movie information. We
                strive to:
              </p>
              <ul className="list-disc list-inside space-y-3 ml-4">
                <li className="leading-relaxed">
                  Provide detailed, accurate information about dramas, movies,
                  actors, and production teams
                </li>
                <li className="leading-relaxed">
                  Create an engaging platform where fans can discover new
                  content tailored to their preferences
                </li>
                <li className="leading-relaxed">
                  Foster a respectful community where drama enthusiasts can
                  share their thoughts and recommendations
                </li>
                <li className="leading-relaxed">
                  Keep our users informed about the latest releases, trending
                  shows, and industry news
                </li>
                <li className="leading-relaxed">
                  Make Asian entertainment accessible and enjoyable for both
                  longtime fans and newcomers
                </li>
              </ul>
            </div>
          </section>

          <section className="bg-white dark:bg-[#1a1d2e] rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              What We Offer
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-[#111319] p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Extensive Database
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Access comprehensive information about thousands of dramas and
                  movies from China, Korea, Japan, Thailand, and beyond.
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-[#111319] p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Actor Profiles
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Explore detailed profiles of your favorite actors and
                  actresses, including their filmography and latest projects.
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-[#111319] p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Curated Lists
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Discover trending dramas, top-rated shows, and specially
                  curated collections to help you find your next watch.
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-[#111319] p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Latest Updates
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Stay informed with the newest releases, upcoming shows, and
                  breaking news from the Asian entertainment industry.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white dark:bg-[#1a1d2e] rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Our Values
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Accuracy & Reliability
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  We are committed to providing accurate, verified information
                  about dramas, movies, and entertainment professionals.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  User Experience
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  We prioritize creating an intuitive, enjoyable experience that
                  makes discovering content effortless and engaging.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Community Respect
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  We foster a welcoming environment where all fans can share
                  their passion for Asian entertainment respectfully.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Continuous Improvement
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  We constantly evolve our platform based on user feedback and
                  emerging trends in the entertainment industry.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white dark:bg-[#1a1d2e] rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Join Our Community
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
              Whether you&#39;re a seasoned drama enthusiast or just beginning
              your journey into Asian entertainment, MijuDramaInfo welcomes you.
              Join thousands of users who trust us as their go-to resource for
              drama information and recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors text-center"
              >
                Explore Dramas
              </Link>
              <Link
                href="/contact"
                className="inline-block bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold px-8 py-3 rounded-lg transition-colors text-center"
              >
                Contact Us
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
