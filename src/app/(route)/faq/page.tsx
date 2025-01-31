export const dynamic = "force-dynamic";

import Link from "next/link";
import React from "react";

const FAQPage = () => {
  return (
    <div className="relative min-h-screen z-1 pt-14">
      <div className="max-w-6xl mx-auto">
        <div className="min-h-8 text-center py-7 mx-auto"></div>
        <div className="mx-auto px-4">
          <div className="relative float-right bg-white dark:bg-[#242526] border-[1px] border-[#00000024] rounded-md shadow-md mb-6">
            <div className="relative py-3 px-4">
              <h1 className="text-2xl font-bold">Frequently Asked Questions</h1>
            </div>
            <div className="relative py-3 px-4">
              <div className="-mx-3">
                <div className="relative float-left w-full md:w-[75%] px-3">
                  <div className="block">
                    <h1 className="font-bold text-md mb-1">
                      What is MijuDramaInfo.vercel.app?
                    </h1>
                    <p className="text-sm mb-5">
                      MijuDramaInfo.vercel.app is a comprehensive website
                      dedicated to Asian dramas and films, especially from South
                      Korea, Japan, China, and Taiwan. It provides a rich
                      database of TV shows, movies, and actors, along with
                      user-generated content such as reviews, ratings, and
                      recommendations.
                    </p>
                    <h1 className="font-bold text-md mb-1">
                      Is it free to register and use MijuDramaInfo.vercel.app?
                    </h1>
                    <p className="text-sm mb-5">
                      Yes, registering and using the site is completely free.
                    </p>
                    <h1 className="font-bold text-md mb-1">
                      How can I create an account?
                    </h1>
                    <p className="text-sm mb-5">
                      To create an account, click on the &#34;Sign Up&#34;
                      button at the top right corner of the homepage. Fill in
                      the required details, and you&#34;ll be able to create
                      your account and start exploring the site.
                    </p>
                    <h1 className="font-bold text-md mb-1">
                      What should I do if I forget my password?
                    </h1>
                    <p className="text-sm mb-5">
                      If you forget your password, click on the &#34;Forgot
                      Password&#34; link on the login page. Follow the
                      instructions to reset your password.
                    </p>
                    <h1 className="font-bold text-md mb-1">
                      What features are available to registered users?
                    </h1>
                    <p className="text-sm mb-5">
                      As a user of MijuDramaInfo, you can:
                    </p>
                    <ul className="list-item pl-8 mb-5">
                      <li className="list-disc text-sm">
                        Create a list of dramas and movies that you have watched
                        or want to watch
                      </li>
                      <li className="list-disc text-sm">
                        Create a custom list of your favorite dramas, movies, or
                        actors
                      </li>
                      <li className="list-disc text-sm">
                        Write reviews for the dramas and movies you have watched
                      </li>
                      <li className="list-disc text-sm">
                        Make recommendations for other users based on your
                        favorite dramas and movies
                      </li>
                      <li className="list-disc text-sm">
                        Have a newsfeed where you can share what you are
                        watching with your friends and other users
                      </li>
                      <li className="list-disc text-sm">
                        Contribute to our database by adding missing information
                        or new dramas and movies
                      </li>
                      <li className="list-disc text-sm">
                        Join discussions with other English-speaking fans of
                        Asian dramas and movies
                      </li>
                      <li className="list-disc text-sm">
                        Make new friends who share the same interests in Asian
                        dramas and movies.
                      </li>
                    </ul>
                    <h1 className="font-bold text-md mb-1">
                      I can&apos;t find a specific drama/movie/actor on
                      MijuDramaInfo.vercel.app. Can someone add it?
                    </h1>
                    <p className="text-sm mb-5">
                      If a drama/movie/actor is not on the site, you can add it
                      yourself by going to the top bar and clicking &quot;Add
                      New Title&quot; or &quot;Add New Person&quot;. A staff
                      member will review your submission and either approve or
                      reject it. Common reasons for rejection include the
                      drama/movie/actor already being on the site, not being
                      from one of the allowed countries (Japan, Korea, China,
                      Hong Kong, Taiwan, Thailand, Philippines), or containing
                      inappropriate content.
                    </p>
                    <h1 className="font-bold text-md mb-1">
                      Why was my submission rejected?
                    </h1>
                    <p className="text-sm mb-5">
                      If your submission was rejected, it is likely due to one
                      of the following reasons:
                    </p>
                    <ul className="list-item pl-8 mb-5">
                      <li className="list-disc text-sm">
                        The title was already on MijuDramaInfo under the name
                        you submitted or another commonly known name.
                      </li>
                      <li className="list-disc text-sm">
                        The title was not from Japan, Korea, China, Hong Kong,
                        Taiwan, Thailand, or the Philippines. Please note that
                        actors from other countries may be accepted if they are
                        active in dramas or movies from the allowed countries.
                      </li>
                      <li className="list-disc text-sm">
                        The content was inappropriate. While MijuDramaInfo is a
                        database for Dramas/Movies/Actors, it does not allow for
                        pornographic content. Films and dramas with graphic
                        nudity or sex scenes may be accepted, but not
                        straight-up pornographic films.
                      </li>
                    </ul>
                    <p className="text-sm mb-5">
                      If you have received a private message from our moderators
                      with more information, please refer to that message for
                      the specific reason for the rejection.
                    </p>
                    <h1 className="font-bold text-md mb-1">
                      Can I watch or download dramas/movies on
                      MijuDramaInfo.vercel.app?
                    </h1>
                    <p className="text-sm mb-5">
                      No, MijuDramaInfo.vercel.app does not provide streaming or
                      download services for dramas and movies. Instead, we
                      provide links to licensed platforms where users can watch
                      the content.
                    </p>
                    <h1 className="font-bold text-md mb-1">
                      How do I add a drama/movie to my watchlist?
                    </h1>
                    <p className="text-sm mb-5">
                      To add a drama or movie to your watchlist, go to the drama
                      or movie page and click on the &quot;Add to List&quot;
                      button to the right of the &quot;Buy on Amazon&quot;
                      button. You can also add titles from the drama or movie
                      index page, or from an actor page.
                    </p>
                    <h1 className="font-bold text-md mb-1">
                      How can I share on the feeds that I watched a drama
                      episode or a movie?
                    </h1>
                    <p className="text-sm mb-5">
                      When adding or updating a drama on your watchlist, a
                      pop-up window will appear where you can select the episode
                      you watched and share it on the feeds. You can also share
                      your thoughts on the episode in the comment section. For
                      movies, you can simply click on the &quot;Watched&quot;
                      button on the movie page to share it on the feeds.
                    </p>
                    <h1 className="font-bold text-md mb-1">
                      How do I add favorite Dramas, Movies, or Actors to my
                      profile?
                    </h1>
                    <p className="text-sm mb-5">
                      To add your favorite Dramas, Movies, or Actors to your
                      profile, follow these steps:
                    </p>
                    <ul className="list-item pl-8 mb-5">
                      <li className="list-disc text-sm">
                        Go to your profile page
                      </li>
                      <li className="list-disc text-sm">
                        Click on the &quot;List&quot; tab
                      </li>
                      <li className="list-disc text-sm">
                        Choose &quot;Favorite Actors,&quot; &quot;Favorite
                        Movies,&quot; or &quot;Favorite Dramas&quot;
                      </li>
                      <li className="list-disc text-sm">
                        Search for the dramas, movies, or actors that you want
                        to add to your list
                      </li>
                      <li className="list-disc text-sm">
                        Click &quot;Save List&quot;
                      </li>
                    </ul>
                    <p className="text-sm mb-5">
                      Please note that on your profile, only your top 5
                      favorites in each category will be shown. You can add as
                      many favorites as you want to your lists.
                    </p>
                    <h1 className="font-bold text-md mb-1">
                      Why do you only offer dramas and movies from certain
                      countries?
                    </h1>
                    <p className="text-sm mb-5">
                      We have chosen to focus on building a comprehensive
                      database of actors, movies, and dramas from these 7
                      countries. Once we have a large number of entries from
                      these countries, we will consider adding more countries to
                      our database. Our goal is to have a complete database for
                      the countries we do have.
                    </p>
                    <h1 className="font-bold text-md mb-1">
                      Can you add dramas and movies from other countries?
                    </h1>
                    <p className="text-sm mb-5">
                      We appreciate your interest in these countries and their
                      dramas and movies. Once we have a comprehensive database
                      for the countries we currently have, we will consider
                      adding more countries to our database. In the meantime,
                      please continue to enjoy the dramas and movies from the 7
                      countries we currently offer.
                    </p>
                    <h1 className="font-bold text-md mb-1">
                      How can I suggest a new feature for MijuDramaInfo?
                    </h1>
                    <p className="text-sm mb-5">
                      We are always looking for ways to improve our website and
                      enhance the user experience. If you have an idea for a new
                      feature, please visit our Suggestions Forum and create a
                      new topic to share your idea. In your post, please provide
                      a detailed description of your idea and explain how it
                      would benefit MijuDramaInfo users. We appreciate your
                      input and look forward to considering your suggestion.
                    </p>
                    <h1 className="font-bold text-md mb-1">
                      How do I leave a review?
                    </h1>
                    <p className="text-sm mb-5">
                      To leave a review, find the show or movie you want to
                      review and scroll down to the review section. Click on
                      &#34;Write a Review,&#34; enter your feedback, and submit
                      it.
                    </p>
                    <h1 className="font-bold text-md mb-1">
                      Is there a way to earn rewards?
                    </h1>
                    <p className="text-sm mb-5">
                      Yes, the points system on MijuDramaInfo.vercel.app allows
                      users to earn rewards for their contributions to the site.
                      Points can be earned by adding new titles, writing
                      reviews, making recommendations, and participating in
                      discussions. Points can then be redeemed for various
                      rewards, such as custom themes for your watchlist, or
                      early access to new features.
                    </p>
                    <h1 className="font-bold text-md mb-1">
                      How do I report a problem or issue?
                    </h1>
                    <p className="text-sm mb-5">
                      If you encounter a problem or issue on
                      MijuDramaInfo.vercel.app, you can report it by clicking on
                      the &#34;Report&#34; button on the relevant page or post.
                      You can also contact the MijuDramaInfo support team
                      through the &#34;Contact Us&#34; page on the website.
                    </p>
                    <h1 className="font-bold text-md mb-1">
                      How do I delete my account?
                    </h1>
                    <p className="text-sm mb-5">
                      To delete your account, please follow these steps:
                    </p>
                    <ul className="list-item pl-8 mb-5">
                      <li className="list-disc text-sm">
                        Log in to your account on our website.
                      </li>
                      <li className="list-disc text-sm">
                        Go to the &#34;Settings&#34; section in your account.
                      </li>
                      <li className="list-disc text-sm">
                        Click on the &#34;Deactivate Account&#34; option.
                      </li>
                      <li className="list-disc text-sm">
                        Confirm the deactivation of your account by clicking on
                        &#34;Deactivate Account&#34; again.
                      </li>
                    </ul>
                    <p className="text-sm mb-5">
                      Please note that your account will be inactive for 30 days
                      before it is permanently deleted. If you log in to your
                      account during this period, the account deletion process
                      will be cancelled and your account will remain active.
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

export default FAQPage;
