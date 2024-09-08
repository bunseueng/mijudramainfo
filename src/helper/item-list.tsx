import { IoMailOutline } from "react-icons/io5";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { CgProfile } from "react-icons/cg";
import { FaRegRectangleList } from "react-icons/fa6";
import { CiDark, CiSettings } from "react-icons/ci";
import { TiArrowForward } from "react-icons/ti";

export const navbar_items = [
  {
    id: 1,
    label: "Explore",
    link: "/",
  },
  {
    label: "Top Drama",
    link: "/drama/top",
  },
  {
    label: "Popular Drama",
    link: "/drama/popular",
  },
  {
    label: "Newest",
    link: "/drama/newest",
  },
];

export const tv_subitems = [
  {
    label: "Top Shows",
    link: "/drama/top",
  },
  {
    label: "Popular Shows",
    link: "/drama/popular",
  },
  {
    label: "Variety Shows",
    link: "/shows/variety",
  },
  {
    label: "Newest",
    link: "/drama/newest",
  },
  {
    label: "Upcoming",
    link: "/drama/upcoming",
  },
];

export const movie_subitems = [
  {
    label: "Top Movies",
    link: "/movie/top",
  },
  {
    label: "Most Popular Movies",
    link: "/movie/popular",
  },
  {
    label: "Newest",
    link: "/movie/newest",
  },
  {
    label: "Upcoming",
    link: "/movie/upcoming",
  },
];

export const people_subitems = [
  {
    label: "Top Actors",
    link: "/people/top",
  },
];

export const typeCheckbox1 = [
  {
    label: "Dramas",
    value: "tv",
  },
  {
    label: "Movies",
    value: "movie",
  },
];
export const typeCheckbox2 = [
  {
    label: "Tv Shows",
    value: "tvShows",
  },
  {
    label: "Drama Special",
    value: "special",
  },
];

export const countryCheckbox1 = [
  {
    label: "China",
    value: "CN",
  },
  {
    label: "South Korea",
    value: "KR",
  },
  {
    label: "Japan",
    value: "JP",
  },
  {
    label: "HongKong",
    value: "HK",
  },
  {
    label: "Taiwan",
    value: "TW",
  },
];

export const genreCheckbox = [
  {
    id: "37",
    value: "Action",
  },
  {
    id: "16",
    value: "Animation",
  },
  {
    id: "35",
    value: "Comedy",
  },
  {
    id: "18",
    value: "Drama",
  },
  {
    id: "27",
    value: "Horror",
  },
  {
    id: "10402",
    value: "Music",
  },
  {
    id: "10749",
    value: "Romance",
  },
  {
    id: "878",
    value: "Science Fiction",
  },
  {
    id: "10770",
    value: "TV Movie",
  },
  {
    id: "10765",
    value: "Sci-Fi & Fantasy",
  },
  {
    id: "10766",
    value: "Soap",
  },
  {
    id: "10767",
    value: "Talk",
  },
  {
    id: "10768",
    value: "War & Politics",
  },
  {
    id: "37",
    value: "Western",
  },
  {
    id: "14",
    value: "Fantasy",
  },
  {
    id: "36",
    value: "History",
  },
];

export const genreCheckbox2 = [
  {
    id: "12",
    value: "Adventure",
  },
  {
    id: "80",
    value: "Crime",
  },
  {
    id: "99",
    value: "Documentary",
  },
  {
    id: "10751",
    value: "Family",
  },
  {
    id: "10762",
    value: "Kids",
  },
  {
    id: "9648",
    value: "Mystery",
  },
  {
    id: "10763",
    value: "News",
  },
  {
    id: "10764",
    value: "Reality",
  },
  {
    id: "53",
    value: "Thriller",
  },
  {
    id: "10752",
    value: "War",
  },
];

export const networkCheckbox = [
  {
    id: "1419",
    value: "Youku",
  },
  {
    id: "1330",
    value: "iQIYI",
  },
  {
    id: "2007",
    value: "WeTV",
  },
  {
    id: "1631",
    value: "Mango TV",
  },
];

export const networkCheckbox2 = [
  {
    id: "989",
    value: "Zhejiang Television",
  },
  {
    id: "1056",
    value: "Dragon TV",
  },
];

export const starLabels = [
  {
    value: 1,
    label: "1",
  },
  {
    value: 2,
    label: "2",
  },
  {
    value: 3,
    label: "3",
  },
  {
    value: 4,
    label: "4",
  },
  {
    value: 5,
    label: "5",
  },
  {
    value: 6,
    label: "6",
  },
  {
    value: 7,
    label: "7",
  },
  {
    value: 8,
    label: "8",
  },
  {
    value: 9,
    label: "9",
  },
  {
    value: 10,
    label: "10",
  },
];

export const statusCheckbox = [
  {
    id: "0",
    value: "Ongoing",
  },
  {
    id: "3",
    value: "Completed",
  },
  {
    id: "2",
    value: "Upcoming",
  },
];

export const sortCheckbox = [
  {
    id: "popularity.desc",
    value: "Most Popular",
  },
  {
    id: "vote_count.desc",
    value: "Top Ranked",
  },
  {
    id: "vote_average.desc",
    value: "Top Rated",
  },
  {
    id: "formattedDate",
    value: "Newest",
  },
];

export const footer = [
  {
    link: "/faq",
    label: "FAQ",
  },
  {
    link: "/about",
    label: "About Us",
  },
  {
    link: "/contact",
    label: "Contact",
  },
  {
    link: "/terms",
    label: "Terms",
  },
  {
    link: "/privacy",
    label: "Privacy",
  },
];

export const footerRecommend = [
  {
    link: "/drama/top_chinese_dramas",
    label: "Top 100 Chinese Dramas",
  },
  {
    link: "/drama/top_korean_dramas",
    label: "Top 100 Korean Dramas",
  },
  {
    link: "/drama/top_japanese_dramas",
    label: "Top 100 Japanese Dramas",
  },
];

export const sessionItems = [
  {
    icon: <IoMailOutline />,
    link: "",
    label: "Message",
  },
  {
    icon: <LiaUserFriendsSolid />,
    link: "/friends",
    label: "Friends",
  },
  {
    icon: <CgProfile />,
    link: "/profile",
    label: "Profile",
  },
  {
    icon: <FaRegRectangleList />,
    link: "",
    label: "My Watchlist",
  },
  {
    icon: <CiDark />,
    link: "",
    label: "Dark Mode",
  },
  {
    icon: <CiSettings />,
    link: "/setting/profile",
    label: "Settings",
  },
];

export const profileList = [
  {
    id: "#profile",
    label: "Profile",
    link: "/profile",
    page: "",
  },
  {
    id: "#feeds",
    label: "Feeds",
    link: "/profile",
    page: "/feeds",
  },
  {
    id: "#reviews",
    label: "Reviews",
    link: "/profile",
    page: "/reviews",
  },
  {
    id: "#lists",
    label: "Lists",
    link: "/profile",
    page: "/lists",
  },
  {
    id: "#watchlist",
    label: "Watchlist",
    link: "/profile",
    page: "/watchlist",
  },
];

export const friendItems = [
  {
    label: "All Friends",
    link: "/friends",
  },
  {
    label: "Friend Request",
    link: "/friends",
  },
  {
    label: "User Search",
    link: "/friends",
  },
];

export const editPageList = [
  {
    label: "Primary Details",
    link: "/detail",
    icon: <TiArrowForward />,
  },
  {
    label: "Cover Image",
    link: "/cover",
    icon: <TiArrowForward />,
  },
  {
    label: "Related Titles",
    link: "/related",
    icon: <TiArrowForward />,
  },
  {
    label: "Cast",
    link: "/cast",
    icon: <TiArrowForward />,
  },
  {
    label: "Crew",
    link: "/crew",
    icon: <TiArrowForward />,
  },
  {
    label: "Services",
    link: "/services",
    icon: <TiArrowForward />,
  },
  {
    label: "External Links",
    link: "/external_link",
    icon: <TiArrowForward />,
  },
  {
    label: "Release Information",
    link: "/release",
    icon: <TiArrowForward />,
  },
  {
    label: "Production Information",
    link: "/production",
    icon: <TiArrowForward />,
  },
  {
    label: "Generes & Tags",
    link: "/genres",
    icon: <TiArrowForward />,
  },
];

export const tvVideoList = [
  {
    label: "Trailers",
    link: "/trailers",
    icon: <TiArrowForward />,
  },
  {
    label: "Teasers",
    link: "/teasers",
    icon: <TiArrowForward />,
  },
  {
    label: "Clips",
    link: "/clips",
    icon: <TiArrowForward />,
  },
  {
    label: "Behind the Scenes",
    link: "/behind_the_scenes",
    icon: <TiArrowForward />,
  },
  {
    label: "Bloopers",
    link: "/bloopers",
    icon: <TiArrowForward />,
  },
  {
    label: "Featurettes",
    link: "/featurettes",
    icon: <TiArrowForward />,
  },
  {
    label: "Opening Credits",
    link: "/opening_credits",
    icon: <TiArrowForward />,
  },
];

export const movieVideoList = [
  {
    label: "Trailers",
    link: "/trailers",
    icon: <TiArrowForward />,
  },
  {
    label: "Teasers",
    link: "/teasers",
    icon: <TiArrowForward />,
  },
  {
    label: "Clips",
    link: "/clips",
    icon: <TiArrowForward />,
  },
  {
    label: "Behind the Scenes",
    link: "/behind_the_scenes",
    icon: <TiArrowForward />,
  },
  {
    label: "Bloopers",
    link: "/bloopers",
    icon: <TiArrowForward />,
  },
  {
    label: "Featurettes",
    link: "/featurettes",
    icon: <TiArrowForward />,
  },
];

export const personEditList = [
  {
    label: "Primary Details",
    link: "/details",
    icon: <TiArrowForward />,
  },
  {
    label: "Cover Image",
    link: "/cover",
    icon: <TiArrowForward />,
  },
  {
    label: "Cast",
    link: "/cast",
    icon: <TiArrowForward />,
  },
  {
    label: "Crew",
    link: "/crew",
    icon: <TiArrowForward />,
  },
  {
    label: "External Links",
    link: "/external_link",
    icon: <TiArrowForward />,
  },
];

export const detailsList = [
  {
    label: "Announced",
    value: "Announced",
  },
  {
    label: "Unconfirmed",
    value: "Unconfirmed",
  },
  {
    label: "Not Yet Aired",
    value: "Not Yet Aired",
  },
  {
    label: "Airing",
    value: "Airing",
  },
  {
    label: "Finished Airing",
    value: "Finished Airing",
  },
  {
    label: "Cancelled",
    value: "Cancelled",
  },
];

export const countryDetails = [
  {
    label: "China",
    value: "China",
  },
  {
    label: "Hong Kong",
    value: "Hong Kong",
  },
  {
    label: "South Korean",
    value: "South Korean",
  },
  {
    label: "Japan",
    value: "Japan",
  },
  {
    label: "Taiwan",
    value: "Taiwan",
  },
  {
    label: "Philippines",
    value: "Philippines",
  },
  {
    label: "Thailand",
    value: "Thailand",
  },
];

export const contentTypeDetail = [
  {
    label: "Drama",
    value: "Drama",
  },
  {
    label: "Drama Special",
    value: "Drama Special",
  },
  {
    label: "Movie",
    value: "Movie",
  },
  {
    label: "TV Show",
    value: "TV Show",
  },
];

export const contentRatingDetail = [
  {
    label: "Not Yet Rating",
    value: "Not Yet Rating",
  },
  {
    label: "G - All Ages",
    value: "G - All Ages",
  },
  {
    label: "13+- Teens 13 or older",
    value: "13+- Teens 13 or older",
  },
  {
    label: "15+- Teens 15 or older",
    value: "15+- Teens 15 or older",
  },
  {
    label: "18+ Restricted (violence & profanity)",
    value: "18+ Restricted (violence & profanity)",
  },
  {
    label: "R - Restricted Screening (nudity & violence)",
    value: "R - Restricted Screening (nudity & violence)",
  },
];

export const storyFormat = [
  {
    label: "Adaptation",
    value: "Adaptation",
  },
  {
    label: "Compilation",
    value: "Compilation",
  },
  {
    label: "Original Story",
    value: "Original Story",
  },
  {
    label: "Parent Story",
    value: "Parent Story",
  },
  {
    label: "Prequel",
    value: "Prequel",
  },
  {
    label: "Remake",
    value: "Remake",
  },
  {
    label: "Sequel",
    value: "Sequel",
  },
  {
    label: "Shared Universe",
    value: "Shared Universe",
  },
  {
    label: "Side Story",
    value: "Side Story",
  },
  {
    label: "Spinoff",
    value: "Spinoff",
  },
];

export const castRole = [
  {
    label: "Main Role",
    value: "Main Role",
  },
  {
    label: "Support Role",
    value: "Support Role",
  },
  {
    label: "Guest Role",
    value: "Guest Role",
  },
  {
    label: "Extras Role",
    value: "Extras Role",
  },
  {
    label: "Voice Actor",
    value: "Voice Actor",
  },
  {
    label: "Bit Part",
    value: "Bit Part",
  },
  {
    label: "Unknown",
    value: "Unknown",
  },
  {
    label: "Cameo",
    value: "Cameo",
  },
];

export const personTVShowRole = [
  {
    label: "Main Host",
    value: "Main Host",
  },
  {
    label: "Regular Member",
    value: "Regular Member",
  },
  {
    label: "Guest",
    value: "Guest",
  },
];

export const crewRole = [
  {
    label: "24 Frame Playback",
    value: "24 Frame Playback",
  },
  {
    label: "2D Artist",
    value: "2D Artist",
  },
  {
    label: "2D Sequence Supervisor",
    value: "2D Sequence Supervisor",
  },
  {
    label: "2D Supervisor",
    value: "2D Supervisor",
  },
  {
    label: "3D Animator",
    value: "3D Animator",
  },
  {
    label: "3D Artist",
    value: "3D Artist",
  },
  {
    label: "3D Coordinator",
    value: "3D Coordinator",
  },
  {
    label: "3D Digital Colorist",
    value: "3D Digital Colorist",
  },
  {
    label: "3D Director",
    value: "3D Director",
  },
  {
    label: "3D Editor",
    value: "3D Editor",
  },
  {
    label: "3D Generalist",
    value: "3D Generalist",
  },
  {
    label: "3D Sequence Supervisor",
    value: "3D Sequence Supervisor",
  },
  {
    label: "3D Supervisor",
    value: "3D Supervisor",
  },
  {
    label: "3D Tracking Layout",
    value: "3D Tracking Layout",
  },
  {
    label: "A Camera Operator",
    value: "A Camera Operator",
  },
  {
    label: "Accountant",
    value: "Accountant",
  },
  {
    label: "Accounting Clerk Assistant",
    value: "Accounting Clerk Assistant",
  },
  {
    label: "Accounting Supervisor",
    value: "Accounting Supervisor",
  },
  {
    label: "Accounting Trainee",
    value: "Accounting Trainee",
  },
  {
    label: "Acting Double",
    value: "Acting Double",
  },
  {
    label: "Action Director",
    value: "Action Director",
  },
  {
    label: "Actor's Assistant",
    value: "Actor's Assistant",
  },
  {
    label: "Adaptation",
    value: "Adaptation",
  },
  {
    label: "Additional Camera",
    value: "Additional Camera",
  },
  {
    label: "Additional Casting",
    value: "Additional Casting",
  },
  {
    label: "Additional Colorist",
    value: "Additional Colorist",
  },
  {
    label: "Additional Construction",
    value: "Additional Construction",
  },
  {
    label: "Additional Construction Grip",
    value: "Additional Construction Grip",
  },
  {
    label: "Additional Dialogue",
    value: "Additional Dialogue",
  },
  {
    label: "Additional Director of Photography",
    value: "Additional Director of Photography",
  },
  {
    label: "Additional Editing",
    value: "Additional Editing",
  },
  {
    label: "Additional Editor",
    value: "Additional Editor",
  },
  {
    label: "Additional Editorial Assistant",
    value: "Additional Editorial Assistant",
  },
  {
    label: "Additional Effects Development",
    value: "Additional Effects Development",
  },
  {
    label: "Additional First Assistant Camera",
    value: "Additional First Assistant Camera",
  },
  {
    label: "Additional Gaffer",
    value: "Additional Gaffer",
  },
  {
    label: "Additional Grip",
    value: "Additional Grip",
  },
  {
    label: "Additional Hairstylist",
    value: "Additional Hairstylist",
  },
  {
    label: "Additional Key Construction Grip",
    value: "Additional Key Construction Grip",
  },
  {
    label: "Additional Key Grip",
    value: "Additional Key Grip",
  },
  {
    label: "Additional Lighting Technician",
    value: "Additional Lighting Technician",
  },
  {
    label: "Additional Music",
    value: "Additional Music",
  },
  {
    label: "Additional Music Supervisor",
    value: "Additional Music Supervisor",
  },
  {
    label: "Additional Photography",
    value: "Additional Photography",
  },
  {
    label: "Additional Post-Production Supervisor",
    value: "Additional Post-Production Supervisor",
  },
  {
    label: "Additional Production Assistant",
    value: "Additional Production Assistant",
  },
  {
    label: "Additional Production Sound Mixer",
    value: "Additional Production Sound Mixer",
  },
  {
    label: "Additional Script Supervisor",
    value: "Additional Script Supervisor",
  },
  {
    label: "Additional Second Assistant Camera",
    value: "Additional Second Assistant Camera",
  },
  {
    label: "Additional Second Assistant Director",
    value: "Additional Second Assistant Director",
  },
  {
    label: "Additional Set Dresser",
    value: "Additional Set Dresser",
  },
  {
    label: "Additional Set Photographer",
    value: "Additional Set Photographer",
  },
  {
    label: "Additional Sound Re-Recording Mixer",
    value: "Additional Sound Re-Recording Mixer",
  },
  {
    label: "Additional Sound Re-Recordist",
    value: "Additional Sound Re-Recordist",
  },
  {
    label: "Additional Soundtrack",
    value: "Additional Soundtrack",
  },
  {
    label: "Additional Still Photographer",
    value: "Additional Still Photographer",
  },
  {
    label: "Additional Storyboarding",
    value: "Additional Storyboarding",
  },
  {
    label: "Additional Third Assistant Director",
    value: "Additional Third Assistant Director",
  },
  {
    label: "Additional Underwater Photography",
    value: "Additional Underwater Photography",
  },
  {
    label: "Additional Visual Effects",
    value: "Additional Visual Effects",
  },
  {
    label: "Additional Visual Effects",
    value: "Additional Visual Effects",
  },
  {
    label: "Additional Wardrobe Assistant",
    value: "Additional Wardrobe Assistant",
  },
  {
    label: "Additional Writing",
    value: "Additional Writing",
  },
  {
    label: "Administration",
    value: "Administration",
  },
  {
    label: "Administrative Assistant",
    value: "Administrative Assistant",
  },
  {
    label: "ADR & Dubbing",
    value: "ADR & Dubbing",
  },
  {
    label: "ADR Coordinator",
    value: "ADR Coordinator",
  },
  {
    label: "ADR Editor",
    value: "ADR Editor",
  },
  {
    label: "ADR Engineer",
    value: "ADR Engineer",
  },
  {
    label: "ADR Mixer",
    value: "ADR Mixer",
  },
  {
    label: "ADR Post Producer",
    value: "ADR Post Producer",
  },
  {
    label: "ADR Recording Engineer",
    value: "ADR Recording Engineer",
  },
  {
    label: "ADR Recordist",
    value: "ADR Recordist",
  },
  {
    label: "ADR Supervisor",
    value: "ADR Supervisor",
  },
  {
    label: "ADR Voice Casting",
    value: "ADR Voice Casting",
  },
  {
    label: "Aerial Camera",
    value: "Aerial Camera",
  },
  {
    label: "Aerial Camera Technician",
    value: "Aerial Camera Technician",
  },
  {
    label: "Aerial Coordinator",
    value: "Aerial Coordinator",
  },
  {
    label: "Aerial Director of Photography",
    value: "Aerial Director of Photography",
  },
  {
    label: "Ager/Dyer",
    value: "Ager/Dyer",
  },
  {
    label: "Animal Coordinator",
    value: "Animal Coordinator",
  },
  {
    label: "Animal Wrangler",
    value: "Animal Wrangler",
  },
  {
    label: "Animation",
    value: "Animation",
  },
  {
    label: "Animation Coordinator",
    value: "Animation Coordinator",
  },
  {
    label: "Animation Department",
    value: "Animation Department",
  },
  {
    label: "Animation Department Coordinator",
    value: "Animation Department Coordinator",
  },
  {
    label: "Animation Director",
    value: "Animation Director",
  },
  {
    label: "Animation Fix Coordinator",
    value: "Animation Fix Coordinator",
  },
  {
    label: "Animation Manager",
    value: "Animation Manager",
  },
  {
    label: "Animation Production Assistant",
    value: "Animation Production Assistant",
  },
  {
    label: "Animation Supervisor",
    value: "Animation Supervisor",
  },
  {
    label: "Animation Technical Director",
    value: "Animation Technical Director",
  },
  {
    label: "Animatronic and Prosthetic Effects",
    value: "Animatronic and Prosthetic Effects",
  },
  {
    label: "Animatronics Designer",
    value: "Animatronics Designer",
  },
  {
    label: "Animatronics Supervisor",
    value: "Animatronics Supervisor",
  },
  {
    label: "Apprentice Sound Editor",
    value: "Apprentice Sound Editor",
  },
  {
    label: "Archival Footage Coordinator",
    value: "Archival Footage Coordinator",
  },
  {
    label: "Archival Footage Research",
    value: "Archival Footage Research",
  },
  {
    label: "Armorer",
    value: "Armorer",
  },
  {
    label: "Armory Coordinator",
    value: "Armory Coordinator",
  },
  {
    label: "Art Department Assistant",
    value: "Art Department Assistant",
  },
  {
    label: "Art Department Coordinator",
    value: "Art Department Coordinator",
  },
  {
    label: "Art Department Manager",
    value: "Art Department Manager",
  },
  {
    label: "Art Department Production Assistant",
    value: "Art Department Production Assistant",
  },
  {
    label: "Art Department Trainee",
    value: "Art Department Trainee",
  },
  {
    label: "Art Designer",
    value: "Art Designer",
  },
  {
    label: "Art Direction",
    value: "Art Direction",
  },
  {
    label: "Art Direction Intern",
    value: "Art Direction Intern",
  },
  {
    label: "Art Director",
    value: "Art Director",
  },
  {
    label: "Art Producer",
    value: "Art Producer",
  },
  {
    label: "Assistant Accountant",
    value: "Assistant Accountant",
  },
  {
    label: "Assistant Art Director",
    value: "Assistant Art Director",
  },
  {
    label: "Assistant Camera",
    value: "Assistant Camera",
  },
  {
    label: "Assistant Chef",
    value: "Assistant Chef",
  },
  {
    label: "Assistant Chief Lighting Technician",
    value: "Assistant Chief Lighting Technician",
  },
  {
    label: "Assistant Costume Designer",
    value: "Assistant Costume Designer",
  },
  {
    label: "Assistant Craft Service",
    value: "Assistant Craft Service",
  },
  {
    label: "Assistant Decorator",
    value: "Assistant Decorator",
  },
  {
    label: "Assistant Dialogue Editor",
    value: "Assistant Dialogue Editor",
  },
  {
    label: "Assistant Director",
    value: "Assistant Director",
  },
  {
    label: "Assistant Director of Photography",
    value: "Assistant Director of Photography",
  },
  {
    label: "Assistant Director Trainee",
    value: "Assistant Director Trainee",
  },
  {
    label: "Assistant Editor",
    value: "Assistant Editor",
  },
  {
    label: "Assistant Electrician",
    value: "Assistant Electrician",
  },
  {
    label: "Assistant Extras Casting",
    value: "Assistant Extras Casting",
  },
  {
    label: "Assistant Foley Artist",
    value: "Assistant Foley Artist",
  },
  {
    label: "Assistant Gaffer",
    value: "Assistant Gaffer",
  },
  {
    label: "Assistant Grip",
    value: "Assistant Grip",
  },
  {
    label: "Assistant Hairdresser",
    value: "Assistant Hairdresser",
  },
  {
    label: "Assistant Hairstylist",
    value: "Assistant Hairstylist",
  },
  {
    label: "Assistant Location Manager",
    value: "Assistant Location Manager",
  },
  {
    label: "Assistant Makeup Artist",
    value: "Assistant Makeup Artist",
  },
  {
    label: "Assistant Music Supervisor",
    value: "Assistant Music Supervisor",
  },
  {
    label: "Assistant Picture Car Coordinator",
    value: "Assistant Picture Car Coordinator",
  },
  {
    label: "Assistant Picture Editor",
    value: "Assistant Picture Editor",
  },
  {
    label: "Assistant Production Coordinator",
    value: "Assistant Production Coordinator",
  },
  {
    label: "Assistant Production Design",
    value: "Assistant Production Design",
  },
  {
    label: "Assistant Production Manager",
    value: "Assistant Production Manager",
  },
  {
    label: "Assistant Property Master",
    value: "Assistant Property Master",
  },
  {
    label: "Assistant Script",
    value: "Assistant Script",
  },
  {
    label: "Assistant Set Decoration",
    value: "Assistant Set Decoration",
  },
  {
    label: "Assistant Set Decoration Buyer",
    value: "Assistant Set Decoration Buyer",
  },
  {
    label: "Assistant Set Designer",
    value: "Assistant Set Designer",
  },
  {
    label: "Assistant Set Dresser",
    value: "Assistant Set Dresser",
  },
  {
    label: "Assistant Set Propsman",
    value: "Assistant Set Propsman",
  },
  {
    label: "Assistant Sound Designer",
    value: "Assistant Sound Designer",
  },
  {
    label: "Assistant Sound Editor",
    value: "Assistant Sound Editor",
  },
  {
    label: "Assistant Sound Engineer",
    value: "Assistant Sound Engineer",
  },
  {
    label: "Assistant Unit Manager",
    value: "Assistant Unit Manager",
  },
  {
    label: "Assistant Vehicles Coordinator",
    value: "Assistant Vehicles Coordinator",
  },
  {
    label: "Associate Choreographer",
    value: "Associate Choreographer",
  },
  {
    label: "Associate Editor",
    value: "Associate Editor",
  },
  {
    label: "Associate Producer",
    value: "Associate Producer",
  },
  {
    label: "Atmos Editor",
    value: "Atmos Editor",
  },
  {
    label: "Attorney",
    value: "Attorney",
  },
  {
    label: "Audio Post Coordinator",
    value: "Audio Post Coordinator",
  },
  {
    label: "Author",
    value: "Author",
  },
  {
    label: "B Camera Operator",
    value: "B Camera Operator",
  },
  {
    label: "Back-up Set Production Assistant",
    value: "Back-up Set Production Assistant",
  },
  {
    label: "Back-up Truck Production Assistant",
    value: "Back-up Truck Production Assistant",
  },
  {
    label: "Background Casting Director",
    value: "Background Casting Director",
  },
  {
    label: "Background Designer",
    value: "Background Designer",
  },
  {
    label: "Base Camp Operator",
    value: "Base Camp Operator",
  },
  {
    label: "Battle Motion Coordinator",
    value: "Battle Motion Coordinator",
  },

  {
    label: "Best Boy Electric",
    value: "Best Boy Electric",
  },
  {
    label: "Best Boy Electrician",
    value: "Best Boy Electrician",
  },
  {
    label: "Best Boy Grip",
    value: "Best Boy Grip",
  },
  {
    label: "Best Boy Lighting Technician",
    value: "Best Boy Lighting Technician",
  },
  {
    label: "Book",
    value: "Book",
  },
  {
    label: "Boom Operator",
    value: "Boom Operator",
  },
  {
    label: "BTS Footage",
    value: "BTS Footage",
  },
  {
    label: "BTS Photographer",
    value: "BTS Photographer",
  },
  {
    label: "BTS Videographer",
    value: "BTS Videographer",
  },
  {
    label: "Business Affairs Coordinator",
    value: "Business Affairs Coordinator",
  },
  {
    label: "C Camera Operator",
    value: "C Camera Operator",
  },
  {
    label: "Cableman",
    value: "Cableman",
  },
  {
    label: "Cameo",
    value: "Cameo",
  },
  {
    label: "Camera Car",
    value: "Camera Car",
  },
  {
    label: "Camera Department Manager",
    value: "Camera Department Manager",
  },
  {
    label: "Camera Department Production Assistant",
    value: "Camera Department Production Assistant",
  },
  {
    label: "Camera Intern",
    value: "Camera Intern",
  },
  {
    label: "Camera Loader",
    value: "Camera Loader",
  },
  {
    label: "Camera Operator",
    value: "Camera Operator",
  },
  {
    label: "Camera Production Assistant",
    value: "Camera Production Assistant",
  },
  {
    label: "Camera Supervisor",
    value: "Camera Supervisor",
  },
  {
    label: "Camera Technician",
    value: "Camera Technician",
  },
  {
    label: "Camera Trainee",
    value: "Camera Trainee",
  },
  {
    label: "Camera Truck",
    value: "Camera Truck",
  },
  {
    label: "Captain Driver",
    value: "Captain Driver",
  },
  {
    label: "Carpenter",
    value: "Carpenter",
  },
  {
    label: "Cast Driver",
    value: "Cast Driver",
  },
  {
    label: "Casting",
    value: "Casting",
  },
  {
    label: "Casting Assistant",
    value: "Casting Assistant",
  },
  {
    label: "Casting Associate",
    value: "Casting Associate",
  },
  {
    label: "Casting Consultant",
    value: "Casting Consultant",
  },
  {
    label: "Casting Coordinator",
    value: "Casting Coordinator",
  },
  {
    label: "Casting Director",
    value: "Casting Director",
  },
  {
    label: "Casting Producer",
    value: "Casting Producer",
  },
  {
    label: "Casting Researcher",
    value: "Casting Researcher",
  },
  {
    label: "Catering",
    value: "Catering",
  },
  {
    label: "Catering Head Chef",
    value: "Catering Head Chef",
  },
  {
    label: "CG Animator",
    value: "CG Animator",
  },
  {
    label: "CG Artist",
    value: "CG Artist",
  },
  {
    label: "CG Engineer",
    value: "CG Engineer",
  },
  {
    label: "CG Painter",
    value: "CG Painter",
  },
  {
    label: "CG Supervisor",
    value: "CG Supervisor",
  },
  {
    label: "CGI Director",
    value: "CGI Director",
  },
  {
    label: "CGI Supervisor",
    value: "CGI Supervisor",
  },
  {
    label: "Charperone",
    value: "Charperone",
  },
  {
    label: "Chaperone Tutor",
    value: "Chaperone Tutor",
  },
  {
    label: "Character Designer",
    value: "Character Designer",
  },
  {
    label: "Character Modelling Supervisor",
    value: "Character Modelling Supervisor",
  },
  {
    label: "Character Technical Supervisor",
    value: "Character Technical Supervisor",
  },
  {
    label: "Chracters",
    value: "Chracters",
  },
  {
    label: "Charge Scenic Artist",
    value: "Charge Scenic Artist",
  },
  {
    label: "Chef",
    value: "Chef",
  },
  {
    label: "Chief Lighting Technician",
    value: "Chief Lighting Technician",
  },
  {
    label: "Chief Producer",
    value: "Chief Producer",
  },
  {
    label: "Chief Technician / Stop-Motion Expert",
    value: "Chief Technician / Stop-Motion Expert",
  },
  {
    label: "Child Wrangler",
    value: "Child Wrangler",
  },
  {
    label: "Choreographer",
    value: "Choreographer",
  },
  {
    label: "Cinematography",
    value: "Cinematography",
  },
  {
    label: "Clapper Loader",
    value: "Clapper Loader",
  },
  {
    label: "Clearances Consultant",
    value: "Clearances Consultant",
  },
  {
    label: "Clearances Coordinator",
    value: "Clearances Coordinator",
  },
  {
    label: "Cloth Setup",
    value: "Cloth Setup",
  },
  {
    label: "Co-Art Director",
    value: "Co-Art Director",
  },
  {
    label: "Co-Costume Designer",
    value: "Co-Costume Designer",
  },
  {
    label: "Co-Director",
    value: "Co-Director",
  },
  {
    label: "Co-Editor",
    value: "Co-Editor",
  },
  {
    label: "Co-Executive Producer",
    value: "Co-Executive Producer",
  },
  {
    label: "Co-Producer",
    value: "Co-Producer",
  },
  {
    label: "Co-Writer",
    value: "Co-Writer",
  },
  {
    label: "Color Asssistant",
    value: "Color Asssistant",
  },
  {
    label: "Color Designer",
    value: "Color Designer",
  },
  {
    label: "Color Grading",
    value: "Color Grading",
  },
  {
    label: "Color Timer",
    value: "Color Timer",
  },
  {
    label: "Colorist",
    value: "Colorist",
  },
  {
    label: "Comic Book",
    value: "Comic Book",
  },
  {
    label: "Commissioning Editor",
    value: "Commissioning Editor",
  },
  {
    label: "Composer",
    value: "Composer",
  },
  {
    label: "Compositing Artist",
    value: "Compositing Artist",
  },
  {
    label: "Compositing Lead",
    value: "Compositing Lead",
  },
  {
    label: "Compositing Supervisor",
    value: "Compositing Supervisor",
  },
  {
    label: "Compositor",
    value: "Compositor",
  },
  {
    label: "Concept Artist",
    value: "Concept Artist",
  },
  {
    label: "Conceptual Design",
    value: "Conceptual Design",
  },
  {
    label: "Conceptual Illustrator",
    value: "Conceptual Illustrator",
  },
  {
    label: "Conductor",
    value: "Conductor",
  },
  {
    label: "Construction Buyer",
    value: "Construction Buyer",
  },
  {
    label: "Construction Coordinator",
    value: "Construction Coordinator",
  },
  {
    label: "Construction Foreman",
    value: "Construction Foreman",
  },
  {
    label: "Construction Grip",
    value: "Construction Grip",
  },
  {
    label: "Construction Manager",
    value: "Construction Manager",
  },
  {
    label: "Consulting Accountant",
    value: "Consulting Accountant",
  },
  {
    label: "Consulting Editor",
    value: "Consulting Editor",
  },
  {
    label: "Consulting Producer",
    value: "Consulting Producer",
  },
  {
    label: "Contact Lens Designer",
    value: "Contact Lens Designer",
  },
  {
    label: "Contact Lens Painter",
    value: "Contact Lens Painter",
  },
  {
    label: "Contact Lens Technician",
    value: "Contact Lens Technician",
  },
  {
    label: "Continuity",
    value: "Continuity",
  },
  {
    label: "Contract Manager",
    value: "Contract Manager",
  },
  {
    label: "Controller",
    value: "Controller",
  },
  {
    label: "Coordinating Producer",
    value: "Coordinating Producer",
  },
  {
    label: "Costume Assistant",
    value: "Costume Assistant",
  },
  {
    label: "Costume Consultant",
    value: "Costume Consultant",
  },
  {
    label: "Costume Coordinator",
    value: "Costume Coordinator",
  },
  {
    label: "Costume Designer",
    value: "Costume Designer",
  },
  {
    label: "Costume Illustrator",
    value: "Costume Illustrator",
  },
  {
    label: "Costume Mistress",
    value: "Costume Mistress",
  },
  {
    label: "Costume Set Supervisor",
    value: "Costume Set Supervisor",
  },
  {
    label: "Costumer",
    value: "Costumer",
  },
  {
    label: "Craft Service",
    value: "Craft Service",
  },
  {
    label: "Creative Consultant",
    value: "Creative Consultant",
  },
  {
    label: "Creative Director",
    value: "Creative Director",
  },
  {
    label: "Creative Producer",
    value: "Creative Producer",
  },
  {
    label: "Creator",
    value: "Creator",
  },
  {
    label: "Creature Design",
    value: "Creature Design",
  },
  {
    label: "Creature Effects Technical Director",
    value: "Creature Effects Technical Director",
  },
  {
    label: "Creature Technical Director",
    value: "Creature Technical Director",
  },
  {
    label: "Crowd Assistant Director",
    value: "Crowd Assistant Director",
  },
  {
    label: "Cyber Scanning Supervisor",
    value: "Cyber Scanning Supervisor",
  },
  {
    label: "D Camera Operator",
    value: "D Camera Operator",
  },
  {
    label: "Dailies Manager",
    value: "Dailies Manager",
  },
  {
    label: "Dailies Operator",
    value: "Dailies Operator",
  },
  {
    label: "Dailies Technician",
    value: "Dailies Technician",
  },
  {
    label: "Daily Electrics",
    value: "Daily Electrics",
  },
  {
    label: "Digital Color Timer",
    value: "Digital Color Timer",
  },
  {
    label: "Daily Grip",
    value: "Daily Grip",
  },
  {
    label: "Daily Makeup & Hair",
    value: "Daily Makeup & Hair",
  },
  {
    label: "Daily Wardrobe",
    value: "Daily Wardrobe",
  },
  {
    label: "Data Management Technician",
    value: "Data Management Technician",
  },
  {
    label: "Data Wrangler",
    value: "Data Wrangler",
  },
  {
    label: "Decorator",
    value: "Decorator",
  },
  {
    label: "Director",
    value: "Director",
  },
  {
    label: "Delegated Producer",
    value: "Delegated Producer",
  },
  {
    label: "Development Producer",
    value: "Development Producer",
  },
  {
    label: "Director of Previsualization",
    value: "Director of Previsualization",
  },
  {
    label: "Dressing Prop",
    value: "Dressing Prop",
  },
  {
    label: "Dialogue Coach",
    value: "Dialogue Coach",
  },
  {
    label: "Digital Colorist",
    value: "Digital Colorist",
  },
  {
    label: "Digital Conform Editor",
    value: "Digital Conform Editor",
  },
  {
    label: "Digital Intermediate Assistant",
    value: "Digital Intermediate Assistant",
  },
  {
    label: "Digital Intermediate Colorist",
    value: "Digital Intermediate Colorist",
  },
  {
    label: "Digital Intermediate Data Wrangler",
    value: "Digital Intermediate Data Wrangler",
  },
  {
    label: "Digital Intermediate Editor",
    value: "Digital Intermediate Editor",
  },
  {
    label: "Digital Intermediate Producer",
    value: "Digital Intermediate Producer",
  },
  {
    label: "Digital Imaging Technician",
    value: "Digital Imaging Technician",
  },
  {
    label: "Digital Foley Artist",
    value: "Digital Foley Artist",
  },
  {
    label: "Digital Film Recording",
    value: "Digital Film Recording",
  },
  {
    label: "Digital Storyboarding",
    value: "Digital Storyboarding",
  },
  {
    label: "Digital Supervisor",
    value: "Digital Supervisor",
  },
  {
    label: "Director of Communications",
    value: "Director of Communications",
  },
  {
    label: "Director of Operations",
    value: "Director of Operations",
  },
  {
    label: "Drone Cinematographer",
    value: "Drone Cinematographer",
  },
  {
    label: "Drone Pilot",
    value: "Drone Pilot",
  },
  {
    label: "Dubbing Mixer",
    value: "Dubbing Mixer",
  },
  {
    label: "Editor",
    value: "Editor",
  },
  {
    label: "Editorial Consultant",
    value: "Editorial Consultant",
  },
  {
    label: "Editorial Coordinator",
    value: "Editorial Coordinator",
  },
  {
    label: "Editorial Manager",
    value: "Editorial Manager",
  },
  {
    label: "Editorial Production Assistant",
    value: "Editorial Production Assistant",
  },
  {
    label: "Editorial Staff",
    value: "Editorial Staff",
  },
  {
    label: "Editorial Supervisor",
    value: "Editorial Supervisor",
  },
  {
    label: "Effects Supervisor",
    value: "Effects Supervisor",
  },
  {
    label: "Electrician",
    value: "Electrician",
  },
  {
    label: "Epk Director",
    value: "Epk Director",
  },
  {
    label: "EPK Editor",
    value: "EPK Editor",
  },
  {
    label: "Epk Producer",
    value: "Epk Producer",
  },
  {
    label: "Executive Assistant",
    value: "Executive Assistant",
  },
  {
    label: "Executive Co-Producer",
    value: "Executive Co-Producer",
  },
  {
    label: "Executive Producer's Assistant",
    value: "Executive Producer's Assistant",
  },
  {
    label: "Extras Dresser",
    value: "Extras Dresser",
  },
  {
    label: "Extras Makeup Artist",
    value: "Extras Makeup Artist",
  },
  {
    label: "Extras Casting",
    value: "Extras Casting",
  },
  {
    label: "Extras Casting Assistant",
    value: "Extras Casting Assistant",
  },
  {
    label: "Extras Casting Coordinator",
    value: "Extras Casting Coordinator",
  },
  {
    label: "Facial Setup Artist",
    value: "Facial Setup Artist",
  },
  {
    label: "Feature Finishing Producer",
    value: "Feature Finishing Producer",
  },
  {
    label: "Field Director",
    value: "Field Director",
  },
  {
    label: "Finishing Producer",
    value: "Finishing Producer",
  },
  {
    label: "File Footage",
    value: "File Footage",
  },
  {
    label: "Film Processor",
    value: "Film Processor",
  },
  {
    label: "First Assistant 'A' Camera",
    value: "First Assistant 'A' Camera",
  },
  {
    label: "First Assistant 'B' Camera",
    value: "First Assistant 'B' Camera",
  },
  {
    label: "First Assistant 'C' Camera",
    value: "First Assistant 'C' Camera",
  },
  {
    label: "First Assistant 'D' Camera",
    value: "First Assistant 'D' Camera",
  },
  {
    label: "First Assistant Accountant",
    value: "First Assistant Accountant",
  },
  {
    label: "First Assistant Art Direction",
    value: "First Assistant Art Direction",
  },
  {
    label: "First Assistant Camera",
    value: "First Assistant Camera",
  },
  {
    label: "First Assistant Director",
    value: "First Assistant Director",
  },
  {
    label: "First Assistant Director (Prep)",
    value: "First Assistant Director (Prep)",
  },
  {
    label: "First Assistant Director Trainee",
    value: "First Assistant Director Trainee",
  },
  {
    label: "First Assistant Hairstylist",
    value: "First Assistant Hairstylist",
  },
  {
    label: "First Assistant Makeup Artist",
    value: "First Assistant Makeup Artist",
  },
  {
    label: "First Assistant Picture Editor",
    value: "First Assistant Picture Editor",
  },
  {
    label: "First Assistant Production Coordinator",
    value: "First Assistant Production Coordinator",
  },
  {
    label: "First Assistant Property Master",
    value: "First Assistant Property Master",
  },
  {
    label: "First Company Grip",
    value: "First Company Grip",
  },
  {
    label: "Floor Runner",
    value: "Floor Runner",
  },
  {
    label: "Focus Puller",
    value: "Focus Puller",
  },
  {
    label: "Foley Artist",
    value: "Foley Artist",
  },
  {
    label: "Foley Mixer",
    value: "Foley Mixer",
  },
  {
    label: "Foley Recording Engineer",
    value: "Foley Recording Engineer",
  },
  {
    label: "Foley Recordist",
    value: "Foley Recordist",
  },
  {
    label: "Foley Supervisor",
    value: "Foley Supervisor",
  },
  {
    label: "General Manager",
    value: "General Manager",
  },
  {
    label: "Generalist",
    value: "Generalist",
  },
  {
    label: "Generator Operater",
    value: "Generator Operater",
  },
  {
    label: "Graphic Designer",
    value: "Graphic Designer",
  },
  {
    label: "Graphic Novel",
    value: "Graphic Novel",
  },
  {
    label: "Graphic Novel Illustrator",
    value: "Graphic Novel Illustrator",
  },
  {
    label: "Grip",
    value: "Grip",
  },
  {
    label: "Grip Production Assistant",
    value: "Grip Production Assistant",
  },
  {
    label: "Hair Assistant",
    value: "Hair Assistant",
  },
  {
    label: "Hair Department Head",
    value: "Hair Department Head",
  },
  {
    label: "Hair Designer",
    value: "Hair Designer",
  },
  {
    label: "Hair Setup",
    value: "Hair Setup",
  },
  {
    label: "Hair Supervisor",
    value: "Hair Supervisor",
  },
  {
    label: "Hairdresser",
    value: "Hairdresser",
  },
  {
    label: "Hairstylist",
    value: "Hairstylist",
  },
  {
    label: "Head Carpenter",
    value: "Head Carpenter",
  },
  {
    label: "Head Decorator",
    value: "Head Decorator",
  },
  {
    label: "Head Designer",
    value: "Head Designer",
  },
  {
    label: "Head Driver",
    value: "Head Driver",
  },
  {
    label: "Head Greensman",
    value: "Head Greensman",
  },
  {
    label: "Head of Animation",
    value: "Head of Animation",
  },
  {
    label: "Head of Layout",
    value: "Head of Layout",
  },
  {
    label: "Head of Production",
    value: "Head of Production",
  },
  {
    label: "Head of Programming",
    value: "Head of Programming",
  },
  {
    label: "Head of Research",
    value: "Head of Research",
  },
  {
    label: "Head of Story",
    value: "Head of Story",
  },
  {
    label: "Health and Safety",
    value: "Health and Safety",
  },
  {
    label: "Helicopter and Camera",
    value: "Helicopter and Camera",
  },
  {
    label: "Helping Hand",
    value: "Helping Hand",
  },
  {
    label: "Human Resources",
    value: "Human Resources",
  },
  {
    label: "I/O Manager",
    value: "I/O Manager",
  },
  {
    label: "I/O Supervisor",
    value: "I/O Supervisor",
  },
  {
    label: "Idea",
    value: "Idea",
  },
  {
    label: "Imaging Science",
    value: "Imaging Science",
  },
  {
    label: "In Memory Of",
    value: "In Memory Of",
  },
  {
    label: "Information Systems Manager",
    value: "Information Systems Manager",
  },
  {
    label: "Insert Unit Director",
    value: "Insert Unit Director",
  },
  {
    label: "Insert Unit First Assistant Director",
    value: "Insert Unit First Assistant Director",
  },
  {
    label: "Insert Unit Location Manager",
    value: "Insert Unit Location Manager",
  },
  {
    label: "Interactive Manager",
    value: "Interactive Manager",
  },
  {
    label: "Interior Designer",
    value: "Interior Designer",
  },
  {
    label: "Intern",
    value: "Intern",
  },
  {
    label: "Jimmy Jib Operator",
    value: "Jimmy Jib Operator",
  },
  {
    label: "Joint ADR Mixer",
    value: "Joint ADR Mixer",
  },
  {
    label: "Junior Story Editor",
    value: "Junior Story Editor",
  },
  {
    label: "Key Accountant",
    value: "Key Accountant",
  },
  {
    label: "Key Animation",
    value: "Key Animation",
  },
  {
    label: "Key Art Production Assistant",
    value: "Key Art Production Assistant",
  },
  {
    label: "Key Carpenter",
    value: "Key Carpenter",
  },
  {
    label: "Key Construction Grip",
    value: "Key Construction Grip",
  },
  {
    label: "Key Costumer",
    value: "Key Costumer",
  },
  {
    label: "Key Dresser",
    value: "Key Dresser",
  },
  {
    label: "Key Grip",
    value: "Key Grip",
  },
  {
    label: "Key Grip Production Assistant",
    value: "Key Grip Production Assistant",
  },
  {
    label: "Key Hair Stylist",
    value: "Key Hair Stylist",
  },
  {
    label: "Key Hairdresser",
    value: "Key Hairdresser",
  },
  {
    label: "Key Makeup Artist",
    value: "Key Makeup Artist",
  },
  {
    label: "Key Production Assistant",
    value: "Key Production Assistant",
  },
  {
    label: "Key Rigging Grip",
    value: "Key Rigging Grip",
  },
  {
    label: "Key Scenic Artist",
    value: "Key Scenic Artist",
  },
  {
    label: "Key Set Costumer",
    value: "Key Set Costumer",
  },
  {
    label: "Key Set Painter",
    value: "Key Set Painter",
  },
  {
    label: "Key Set Production Assistant",
    value: "Key Set Production Assistant",
  },
  {
    label: "Key Special Effects",
    value: "Key Special Effects",
  },
  {
    label: "Keyboard Programmer",
    value: "Keyboard Programmer",
  },
  { label: "Layout", value: "Layout" },
  { label: "Layout Supervisor", value: "Layout Supervisor" },
  { label: "Lead Animator", value: "Lead Animator" },
  { label: "Lead Character Designer", value: "Lead Character Designer" },
  { label: "Lead Costumer", value: "Lead Costumer" },
  { label: "Lead Creature Designer", value: "Lead Creature Designer" },
  { label: "Lead Editor", value: "Lead Editor" },
  { label: "Lead Painter", value: "Lead Painter" },
  { label: "Lead Set Dresser", value: "Lead Set Dresser" },
  { label: "Leadman", value: "Leadman" },
  { label: "Legal Services", value: "Legal Services" },
  { label: "Libra Head Technician", value: "Libra Head Technician" },
  { label: "Lighting Artist", value: "Lighting Artist" },
  { label: "Lighting Assistant", value: "Lighting Assistant" },
  { label: "Lighting Camera", value: "Lighting Camera" },
  { label: "Lighting Coordinator", value: "Lighting Coordinator" },
  { label: "Lighting Design", value: "Lighting Design" },
  { label: "Lighting Designer", value: "Lighting Designer" },
  { label: "Lighting Director", value: "Lighting Director" },
  { label: "Lighting Manager", value: "Lighting Manager" },
  {
    label: "Lighting Production Assistant",
    value: "Lighting Production Assistant",
  },
  { label: "Lighting Programmer", value: "Lighting Programmer" },
  { label: "Lighting Supervisor", value: "Lighting Supervisor" },
  { label: "Lighting Technician", value: "Lighting Technician" },
  { label: "Line Producer", value: "Line Producer" },
  { label: "Loader", value: "Loader" },
  { label: "Local Casting", value: "Local Casting" },
  { label: "Locale Casting Director", value: "Locale Casting Director" },
  { label: "Location Assistant", value: "Location Assistant" },
  { label: "Location Casting", value: "Location Casting" },
  { label: "Location Coordinator", value: "Location Coordinator" },
  { label: "Location Manager", value: "Location Manager" },
  {
    label: "Location Production Assistant",
    value: "Location Production Assistant",
  },
  { label: "Location Scout", value: "Location Scout" },
  { label: "Location Sound Assistant", value: "Location Sound Assistant" },
  { label: "Location Sound Mixer", value: "Location Sound Mixer" },
  { label: "Location Sound Recordist", value: "Location Sound Recordist" },
  { label: "Logistics Coordinator", value: "Logistics Coordinator" },
  { label: "Loop Group Coordinator", value: "Loop Group Coordinator" },
  { label: "Lyricist", value: "Lyricist" },
  { label: "Machinist", value: "Machinist" },
  { label: "Main Title Designer", value: "Main Title Designer" },
  { label: "Main Title Theme Composer", value: "Main Title Theme Composer" },
  { label: "Makeup & Hair", value: "Makeup & Hair" },
  { label: "Makeup & Hair Assistant", value: "Makeup & Hair Assistant" },
  { label: "Makeup Artist", value: "Makeup Artist" },
  { label: "Makeup Department Head", value: "Makeup Department Head" },
  { label: "Makeup Designer", value: "Makeup Designer" },
  { label: "Makeup Effects", value: "Makeup Effects" },
  { label: "Makeup Effects Designer", value: "Makeup Effects Designer" },
  { label: "Makeup Supervisor", value: "Makeup Supervisor" },
  { label: "Makeup Trainee", value: "Makeup Trainee" },
  { label: "Manager of Operations", value: "Manager of Operations" },
  { label: "Marine Coordinator", value: "Marine Coordinator" },
  { label: "Marine Pilot", value: "Marine Pilot" },
  { label: "Martial Arts Choreographer", value: "Martial Arts Choreographer" },
  { label: "Martial Arts Director", value: "Martial Arts Director" },
  { label: "Master at Arms", value: "Master at Arms" },
  { label: "Master Lighting Artist", value: "Master Lighting Artist" },
  { label: "Matchmove Supervisor", value: "Matchmove Supervisor" },
  { label: "Matte Painter", value: "Matte Painter" },
  {
    label: "Mechanical & Creature Designer",
    value: "Mechanical & Creature Designer",
  },
  { label: "Mechanical Designer", value: "Mechanical Designer" },
  { label: "Medical Consultant", value: "Medical Consultant" },
  { label: "Military Consultant", value: "Military Consultant" },
  { label: "Mix Technician", value: "Mix Technician" },
  { label: "Mixing Engineer", value: "Mixing Engineer" },
  { label: "Modeling", value: "Modeling" },
  { label: "Modelling Supervisor", value: "Modelling Supervisor" },
  { label: "Motion Actor", value: "Motion Actor" },
  { label: "Motion Capture Artist", value: "Motion Capture Artist" },
  { label: "Music", value: "Music" },
  { label: "Music Arranger", value: "Music Arranger" },
  { label: "Music Co-Supervisor", value: "Music Co-Supervisor" },
  { label: "Music Consultant", value: "Music Consultant" },
  { label: "Music Coordinator", value: "Music Coordinator" },
  { label: "Music Director", value: "Music Director" },
  { label: "Music Editor", value: "Music Editor" },
  { label: "Music Producer", value: "Music Producer" },
  { label: "Music Programmer", value: "Music Programmer" },
  { label: "Music Score Producer", value: "Music Score Producer" },
  {
    label: "Music Sound Design and Processing",
    value: "Music Sound Design and Processing",
  },
  {
    label: "Music Supervision Assistant",
    value: "Music Supervision Assistant",
  },
  { label: "Music Supervisor", value: "Music Supervisor" },
  { label: "Musical", value: "Musical" },
  { label: "Musical Casting", value: "Musical Casting" },
  { label: "Musician", value: "Musician" },
  { label: "Narrator", value: "Narrator" },
  { label: "Negative Cutter", value: "Negative Cutter" },
  { label: "Novel", value: "Novel" },
  { label: "O.B. Lighting", value: "O.B. Lighting" },
  { label: "O.B. Sound", value: "O.B. Sound" },
  { label: "On Set Computer Graphics", value: "On Set Computer Graphics" },
  { label: "On Set Dresser", value: "On Set Dresser" },
  { label: "On Set Key Props", value: "On Set Key Props" },
  { label: "On Set Props", value: "On Set Props" },
  { label: "Online Editor", value: "Online Editor" },
  { label: "Opening Title Sequence", value: "Opening Title Sequence" },
  { label: "Opening/Ending Animation", value: "Opening/Ending Animation" },
  { label: "Opera", value: "Opera" },
  { label: "Orchestrator", value: "Orchestrator" },
  { label: "Original Casting", value: "Original Casting" },
  { label: "Original Concept", value: "Original Concept" },
  { label: "Original Creator", value: "Original Creator" },
  { label: "Original Film Writer", value: "Original Film Writer" },
  { label: "Original Music Composer", value: "Original Music Composer" },
  { label: "Original Series Creator", value: "Original Series Creator" },
  { label: "Original Series Design", value: "Original Series Design" },
  { label: "Original Story", value: "Original Story" },
  { label: "Paint Coordinator", value: "Paint Coordinator" },
  { label: "Painter", value: "Painter" },
  { label: "Payroll Accountant", value: "Payroll Accountant" },
  { label: "Petty Cash Buyer", value: "Petty Cash Buyer" },
  { label: "Phantom Operator", value: "Phantom Operator" },
  { label: "Photo Retouching", value: "Photo Retouching" },
  { label: "Photoscience Manager", value: "Photoscience Manager" },
  { label: "Picture Car Coordinator", value: "Picture Car Coordinator" },
  { label: "Pilot", value: "Pilot" },
  {
    label: "Pipeline Technical Director",
    value: "Pipeline Technical Director",
  },
  { label: "Planning Producer", value: "Planning Producer" },
  { label: "Playback Coordinator", value: "Playback Coordinator" },
  { label: "Playback Singer", value: "Playback Singer" },
  { label: "Poem", value: "Poem" },
  { label: "Police Consultant", value: "Police Consultant" },
  { label: "Post Coordinator", value: "Post Coordinator" },
  { label: "Post Producer", value: "Post Producer" },
  { label: "Post Production Accountant", value: "Post Production Accountant" },
  { label: "Post Production Assistant", value: "Post Production Assistant" },
  { label: "Post Production Consulting", value: "Post Production Consulting" },
  {
    label: "Post Production Coordinator",
    value: "Post Production Coordinator",
  },
  { label: "Post Production Producer", value: "Post Production Producer" },
  { label: "Post Production Scripts", value: "Post Production Scripts" },
  { label: "Post Production Supervisor", value: "Post Production Supervisor" },
  {
    label: "Post Production Technical Engineer",
    value: "Post Production Technical Engineer",
  },
  { label: "Post-Production Manager", value: "Post-Production Manager" },
  {
    label: "Pre-Visualization Coordinator",
    value: "Pre-Visualization Coordinator",
  },
  {
    label: "Pre-Visualization Supervisor",
    value: "Pre-Visualization Supervisor",
  },
  { label: "Presenter", value: "Presenter" },
  { label: "Principal Costumer", value: "Principal Costumer" },
  { label: "Producer", value: "Producer" },
  { label: "Producer's Assistant", value: "Producer's Assistant" },
  { label: "Producing Director", value: "Producing Director" },
  { label: "Production Accountant", value: "Production Accountant" },
  { label: "Production Artist", value: "Production Artist" },
  { label: "Production Assistant", value: "Production Assistant" },
  { label: "Production Consultant", value: "Production Consultant" },
  { label: "Production Controller", value: "Production Controller" },
  { label: "Production Coordinator", value: "Production Coordinator" },
  { label: "Production Design", value: "Production Design" },
  { label: "Production Designer", value: "Production Designer" },
  { label: "Production Director", value: "Production Director" },
  { label: "Production Driver", value: "Production Driver" },
  { label: "Production Executive", value: "Production Executive" },
  { label: "Production Illustrator", value: "Production Illustrator" },
  { label: "Production Intern", value: "Production Intern" },
  { label: "Production Manager", value: "Production Manager" },
  {
    label: "Production Office Assistant",
    value: "Production Office Assistant",
  },
  {
    label: "Production Office Coordinator",
    value: "Production Office Coordinator",
  },
  { label: "Production Runner", value: "Production Runner" },
  { label: "Production Secretary", value: "Production Secretary" },
  { label: "Production Sound Mixer", value: "Production Sound Mixer" },
  { label: "Production Supervisor", value: "Production Supervisor" },
  { label: "Production Trainee", value: "Production Trainee" },
  { label: "Project Manager", value: "Project Manager" },
  { label: "Projection", value: "Projection" },
  { label: "Prop Designer", value: "Prop Designer" },
  { label: "Prop Maker", value: "Prop Maker" },
  { label: "Prop Master", value: "Prop Master" },
  { label: "Property Builder", value: "Property Builder" },
  { label: "Property Buyer", value: "Property Buyer" },
  { label: "Property Graphic Designer", value: "Property Graphic Designer" },
  { label: "Property Master", value: "Property Master" },
  { label: "Propmaker", value: "Propmaker" },
  { label: "Props", value: "Props" },
  { label: "Prosthetic Designer", value: "Prosthetic Designer" },
  { label: "Prosthetic Makeup Artist", value: "Prosthetic Makeup Artist" },
  { label: "Prosthetic Supervisor", value: "Prosthetic Supervisor" },
  { label: "Prosthetics", value: "Prosthetics" },
  { label: "Prosthetics Painter", value: "Prosthetics Painter" },
  { label: "Prosthetics Sculptor", value: "Prosthetics Sculptor" },
  { label: "Public Relations", value: "Public Relations" },
  { label: "Publicist", value: "Publicist" },
  { label: "Pyrotechnic Supervisor", value: "Pyrotechnic Supervisor" },
  { label: "Pyrotechnician", value: "Pyrotechnician" },
  { label: "Quality Control Supervisor", value: "Quality Control Supervisor" },
  { label: "Radio Play", value: "Radio Play" },
  { label: "Receptionist", value: "Receptionist" },
  { label: "Recording Engineer", value: "Recording Engineer" },
  { label: "Recording Supervision", value: "Recording Supervision" },
  { label: "Red Technician", value: "Red Technician" },
  { label: "Research Assistant", value: "Research Assistant" },
  { label: "Researcher", value: "Researcher" },
  { label: "Rigging Gaffer", value: "Rigging Gaffer" },
  { label: "Rigging Grip", value: "Rigging Grip" },
  { label: "Rigging Supervisor", value: "Rigging Supervisor" },
  { label: "Roto Supervisor", value: "Roto Supervisor" },
  { label: "Rotoscoping Artist", value: "Rotoscoping Artist" },
  { label: "Runner Art Department", value: "Runner Art Department" },
  { label: "Russian Arm Operator", value: "Russian Arm Operator" },
  { label: "Scenario Writer", value: "Scenario Writer" },
  { label: "Scenic Artist", value: "Scenic Artist" },
  { label: "Schedule Coordinator", value: "Schedule Coordinator" },
  { label: "Scientific Consultant", value: "Scientific Consultant" },
  { label: "Score Engineer", value: "Score Engineer" },
  { label: "Scoring Mixer", value: "Scoring Mixer" },
  { label: "Screenplay", value: "Screenplay" },
  { label: "Screenstory", value: "Screenstory" },
  { label: "Screenwriter", value: "Screenwriter" },
  { label: "Screenwriter & Director", value: "Screenwriter & Director" },
  { label: "Script", value: "Script" },
  { label: "Script Consultant", value: "Script Consultant" },
  { label: "Script Coordinator", value: "Script Coordinator" },
  { label: "Script Editor", value: "Script Editor" },
  { label: "Script Researcher", value: "Script Researcher" },
  { label: "Script Supervisor", value: "Script Supervisor" },
  { label: "Sculptor", value: "Sculptor" },
  { label: "Seamstress", value: "Seamstress" },
  {
    label: "Second Assistant 'A' Camera",
    value: "Second Assistant 'A' Camera",
  },
  {
    label: "Second Assistant 'B' Camera",
    value: "Second Assistant 'B' Camera",
  },
  {
    label: "Second Assistant 'C' Camera",
    value: "Second Assistant 'C' Camera",
  },
  {
    label: "Second Assistant 'D' Camera",
    value: "Second Assistant 'D' Camera",
  },
  {
    label: "Second Assistant Accountant",
    value: "Second Assistant Accountant",
  },
  {
    label: "Second Assistant Art Director",
    value: "Second Assistant Art Director",
  },
  { label: "Second Assistant Camera", value: "Second Assistant Camera" },
  { label: "Second Assistant Director", value: "Second Assistant Director" },
  {
    label: "Second Assistant Director Trainee",
    value: "Second Assistant Director Trainee",
  },
  {
    label: "Second Assistant Production Coordinator",
    value: "Second Assistant Production Coordinator",
  },
  { label: "Second Assistant Sound", value: "Second Assistant Sound" },
  {
    label: "Second Assistant Unit Manager",
    value: "Second Assistant Unit Manager",
  },
  { label: "Second Company Grip", value: "Second Company Grip" },
  { label: "Second Film Editor", value: "Second Film Editor" },
  {
    label: "Second Second Assistant Director",
    value: "Second Second Assistant Director",
  },
  { label: "Second Unit", value: "Second Unit" },
  {
    label: "Second Unit Cinematographer",
    value: "Second Unit Cinematographer",
  },
  { label: "Second Unit Director", value: "Second Unit Director" },
  {
    label: "Second Unit Director of Photography",
    value: "Second Unit Director of Photography",
  },
  {
    label: "Second Unit First Assistant Director",
    value: "Second Unit First Assistant Director",
  },
  {
    label: "Second Unit Location Manager",
    value: "Second Unit Location Manager",
  },
  { label: "Security", value: "Security" },
  { label: "Security Coordinator", value: "Security Coordinator" },
  { label: "Senior Animator", value: "Senior Animator" },
  { label: "Senior Colorist", value: "Senior Colorist" },
  {
    label: "Senior Digital Intermediate Colorist",
    value: "Senior Digital Intermediate Colorist",
  },
  {
    label: "Senior Executive Consultant",
    value: "Senior Executive Consultant",
  },
  { label: "Senior Generalist", value: "Senior Generalist" },
  { label: "Senior Modeller", value: "Senior Modeller" },
  { label: "Senior Story Editor", value: "Senior Story Editor" },
  {
    label: "Senior Visual Effects Supervisor",
    value: "Senior Visual Effects Supervisor",
  },
  { label: "Sequence Artist", value: "Sequence Artist" },
  { label: "Sequence Lead", value: "Sequence Lead" },
  { label: "Sequence Supervisor", value: "Sequence Supervisor" },
  { label: "Series Composition", value: "Series Composition" },
  { label: "Series Director", value: "Series Director" },
  { label: "Series Publicist", value: "Series Publicist" },
  { label: "Series Writer", value: "Series Writer" },
  { label: "Set Buyer", value: "Set Buyer" },
  { label: "Set Costumer", value: "Set Costumer" },
  { label: "Set Decorating Coordinator", value: "Set Decorating Coordinator" },
  { label: "Set Decoration Buyer", value: "Set Decoration Buyer" },
  { label: "Set Decoration", value: "Set Decoration" },
  { label: "Set Designer", value: "Set Designer" },
  { label: "Set Dresser", value: "Set Dresser" },
  { label: "Set Dressing Artist", value: "Set Dressing Artist" },
  { label: "Set Dressing Buyer", value: "Set Dressing Buyer" },
  { label: "Set Dressing Manager", value: "Set Dressing Manager" },
  {
    label: "Set Dressing Production Assistant",
    value: "Set Dressing Production Assistant",
  },
  { label: "Set Dressing Supervisor", value: "Set Dressing Supervisor" },
  { label: "Set Medic", value: "Set Medic" },
  { label: "Set Painter", value: "Set Painter" },
  { label: "Set Photographer", value: "Set Photographer" },
  { label: "Set Production Assistant", value: "Set Production Assistant" },
  { label: "Set Production Intern", value: "Set Production Intern" },
  { label: "Set Propsman", value: "Set Propsman" },
  { label: "Set Runner", value: "Set Runner" },
  { label: "Set Supervisor", value: "Set Supervisor" },
  { label: "Sets & Props Artist", value: "Sets & Props Artist" },
  { label: "Sets & Props Supervisor", value: "Sets & Props Supervisor" },
  { label: "Settings", value: "Settings" },
  { label: "SFX Director", value: "SFX Director" },
  { label: "Shading", value: "Shading" },
  { label: "Shoe Design", value: "Shoe Design" },
  { label: "Shop Electric", value: "Shop Electric" },
  { label: "Short Story", value: "Short Story" },
  { label: "Sign Painter", value: "Sign Painter" },
  {
    label: "Simulation & Effects Artist",
    value: "Simulation & Effects Artist",
  },
  {
    label: "Simulation & Effects Production Assistant",
    value: "Simulation & Effects Production Assistant",
  },
  { label: "Smoke Artist", value: "Smoke Artist" },
  { label: "Software Engineer", value: "Software Engineer" },
  { label: "Software Team Lead", value: "Software Team Lead" },
  { label: "Songs", value: "Songs" },
  { label: "Sound", value: "Sound" },
  { label: "Sound Assistant", value: "Sound Assistant" },
  { label: "Sound Design Assistant", value: "Sound Design Assistant" },
  { label: "Sound Designer", value: "Sound Designer" },
  { label: "Sound Director", value: "Sound Director" },
  { label: "Sound Editor", value: "Sound Editor" },
  { label: "Sound Effects", value: "Sound Effects" },
  { label: "Sound Effects Designer", value: "Sound Effects Designer" },
  { label: "Sound Effects Editor", value: "Sound Effects Editor" },
  { label: "Sound Engineer", value: "Sound Engineer" },
  { label: "Sound Mix Technician", value: "Sound Mix Technician" },
  { label: "Sound Mixer", value: "Sound Mixer" },
  { label: "Sound Montage Associate", value: "Sound Montage Associate" },
  {
    label: "Sound Post Production Coordinator",
    value: "Sound Post Production Coordinator",
  },
  { label: "Sound Post Supervisor", value: "Sound Post Supervisor" },
  {
    label: "Sound Re-Recording Assistant",
    value: "Sound Re-Recording Assistant",
  },
  { label: "Sound Re-Recording Mixer", value: "Sound Re-Recording Mixer" },
  { label: "Sound Recordist", value: "Sound Recordist" },
  { label: "Sound Supervisor", value: "Sound Supervisor" },
  { label: "Sound Technical Supervisor", value: "Sound Technical Supervisor" },
  { label: "Special Effects", value: "Special Effects" },
  { label: "Special Effects Assistant", value: "Special Effects Assistant" },
  { label: "Special Effects Best Boy", value: "Special Effects Best Boy" },
  {
    label: "Special Effects Coordinator",
    value: "Special Effects Coordinator",
  },
  {
    label: "Special Effects Key Makeup Artist",
    value: "Special Effects Key Makeup Artist",
  },
  {
    label: "Special Effects Makeup Artist",
    value: "Special Effects Makeup Artist",
  },
  { label: "Special Effects Manager", value: "Special Effects Manager" },
  { label: "Special Effects Supervisor", value: "Special Effects Supervisor" },
  { label: "Special Effects Technician", value: "Special Effects Technician" },
  { label: "Special Guest Director", value: "Special Guest Director" },
  { label: "Special Props", value: "Special Props" },
  { label: "Special Sound Effects", value: "Special Sound Effects" },
  { label: "Specialized Driver", value: "Specialized Driver" },
  { label: "Sponsorship Coordinator", value: "Sponsorship Coordinator" },
  { label: "Sponsorship Director", value: "Sponsorship Director" },
  { label: "Staff Writer", value: "Staff Writer" },
  { label: "Stage Director", value: "Stage Director" },
  { label: "Stand In", value: "Stand In" },
  { label: "Standby Art Director", value: "Standby Art Director" },
  { label: "Standby Carpenter", value: "Standby Carpenter" },
  { label: "Standby Painter", value: "Standby Painter" },
  { label: "Standby Property Master", value: "Standby Property Master" },
  { label: "Standby Rigger", value: "Standby Rigger" },
  { label: "Steadicam Operator", value: "Steadicam Operator" },
  { label: "Steadycam", value: "Steadycam" },
  { label: "Stereoscopic Coordinator", value: "Stereoscopic Coordinator" },
  { label: "Stereoscopic Editor", value: "Stereoscopic Editor" },
  { label: "Stereoscopic Supervisor", value: "Stereoscopic Supervisor" },
  {
    label: "Stereoscopic Technical Director",
    value: "Stereoscopic Technical Director",
  },
  { label: "Still Photographer", value: "Still Photographer" },
  { label: "Story", value: "Story" },
  { label: "Story Artist", value: "Story Artist" },
  { label: "Story Consultant", value: "Story Consultant" },
  { label: "Story Coordinator", value: "Story Coordinator" },
  { label: "Story Developer", value: "Story Developer" },
  { label: "Story Editor", value: "Story Editor" },
  { label: "Story Manager", value: "Story Manager" },
  { label: "Story Supervisor", value: "Story Supervisor" },
  { label: "Storyboard", value: "Storyboard" },
  { label: "Storyboard Artist", value: "Storyboard Artist" },
  { label: "Storyboard Assistant", value: "Storyboard Assistant" },
  { label: "Storyboard Designer", value: "Storyboard Designer" },
  { label: "Street Casting", value: "Street Casting" },
  { label: "Studio Teacher", value: "Studio Teacher" },
  { label: "Stunt Coordinator", value: "Stunt Coordinator" },
  { label: "Stunt Double", value: "Stunt Double" },
  { label: "Stunt Driver", value: "Stunt Driver" },
  { label: "Stunts", value: "Stunts" },
  { label: "Supervising ADR Editor", value: "Supervising ADR Editor" },
  {
    label: "Supervising Animation Director",
    value: "Supervising Animation Director",
  },
  { label: "Supervising Animator", value: "Supervising Animator" },
  { label: "Supervising Armorer", value: "Supervising Armorer" },
  { label: "Supervising Art Director", value: "Supervising Art Director" },
  { label: "Supervising Carpenter", value: "Supervising Carpenter" },
  {
    label: "Supervising Dialogue Editor",
    value: "Supervising Dialogue Editor",
  },
  { label: "Supervising Director", value: "Supervising Director" },
  { label: "Supervising Editor", value: "Supervising Editor" },
  { label: "Supervising Film Editor", value: "Supervising Film Editor" },
  { label: "Supervising Music Editor", value: "Supervising Music Editor" },
  { label: "Supervising Producer", value: "Supervising Producer" },
  { label: "Supervising Sound Editor", value: "Supervising Sound Editor" },
  {
    label: "Supervising Sound Effects Editor",
    value: "Supervising Sound Effects Editor",
  },
  {
    label: "Supervising Technical Director",
    value: "Supervising Technical Director",
  },
  {
    label: "Supervisor of Production Resources",
    value: "Supervisor of Production Resources",
  },
  { label: "Swing", value: "Swing" },
  {
    label: "Systems Administrators & Support",
    value: "Systems Administrators & Support",
  },
  { label: "Tailor", value: "Tailor" },
  { label: "Tattoo Designer", value: "Tattoo Designer" },
  { label: "Tattooist", value: "Tattooist" },
  { label: "Technical Advisor", value: "Technical Advisor" },
  { label: "Technical Supervisor", value: "Technical Supervisor" },
  { label: "Techno Crane Operator", value: "Techno Crane Operator" },
  { label: "Telecine Colorist", value: "Telecine Colorist" },
  { label: "Teleplay", value: "Teleplay" },
  { label: "Temp Music Editor", value: "Temp Music Editor" },
  { label: "Temp Sound Editor", value: "Temp Sound Editor" },
  { label: "Textile Artist", value: "Textile Artist" },
  { label: "Thanks", value: "Thanks" },
  { label: "Theatre Play", value: "Theatre Play" },
  { label: "Theme Song Performance", value: "Theme Song Performance" },
  { label: "Third Assistant 'A' Camera", value: "Third Assistant 'A' Camera" },
  { label: "Third Assistant 'B' Camera", value: "Third Assistant 'B' Camera" },
  { label: "Third Assistant 'C' Camera", value: "Third Assistant 'C' Camera" },
  { label: "Third Assistant 'D' Camera", value: "Third Assistant 'D' Camera" },
  { label: "Third Assistant Camera", value: "Third Assistant Camera" },
  { label: "Third Assistant Director", value: "Third Assistant Director" },
  { label: "Title Designer", value: "Title Designer" },
  { label: "Title Graphics", value: "Title Graphics" },
  { label: "Title Illustration", value: "Title Illustration" },
  {
    label: "Trainee Production Coordinator",
    value: "Trainee Production Coordinator",
  },
  { label: "Transcriptions", value: "Transcriptions" },
  { label: "Translator", value: "Translator" },
  { label: "Transportation Captain", value: "Transportation Captain" },
  { label: "Transportation Co-Captain", value: "Transportation Co-Captain" },
  { label: "Transportation Coordinator", value: "Transportation Coordinator" },
  { label: "Travel Coordinator", value: "Travel Coordinator" },
  { label: "Treatment", value: "Treatment" },
  { label: "Truck Costumer", value: "Truck Costumer" },
  { label: "Truck Production Assistant", value: "Truck Production Assistant" },
  { label: "Truck Supervisor", value: "Truck Supervisor" },
  { label: "Ultimate Arm Operator", value: "Ultimate Arm Operator" },
  { label: "Underwater Camera", value: "Underwater Camera" },
  {
    label: "Underwater Director of Photography",
    value: "Underwater Director of Photography",
  },
  {
    label: "Underwater Epk Photographer",
    value: "Underwater Epk Photographer",
  },
  { label: "Underwater Gaffer", value: "Underwater Gaffer" },
  {
    label: "Underwater Stills Photographer",
    value: "Underwater Stills Photographer",
  },
  { label: "Unit Manager", value: "Unit Manager" },
  { label: "Unit Medic", value: "Unit Medic" },
  { label: "Unit Production Manager", value: "Unit Production Manager" },
  { label: "Unit Publicist", value: "Unit Publicist" },
  { label: "Unit Swing", value: "Unit Swing" },
  { label: "Utility Sound", value: "Utility Sound" },
  { label: "Utility Stunts", value: "Utility Stunts" },
  { label: "Vehicles Coordinator", value: "Vehicles Coordinator" },
  { label: "Vehicles Wrangler", value: "Vehicles Wrangler" },
  { label: "VFX Artist", value: "VFX Artist" },
  {
    label: "VFX Director of Photography",
    value: "VFX Director of Photography",
  },
  { label: "VFX Editor", value: "VFX Editor" },
  { label: "VFX Lighting Artist", value: "VFX Lighting Artist" },
  { label: "VFX Production Coordinator", value: "VFX Production Coordinator" },
  { label: "VFX Supervisor", value: "VFX Supervisor" },
  { label: "Video Assist Operator", value: "Video Assist Operator" },
  { label: "Video Engineer", value: "Video Engineer" },
  { label: "Video Game", value: "Video Game" },
  { label: "Video Report", value: "Video Report" },
  { label: "Videojournalist", value: "Videojournalist" },
  { label: "Visual Development", value: "Visual Development" },
  { label: "Visual Effects", value: "Visual Effects" },
  {
    label: "Visual Effects Art Director",
    value: "Visual Effects Art Director",
  },
  {
    label: "Visual Effects Assistant Editor",
    value: "Visual Effects Assistant Editor",
  },
  { label: "Visual Effects Camera", value: "Visual Effects Camera" },
  { label: "Visual Effects Compositor", value: "Visual Effects Compositor" },
  { label: "Visual Effects Coordinator", value: "Visual Effects Coordinator" },
  {
    label: "Visual Effects Design Consultant",
    value: "Visual Effects Design Consultant",
  },
  { label: "Visual Effects Designer", value: "Visual Effects Designer" },
  { label: "Visual Effects Director", value: "Visual Effects Director" },
  { label: "Visual Effects Editor", value: "Visual Effects Editor" },
  { label: "Visual Effects Lineup", value: "Visual Effects Lineup" },
  { label: "Visual Effects Producer", value: "Visual Effects Producer" },
  {
    label: "Visual Effects Production Assistant",
    value: "Visual Effects Production Assistant",
  },
  {
    label: "Visual Effects Production Manager",
    value: "Visual Effects Production Manager",
  },
  { label: "Visual Effects Supervisor", value: "Visual Effects Supervisor" },
  {
    label: "Visual Effects Technical Director",
    value: "Visual Effects Technical Director",
  },
  { label: "Vocal Coach", value: "Vocal Coach" },
  { label: "Vocals", value: "Vocals" },
  { label: "Wardrobe Assistant", value: "Wardrobe Assistant" },
  { label: "Wardrobe Coordinator", value: "Wardrobe Coordinator" },
  { label: "Wardrobe Designer", value: "Wardrobe Designer" },
  { label: "Wardrobe Intern", value: "Wardrobe Intern" },
  { label: "Wardrobe Master", value: "Wardrobe Master" },
  {
    label: "Wardrobe Specialized Technician",
    value: "Wardrobe Specialized Technician",
  },
  { label: "Wardrobe Supervisor", value: "Wardrobe Supervisor" },
  { label: "Weapons Master", value: "Weapons Master" },
  { label: "Weapons Wrangler", value: "Weapons Wrangler" },
  { label: "Web Designer", value: "Web Designer" },
  { label: "Wig Designer", value: "Wig Designer" },
  { label: "Wigmaker", value: "Wigmaker" },
  { label: "Writer", value: "Writer" },
  { label: "Writers' Assistant", value: "Writers' Assistant" },
  { label: "Writers' Production", value: "Writers' Production" },
];

export const personCrewJob = [
  { label: "Action Director", value: "Action Director" },
  { label: "Animation Department", value: "Animation Department" },
  { label: "Art Department Assistant", value: "Art Department Assistant" },
  { label: "Art Designer", value: "Art Designer" },
  { label: "Art Director", value: "Art Director" },
  { label: "Assistant Director", value: "Assistant Director" },
  { label: "Assistant Editor", value: "Assistant Editor" },
  {
    label: "Assistant Production Manager",
    value: "Assistant Production Manager",
  },
  { label: "Associate Producer", value: "Associate Producer" },
  { label: "Casting Director", value: "Casting Director" },
  { label: "Chief Producer", value: "Chief Producer" },
  { label: "Choreographer", value: "Choreographer" },
  { label: "Cinematography", value: "Cinematography" },
  { label: "Colorist", value: "Colorist" },
  { label: "Composer", value: "Composer" },
  { label: "Costume Designer", value: "Costume Designer" },
  { label: "Creator", value: "Creator" },
  { label: "Director", value: "Director" },
  { label: "Dubbing Mixer", value: "Dubbing Mixer" },
  { label: "Editor", value: "Editor" },
  { label: "Executive Director", value: "Executive Director" },
  { label: "Executive Producer", value: "Executive Producer" },
  { label: "Fight Choreographer", value: "Fight Choreographer" },
  { label: "Focus Puller", value: "Focus Puller" },
  { label: "Gaffer", value: "Gaffer" },
  { label: "Lighting Assistant", value: "Lighting Assistant" },
  { label: "Lighting Technician", value: "Lighting Technician" },
  { label: "Line Producer", value: "Line Producer" },
  { label: "Makeup & Hair", value: "Makeup & Hair" },
  { label: "Makeup Artist", value: "Makeup Artist" },
  { label: "Martial Arts Choreographer", value: "Martial Arts Choreographer" },
  { label: "Martial Arts Director", value: "Martial Arts Director" },
  { label: "Music", value: "Music" },
  { label: "Music Director", value: "Music Director" },
  { label: "Music Editor", value: "Music Editor" },
  { label: "Music Producer", value: "Music Producer" },
  { label: "Musician", value: "Musician" },
  { label: "Narrator", value: "Narrator" },
  { label: "Original Creator", value: "Original Creator" },
  { label: "Original Story", value: "Original Story" },
  { label: "Planning Producer", value: "Planning Producer" },
  { label: "Presenter", value: "Presenter" },
  { label: "Producer", value: "Producer" },
  { label: "Producing Director", value: "Producing Director" },
  { label: "Production Designer", value: "Production Designer" },
  { label: "Production Manager", value: "Production Manager" },
  { label: "Production Sound Mixer", value: "Production Sound Mixer" },
  { label: "Prop Master", value: "Prop Master" },
  { label: "Recording Engineer", value: "Recording Engineer" },
  { label: "Screenplay", value: "Screenplay" },
  { label: "Screenwriter", value: "Screenwriter" },
  { label: "Screenwriter & Director", value: "Screenwriter & Director" },
  { label: "Script Supervisor", value: "Script Supervisor" },
  { label: "Second Unit Director", value: "Second Unit Director" },
  { label: "Set Decoration", value: "Set Decoration" },
  { label: "SFX Director", value: "SFX Director" },
  { label: "Sound Assistant", value: "Sound Assistant" },
  { label: "Sound Director", value: "Sound Director" },
  { label: "Sound Editor", value: "Sound Editor" },
  { label: "Special Effects", value: "Special Effects" },
  {
    label: "Special Effects Makeup Artist",
    value: "Special Effects Makeup Artist",
  },
  { label: "Stage Director", value: "Stage Director" },
  { label: "Story", value: "Story" },
  { label: "Stunt Coordinator", value: "Stunt Coordinator" },
  { label: "Stunt Double", value: "Stunt Double" },
  { label: "Stunts", value: "Stunts" },
  { label: "Supervising Producer", value: "Supervising Producer" },
  { label: "Video Engineer", value: "Video Engineer" },
  { label: "Visual Effects", value: "Visual Effects" },
  { label: "Writer", value: "Writer" },
];

export const serviceLogo = [
  {
    logo: "/abematv.jpg",
    logoPath:
      "C:\\Users\\pc\\Documents\\NextJS\\mijudramainfo/public/channel/abematv.jpg",
    label: "Abema Tv",
    value: "Abema Tv",
  },
  {
    logo: "/alamo.jpg",
    logoPath:
      "C:\\Users\\pc\\Documents\\NextJS\\mijudramainfo/public/channel/alamo.jpg",
    label: "Alamo on Demand",
    value: "Alamo on Demand",
  },
  {
    logo: "/amazonprime.jpg",
    logoPath:
      "C:\\Users\\pc\\Documents\\NextJS\\mijudramainfo/public/channel/amazonprime.jpg",
    label: "Amazon Prime Video",
    value: "Amazon Prime Video",
  },
  {
    logo: "/apple.jpg",
    logoPath:
      "C:\\Users\\pc\\Documents\\NextJS\\mijudramainfo/public/channel/apple.jpg",
    label: "Apple TV",
    value: "Apple TV",
  },
  {
    logo: "/asiancrush.jpg",
    logoPath:
      "C:\\Users\\pc\\Documents\\NextJS\\mijudramainfo/public/channel/asiancrush.jpg",
    label: "AsianCrush",
    value: "AsianCrush",
  },
  {
    logo: "/bfiplayer.jpg",
    logoPath:
      "C:\\Users\\pc\\Documents\\NextJS\\mijudramainfo/public/channel/bfiplayer.jpg",
    label: "BFI Player",
    value: "BFI Player",
  },
  {
    logo: "/bugaboointer.jpg",
    logoPath:
      "C:\\Users\\pc\\Documents\\NextJS\\mijudramainfo/public/channel/bugaboointer.jpg",
    label: "Bugaboo Inter",
    value: "Bugaboo Inter",
  },
  {
    logo: "/cctv.jpg",
    logoPath:
      "C:\\Users\\pc\\Documents\\NextJS\\mijudramainfo/public/channel/cctv.jpg",
    label: "CCTV",
    value: "CCTV",
  },
  {
    logo: "/ch3.jpg",
    logoPath:
      "C:\\Users\\pc\\Documents\\NextJS\\mijudramainfo/public/channel/ch3.jpg",
    label: "ch3+",
    value: "ch3+",
  },
  {
    logo: "/crunchyroll.jpg",
    logoPath:
      "C:\\Users\\pc\\Documents\\NextJS\\mijudramainfo/public/channel/crunchyroll.jpg",
    label: "Crunchyroll",
    value: "Crunchyroll",
  },
  {
    logo: "/dimsumentertainment.jpg",
    logoPath:
      "C:\\Users\\pc\\Documents\\NextJS\\mijudramainfo/public/channel/dimsumentertainment.jpg",
    label: "Dimsum entertainment",
    value: "Dimsum entertainment",
  },
  {
    logo: "/disney+.jpg",
    logoPath:
      "C:\\Users\\pc\\Documents\\NextJS\\mijudramainfo/public/channel/disney+.jpg",
    label: "Disney+",
    value: "Disney+",
  },
  {
    logo: "/disneyhotstar.jpg",
    logoPath:
      "C:\\Users\\pc\\Documents\\NextJS\\mijudramainfo/public/channel/disneyhotstar.jpg",
    label: "Disney+ Hotstar",
    value: "Disney+ Hotstar",
  },
  {
    logo: "/dtv.jpg",
    logoPath:
      "C:\\Users\\pc\\Documents\\NextJS\\mijudramainfo/public/channel/dtv.jpg",
    label: "dTV",
    value: "dTV",
  },
  {
    logo: "/gomtvGOMTV.jpg",
    logoPath:
      "C:\\Users\\pc\\Documents\\NextJS\\mijudramainfo/public/channel/gomtvGOMTV.jpg",
    label: "GOMTV",
    value: "GOMTV",
  },
  {
    logo: "/viki.jpg",
    logoPath:
      "C:\\Users\\pc\\Documents\\NextJS\\mijudramainfo/public/channel/viki.jpg",
    label: "Viki",
    value: "Viki",
  },
];

export const serviceType = [
  {
    label: "Free",
    value: "Free",
  },
  {
    label: "Purchase",
    value: "Purchase",
  },
  {
    label: "Subscription",
    value: "Subscription",
  },
  {
    label: "Pay Per View",
    value: "Pay Per View",
  },
];

export const tvSubtitle = [
  {
    label: "English",
    value: "English",
  },
  {
    label: "Korean",
    value: "Korean",
  },
  {
    label: "Japanese",
    value: "Japanese",
  },
  {
    label: "Khmer",
    value: "Khmer",
  },
  {
    label: "Chinese (Sim.)",
    value: "Chinese (Sim.)",
  },
  {
    label: "Chinese (Trad.)",
    value: "Chinese (Trad.)",
  },
  {
    label: "Spanish",
    value: "Spanish",
  },
  {
    label: "Thai",
    value: "Thai",
  },
  {
    label: "Portuguese (Brasil)",
    value: "Portuguese (Brasil)",
  },
  {
    label: "Portuguese (Portugal)",
    value: "Portuguese (Portugal)",
  },
  {
    label: "Arabic",
    value: "Arabic",
  },
  {
    label: "Bosnian",
    value: "Bosnian",
  },
  {
    label: "Croatian",
    value: "Croatian",
  },
  {
    label: "Czech",
    value: "Czech",
  },
  {
    label: "Danish",
    value: "Danish",
  },
  {
    label: "Dutch",
    value: "Dutch",
  },
  {
    label: "Filipino",
    value: "Filipino",
  },
  {
    label: "Finnish",
    value: "Finnish",
  },
  {
    label: "French",
    value: "French",
  },
  {
    label: "German",
    value: "German",
  },
  {
    label: "Greek",
    value: "Greek",
  },
  {
    label: "Hebrew",
    value: "Hebrew",
  },
  {
    label: "Hungarian",
    value: "Hungarian",
  },
  {
    label: "Indonesian",
    value: "Indonesian",
  },
  {
    label: "Italian",
    value: "Italian",
  },
  {
    label: "Myanmar",
    value: "Myanmar",
  },
  {
    label: "Norwegian",
    value: "Norwegian",
  },
  {
    label: "Polish",
    value: "Polish",
  },
  {
    label: "Romanian",
    value: "Romanian",
  },
  {
    label: "Russian",
    value: "Russian",
  },
  {
    label: "Serbian",
    value: "Serbian",
  },
  {
    label: "Slovak",
    value: "Slovak",
  },
  {
    label: "Swedish",
    value: "Swedish",
  },
  {
    label: "Turkish",
    value: "Turkish",
  },
  {
    label: "Ukrainian",
    value: "Ukrainian",
  },
  {
    label: "Vietnamese",
    value: "Vietnamese",
  },
];

// Release Date
const startYear = 1900;
const endYear = 2030;
const startDay = 1;
const endDay = 31;

const day = Array.from({ length: endDay - startDay + 1 }, (_, index) => {
  const dayNumber = (startDay + index).toString();
  return dayNumber.padStart(2, "0");
});

const years = Array.from(
  { length: endYear - startYear + 1 },
  (_, i) => startYear + i
);

export const releaseDateByMonth = [
  {
    label: "-",
    value: "-",
  },
  {
    label: "01 - January",
    value: "01 - January",
  },
  {
    label: "02 - February",
    value: "02 - February",
  },
  {
    label: "03 - March",
    value: "03 - March",
  },
  {
    label: "04 - April",
    value: "04 - April",
  },
  {
    label: "05 - May",
    value: "05 - May",
  },
  {
    label: "06 - June",
    value: "06 - June",
  },
  {
    label: "07 - July",
    value: "07 - July",
  },
  {
    label: "08 - August",
    value: "08 - August",
  },
  {
    label: "09 - September",
    value: "09 - September",
  },
  {
    label: "10 - October",
    value: "10 - October",
  },
  {
    label: "11 - November",
    value: "11 - November",
  },
  {
    label: "12 - December",
    value: "12 - December",
  },
];

export const releaseDateByDay = [
  {
    label: "-",
    value: "-",
  },
  ...day.map((day) => ({
    label: day.toString(),
    value: day.toString(),
  })),
];

export const releaseDateByYear = [
  {
    label: "----",
    value: "----",
  },
  ...years.map((year) => ({
    label: year.toString(),
    value: year.toString(),
  })),
];

export const weeklyCheckbox = [
  {
    label: "Monday",
    value: "Monday",
  },
  {
    label: "Tuesday",
    value: "Tuesday",
  },
  {
    label: "Wednesday",
    value: "Wednesday",
  },
  {
    label: "Thursday",
    value: "Thursday",
  },
  {
    label: "Friday",
    value: "Friday",
  },
  {
    label: "Saturday",
    value: "Saturday",
  },
  {
    label: "Sunday",
    value: "Sunday",
  },
];

export const episodePerDay = [
  {
    label: "1 episode per day",
    value: "1 episode per day",
  },
  {
    label: "2 episodes per day",
    value: "2 episodes per day",
  },
];

export const production_language = [
  {
    value: "Cantonese",
  },
  {
    value: "English",
  },
  {
    value: "Filipino",
  },
  {
    value: "Japanese",
  },
  {
    value: "Korean",
  },
  {
    value: "Mandarin",
  },
  {
    value: "Other",
  },
  {
    value: "Thai",
  },
];

export const production_country = [
  {
    value: "China",
  },
  {
    value: "Hong Kong",
  },
  {
    value: "Japan",
  },
  {
    value: "Philippines",
  },
  {
    value: "South Korea",
  },
  {
    value: "Taiwan",
  },
  {
    value: "Thailand",
  },
];

export const china_network = [
  {
    value: "Anhui TV",
  },
  {
    value: "BTV",
  },
  {
    value: "CCTV",
  },
  {
    value: "CDITV",
  },
  {
    value: "Chongqing TV",
  },
  {
    value: "CQTV",
  },
  {
    value: "Dragon TV",
  },
  {
    value: "GDTV",
  },
  {
    value: "GZTV",
  },
  {
    value: "HBTV",
  },
  {
    value: "Hubei TV",
  },
  {
    value: "Hunan TV",
  },
  {
    value: "IQiyi",
  },
  {
    value: "JSTV",
  },
  {
    value: "JXTV",
  },
  {
    value: "Mango TV",
  },
  {
    value: "Ningbo TV",
  },
  {
    value: "NNTV",
  },
  {
    value: "Shandong TV",
  },
  {
    value: "Shanghai Television",
  },
  {
    value: "Shenzhen TV",
  },
  {
    value: "Sohu TV",
  },
  {
    value: "Tencent Video",
  },
  {
    value: "WeTV",
  },
  {
    value: "Wuhan TV",
  },
  {
    value: "Youku",
  },
];

export const hk_network = [
  {
    value: "ZJTV",
  },
  {
    value: "ATV",
  },
  {
    value: "HKTV",
  },
  {
    value: "myTv SUPER",
  },
  {
    value: "RTHK",
  },
  {
    value: "TVB Jade",
  },
  {
    value: "ViuTV",
  },
];

export const jp_network = [
  {
    value: "ABC",
  },
  {
    value: "AbemaTV",
  },
  {
    value: "Abn",
  },
  {
    value: "Amazon Prime",
  },
  {
    value: "BeeTV",
  },
  {
    value: "BS Asahi",
  },
  {
    value: "BS Fuji",
  },
  {
    value: "BS Shochiku Tokyu",
  },
  {
    value: "BS SKY PerfecTV",
  },
  {
    value: "BS TV Tokyo",
  },
  {
    value: "BS-TBS",
  },
  {
    value: "BS4",
  },
  {
    value: "CBC",
  },
  {
    value: "Chukyo TV",
  },
  {
    value: "CS TV Asahi Channel 1",
  },
  {
    value: "DATV",
  },
  {
    value: "DMM TV",
  },
  {
    value: "dTV",
  },
  {
    value: "Fuju TV",
  },
  {
    value: "GYAO!",
  },
  {
    value: "HBC",
  },
  {
    value: "Kansai TV",
  },
  {
    value: "MBS",
  },
  {
    value: "Nagoya TV",
  },
  {
    value: "NHK",
  },
  {
    value: "NHK BSP",
  },
  {
    value: "NHK Etele",
  },
  {
    value: "NHK G",
  },
  {
    value: "NHK World Premium",
  },
  {
    value: "NTV",
  },
  {
    value: "Paravi",
  },
  { value: "TBS" },
  { value: "Telasa" },
  { value: "Tokai TV" },
  { value: "Tokyo MX" },
  { value: "TV Aichi" },
  { value: "TV Asahi" },
  { value: "TV Hokkaido" },
  { value: "TV Osaka" },
  { value: "TV Setouchi" },
  { value: "TV Shizuoka" },
  { value: "TV Tokyo" },
  { value: "TVK" },
  { value: "TVQ Kyushu Broadcasting" },
  { value: "UMK" },
  { value: "WOWOW" },
  { value: "WOWOW Live" },
  { value: "YTV" },
];

export const ph_network = [
  { value: "A2Z" },
  { value: "ABS-CBN" },
  { value: "GMA" },
  { value: "iWantTFC" },
  { value: "Kapamilya Channel" },
  { value: "TV5" },
];

export const korea_network = [
  { value: "CGV" },
  { value: "Channel A" },
  { value: "Comedy TV" },
  { value: "COUPANG TV" },
  { value: "Daum Kakao TV" },
  { value: "DRAMAcube" },
  { value: "DramaX" },
  { value: "E-Channel" },
  { value: "EBS" },
  { value: "ENA" },
  { value: "Genie TV" },
  { value: "jTBC" },
  { value: "K-STAR" },
  { value: "KBS1" },
  { value: "KBS2" },
  { value: "MBC" },
  { value: "MBC Dramanet" },
  { value: "MBC every1" },
  { value: "MBC QueeN" },
  { value: "MBN" },
  { value: "Mnet" },
  { value: "Naver TV Cast" },
  { value: "O'live" },
  { value: "OBS" },
  { value: "OCN" },
  { value: "Oksusu" },
  { value: "On Style" },
  { value: "QTV" },
  { value: "SBS" },
  { value: "SBS Plus" },
  { value: "SUPER ACTION" },
  { value: "TBC" },
  { value: "Tooniverse" },
  { value: "TV Chosun" },
  { value: "TVING" },
  { value: "tvN" },
  { value: "vLive" },
  { value: "Watcha" },
  { value: "Wavve" },
  { value: "XTM" },
  { value: "XtvN" },
];

export const tw_network = [
  { value: "Anhui" },
  { value: "BOBA" },
  { value: "CHOCO TV" },
  { value: "CTS" },
  { value: "CTV" },
  { value: "DaAi.Tv" },
  { value: "EBC" },
  { value: "FTV" },
  { value: "GTV" },
  { value: "Hakka TV" },
  { value: "KKTV" },
  { value: "LeTV" },
  { value: "LINE TV" },
  { value: "MTV Taiwan" },
  { value: "PTS" },
  { value: "SET TV" },
  { value: "StarTV" },
  { value: "TTV" },
  { value: "TVBS" },
  { value: "Vidol" },
];

export const th_network = [
  { value: "AIS Play" },
  { value: "ALTV" },
  { value: "Amarin TV 34 HD" },
  { value: "Channel 3" },
  { value: "Channel 5" },
  { value: "Channel 7" },
  { value: "Channel 8" },
  { value: "Channel 9" },
  { value: "GMM 25" },
  { value: "Mello Thailand" },
  { value: "Mono 29" },
  { value: "MONOMAX" },
  { value: "One 31" },
  { value: "oneD" },
  { value: "PPTV" },
  { value: "Thai PBS" },
  { value: "Thairath TV" },
  { value: "TITV" },
  { value: "True4U" },
  { value: "TrueID" },
  { value: "Workpoint TV" },
];

export const other_network = [
  { value: "Disney+" },
  { value: "Hulu" },
  { value: "Kocowa" },
  { value: "Netflix" },
  { value: "Viki" },
];

export const options = [
  {
    label: "China",
    options: china_network?.map((item) => ({
      label: item.value,
      value: item.value,
    })),
  },
  {
    label: "Hong Kong",
    options: hk_network?.map((item) => ({
      label: item.value,
      value: item.value,
    })),
  },
  {
    label: "Japan",
    options: jp_network?.map((item) => ({
      label: item.value,
      value: item.value,
    })),
  },
  {
    label: "Philippines",
    options: ph_network?.map((item) => ({
      label: item.value,
      value: item.value,
    })),
  },
  {
    label: "South Korea",
    options: korea_network?.map((item) => ({
      label: item.value,
      value: item.value,
    })),
  },
  {
    label: "Taiwan",
    options: tw_network?.map((item) => ({
      label: item.value,
      value: item.value,
    })),
  },
  {
    label: "Thailand",
    options: th_network?.map((item) => ({
      label: item.value,
      value: item.value,
    })),
  },
  {
    label: "Others",
    options: other_network?.map((item) => ({
      label: item.value,
      value: item.value,
    })),
  },
];

export const genre_edit = [
  { name: "Action" },
  { name: "Adventure" },
  { name: "Animals" },
  { name: "Business" },
  { name: "Comedy" },
  { name: "Crime" },
  { name: "Detective" },
  { name: "Documentary" },
  { name: "Drama" },
  { name: "Family" },
  { name: "Fantasy" },
  { name: "Food" },
  { name: "Friendship" },
  { name: "Historical" },
  { name: "Horror" },
  { name: "Investigation" },
  { name: "Law" },
  { name: "Life" },
  { name: "Manga" },
  { name: "Martial Arts" },
  { name: "Mature" },
  { name: "Medical" },
  { name: "Melodrama" },
  { name: "Military" },
  { name: "Music" },
  { name: "Mystery" },
  { name: "Political" },
  { name: "Psychological" },
  { name: "Romance" },
  { name: "School" },
  { name: "Sci-Fi" },
  { name: "Sitcom" },
  { name: "Sports" },
  { name: "Supernatural" },
  { name: "Suspense" },
  { name: "Thriller" },
  { name: "Tokusatsu" },
  { name: "Tragedy" },
  { name: "Vampire" },
  { name: "War" },
  { name: "Western" },
  { name: "Wuxia" },
  { name: "Youth" },
  { name: "Zombies" },
];

export const external_link = [
  {
    label: "IMDb ID",
    placeholder: "ID",
    eg: "e.g. https://www.imdb.com/title/ID",
    link_url: "https://www.imdb.com/title/",
    error: "ID",
  },
  {
    label: "TMDB ID",
    placeholder: "ID",
    eg: "e.g. https://www.themoviedb.org/ID",
    link_url: "https://www.themoviedb.org/",
    error: "ID",
  },
  {
    label: "TRAKT",
    placeholder: "ID",
    eg: "e.g. https://trakt.tv/ID",
    link_url: "https://trakt.tv/",
    error: "ID",
  },
  {
    label: "TVDB ID",
    placeholder: "ID",
    eg: "e.g. https://thetvdb.com/series/ID",
    link_url: "https://thetvdb.com/series/",
    error: "ID",
  },
  {
    label: "Facebook",
    placeholder: "Username/Handle",
    eg: "e.g. https://facebook.com/HANDLE",
    link_url: "https://facebook.com/",
    error: "Handle",
  },
  {
    label: "Instagram",
    placeholder: "Username/Handle",
    eg: "e.g. https://www.instagram.com/HANDLE",
    link_url: "https://www.instagram.com/",
    error: "Handle",
  },
  {
    label: "Twitter",
    placeholder: "Username/Handle",
    eg: "e.g. https://twitter.com/HANDLE",
    link_url: "https://twitter.com/",
    error: "Handle",
  },
  {
    label: "Website",
    placeholder: "",
    eg: "",
    error: "URL",
  },
];

export const personPopularity = [
  {
    name: "Dragon",
    image: "rounded-dragon.png",
    length: "10",
  },
  {
    name: "Thuglife",
    image: "thuglife.png",
    length: "10",
  },
  {
    name: "Bird",
    image: "winged-bird.png",
    length: "10",
  },
  {
    name: "Swan",
    image: "swan-dream.png",
    length: "10",
  },
];

export const nationalityList = [
  { value: "Japanese" },
  { value: "Chinese" },
  { value: "South Korean" },
  { value: "Hong Kong" },
  { value: "Taiwanese" },
  { value: "Thai" },
  { value: "Afghan" },
  { value: "Albanian" },
  { value: "Algerian" },
  { value: "Andorran" },
  { value: "Angolan" },
  { value: "Antiguans, Barbudans" },
  { value: "Argentinean" },
  { value: "Armenian" },
  { value: "Australian" },
  { value: "Austrian" },
  { value: "Azerbaijani" },
  { value: "Bahamian" },
  { value: "Bahraini" },
  { value: "Bangladeshi" },
  { value: "Barbadian" },
  { value: "Belarusian" },
  { value: "Belgian" },
  { value: "Belizean" },
  { value: "Beninese" },
  { value: "Bhutanese" },
  { value: "Bolivian" },
  { value: "Bosnian, Herzegovinian" },
  { value: "Motswana" },
  { value: "Brazilian" },
  { value: "Bruneian" },
  { value: "Bulgarian" },
  { value: "Burkinabe" },
  { value: "Burundian" },
  { value: "Cambodian" },
  { value: "Cameroonian" },
  { value: "Canadian" },
  { value: "Cape Verdian" },
  { value: "Central African" },
  { value: "Chadian" },
  { value: "Chilean" },
  { value: "Colombian" },
  { value: "Comoran" },
  { value: "Congolese" },
  { value: "Costa Rican" },
  { value: "Ivorian" },
  { value: "Croatian" },
  { value: "Cuban" },
  { value: "Cypriot" },
  { value: "Czech" },
  { value: "Danish" },
  { value: "Djibouti" },
  { value: "Dominican" },
  { value: "East Timorese" },
  { value: "Ecuadorean" },
  { value: "Egyptian" },
  { value: "Salvadoran" },
  { value: "Equatorial Guinean" },
  { value: "Eritrean" },
  { value: "Estonian" },
  { value: "Ethiopian" },
  { value: "Fijian" },
  { value: "Finnish" },
  { value: "French" },
  { value: "Gabonese" },
  { value: "Gambian" },
  { value: "Georgian" },
  { value: "German" },
  { value: "Ghanaian" },
  { value: "Greek" },
  { value: "Grenadian" },
  { value: "Guatemalan" },
  { value: "Guinean" },
  { value: "Guinea-Bissauan" },
  { value: "Guyanese" },
  { value: "Haitian" },
  { value: "Honduran" },
  { value: "Hungarian" },
  { value: "Icelander" },
  { value: "Indian" },
  { value: "Indonesian" },
  { value: "Iranian" },
  { value: "Iraqi" },
  { value: "Irish" },
  { value: "Israeli" },
  { value: "Italian" },
  { value: "Jamaican" },
  { value: "Jordanian" },
  { value: "Kazakhstani" },
  { value: "Kenyan" },
  { value: "I-Kiribati" },
  { value: "North Korean" },
  { value: "Kuwaiti" },
  { value: "Kirghiz" },
  { value: "Laotian" },
  { value: "Latvian" },
  { value: "Lebanese" },
  { value: "Mosotho" },
  { value: "Liberian" },
  { value: "Libyan" },
  { value: "Liechtensteiner" },
  { value: "Lithuanian" },
  { value: "Luxembourger" },
  { value: "Macedonian" },
  { value: "Malagasy" },
  { value: "Malawian" },
  { value: "Malaysian" },
  { value: "Maldivan" },
  { value: "Malian" },
  { value: "Maltese" },
  { value: "Marshallese" },
  { value: "Mauritanian" },
  { value: "Mauritian" },
  { value: "Mexican" },
  { value: "Micronesian" },
  { value: "Moldovan" },
  { value: "Monegasque" },
  { value: "Mongolian" },
  { value: "Moroccan" },
  { value: "Mozambican" },
  { value: "Burmese" },
  { value: "Namibian" },
  { value: "Nauruan" },
  { value: "Nepalese" },
  { value: "Dutch" },
  { value: "New Zealander" },
  { value: "Nicaraguan" },
  { value: "Nigerien" },
  { value: "Nigerian" },
  { value: "Norwegian" },
  { value: "Omani" },
  { value: "Pakistani" },
  { value: "Palauan" },
  { value: "Panamanian" },
  { value: "Papua New Guinean" },
  { value: "Paraguayan" },
  { value: "Peruvian" },
  { value: "Filipino" },
  { value: "Polish" },
  { value: "Portuguese" },
  { value: "Qatari" },
  { value: "Romanian" },
  { value: "Russian" },
  { value: "Rwandan" },
  { value: "Kittian and Nevisian" },
  { value: "Saint Lucian" },
  { value: "Samoan" },
  { value: "Sammarinese" },
  { value: "Sao Tomean" },
  { value: "Saudi Arabian" },
  { value: "Senegalese" },
  { value: "Serbian" },
  { value: "Seychellois" },
  { value: "Sierra Leonean" },
  { value: "Singaporean" },
  { value: "Slovak" },
  { value: "Slovene" },
  { value: "Solomon Islander" },
  { value: "Somali" },
  { value: "South African" },
  { value: "Spanish" },
  { value: "Sri Lankan" },
  { value: "Sudanese" },
  { value: "Surinamer" },
  { value: "Swazi" },
  { value: "Swedish" },
  { value: "Swiss" },
  { value: "Syrian" },
  { value: "Tadzhik" },
  { value: "Tanzanian" },
  { value: "Togolese" },
  { value: "Tongan" },
  { value: "Trinidadian" },
  { value: "Tunisian" },
  { value: "Turkish" },
  { value: "Turkmen" },
  { value: "Tuvaluan" },
  { value: "Ugandan" },
  { value: "Ukrainian" },
  { value: "Emirian" },
  { value: "British" },
  { value: "American" },
  { value: "Uruguayan" },
  { value: "Uzbekistani" },
  { value: "Ni-Vanuatu" },
  { value: "Venezuelan" },
  { value: "Vietnamese" },
  { value: "Yemeni" },
  { value: "Zambian" },
  { value: "Zimbabwean" },
  { value: "Yugoslav" },
];

export const person_gender = [
  {
    value: "Male",
  },
  {
    value: "Female",
  },
];

export const person_id_link = [
  { network: "facebook", link: "https://www.facebook.com/" },
  { network: "instagram", link: "https://www.instagram.com/" },
  { network: "tiktok", link: "https://www.tiktok.com/@" },
  { network: "douyin", link: "https://www.douyin.com/user/" },
  { network: "twitter", link: "https://x.com/" },
  {
    network: "weibo",
    link: "https://m.weibo.cn/u/3669102477?t=0&luicode=10000011&lfid=",
  },
  { network: "youtube", link: "https://www.youtube.com/" },
  { network: "imdb", link: "https://www.imdb.com/name/" },
  { network: "wikidata", link: "https://www.wikidata.org/wiki/" },
  { network: "trakt", link: "https://trakt.tv/shows/" },
  { network: "mydramalist", link: "https://mydramalist.com/people/" },
];

export const reviewLanguage = [
  {
    label: "All Languages",
    value: "all_language",
  },
  {
    label: "English",
    value: "en",
  },
  {
    label: "Korean",
    value: "ko",
  },
  {
    label: "Khmer",
    value: "km",
  },
  {
    label: "Japanese",
    value: "ja",
  },
  {
    label: "Thai",
    value: "th",
  },
  {
    label: "Chinese (Sim.)",
    value: "zh-CN",
  },
  {
    label: "Chinese (Trad.)",
    value: "zh-TW",
  },
  {
    label: "Spanish",
    value: "es",
  },
  {
    label: "Portuguese (Brasil)",
    value: "pt-BR",
  },
  {
    label: "Portuguese (Portugal)",
    value: "pt-PT",
  },
  {
    label: "Arabic",
    value: "ar",
  },
  {
    label: "Bosnian",
    value: "bs",
  },
  {
    label: "Croatian",
    value: "hr",
  },
  {
    label: "Czech",
    value: "cs",
  },
  {
    label: "Danish",
    value: "da",
  },
  {
    label: "Dutch",
    value: "nl",
  },
  {
    label: "Filipino",
    value: "fil",
  },
  {
    label: "Finnish",
    value: "fi",
  },
  {
    label: "French",
    value: "fr",
  },
  {
    label: "German",
    value: "de",
  },
  {
    label: "Greek",
    value: "el",
  },
  {
    label: "Hebrew",
    value: "he",
  },
  {
    label: "Hungarian",
    value: "hu",
  },
  {
    label: "Indonesian",
    value: "id",
  },
  {
    label: "Italian",
    value: "it",
  },
  {
    label: "Myanmar",
    value: "my",
  },
  {
    label: "Norwegian",
    value: "no",
  },
  {
    label: "Polish",
    value: "pl",
  },
  {
    label: "Romanian",
    value: "ro",
  },
  {
    label: "Russian",
    value: "ru",
  },
  {
    label: "Serbian",
    value: "sr",
  },
  {
    label: "Slovak",
    value: "sk",
  },
  {
    label: "Swedish",
    value: "sv",
  },
  {
    label: "Turkish",
    value: "tr",
  },
  {
    label: "Ukrainian",
    value: "uk",
  },
  {
    label: "Vietnamese",
    value: "vi",
  },
];

export const reviewStatus = [
  {
    label: "All Status",
    value: "all_status",
  },
  {
    label: "Completed",
    value: "completed",
  },
  {
    label: "Ongoing",
    value: "ongoing",
  },
  {
    label: "Dropped",
    value: "dropped",
  },
  {
    label: "Hide Spoiler",
    value: "spoiler",
  },
];
