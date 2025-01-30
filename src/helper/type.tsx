import { UseFormRegister, UseFormReset } from "react-hook-form";
import { TCreateList, TProfileSetting } from "./zod";
import { Prisma } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";

export type SearchParamsType =
  | string
  | URLSearchParams
  | Record<string, string>
  | string[][];
export interface FriendRequestProps {
  id: string;
  status: string;
  profileAvatar: string | null;
  image: string;
  name: string;
  country: string | null;
  friendRespondId: string;
  friendRequestId: string | null;
  notification: string;
  createdAt: Date;
  updatedAt: Date;
  actionDatetime: Date;
}

export interface IFriend {
  friend: FriendRequestProps[];
}

export interface currentUserProps {
  id: string;
  public_cover_id: string | null;
  public_avatar_id: string | null;
  name: string;
  displayName: string | null;
  email: string;
  emailVerified: string | null;
  image: string | null;
  country: string | null;
  gender: string | null;
  dateOfBirth: Date | null;
  biography: string | null;
  coverPhoto: string | null;
  profileAvatar: string | null;
  coin: number | null;
  followers: string[];
  following: string[];
  lastLogin: Date | null;
  createdAt: string;
  updatedAt: Date;
}

export interface UserProps {
  id: string;
  public_cover_id: string | null;
  public_avatar_id: string | null;
  name: string;
  displayName: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  country: string | null;
  gender: string | null;
  role: string;
  dateOfBirth: Date | null;
  biography: string | null;
  coverPhoto: string | null;
  profileAvatar: string | null;
  coin: number;
  popularitySent:
    | Array<Array<{ itemId: string; starCount: number; actorName: string }>>
    | any;
  totalPopularitySent:
    | Array<{ personId: string; actorName: string; totalPopularity: number }>
    | any;
  followers: string[];
  following: string[];
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface findSpecificUserProps {
  id: string;
  public_cover_id: string | null;
  public_avatar_id: string | null;
  name: string;
  displayName: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  country: string | null;
  gender: string | null;
  dateOfBirth: Date | null;
  biography: string | null;
  coverPhoto: string | null;
  profileAvatar: string | null;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
  role: string;
}

export interface IFindSpecificUser {
  findSpecificUser: findSpecificUserProps[] | null[];
  yourFriend: findSpecificUserProps[] | null[];
}

export interface List {
  id: string;
  userId: string;
  listId: string;
  type: string;
  listTitle: string;
  privacy: string;
  description: string | null;
  comment: string | null;
  sortBy: string;
  love: number | null;
  lovedBy: string[];
  thumbnail: string | null;
  public_id: string | null;
  dramaComment: any[]; // or any[] if you don't have a specific structure for dramaComment
  movieId: number[];
  tvId: number[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IList {
  list: List[] | null;
  tvId: any[] | { tvid: number };
  movieId: any[] | { movieId: number };
}

export interface ProfilePageProps {
  currentUser: currentUserProps | null;
  list: List[] | null;
  tvid:
    | {
        tvid: number;
      }
    | any[];
  movieId:
    | {
        movieId: number;
      }
    | any[];
  tv_id:
    | {
        id: number;
        updatedAt: Date;
      }
    | any[];
  formattedDate: string;
  lastLogin: string;
  existedFavorite:
    | {
        existedFavorite: number;
      }
    | any[];
  findFriendId: {
    id: string;
    friendRespondId: string;
    friendRequestId: string | null;
    status: string;
    profileAvatar: string | null;
    image: string;
    name: string;
    country: string | null;
    createdAt: Date;
    updatedAt: Date;
  } | null;
}

export interface FetchRecentListProps {
  tvId: number;
  movieId: number;
  index: number;
  listIndex: number;
  handleMouseEnter: (listIndex: number, idx: number) => void;
  handleMouseLeave: (listIndex: number) => void;
  hoveredIndexes: (number | null)[];
}

export interface WatchListProps {
  tv_id: { id: number; updatedAt: Date } | { id: number; updatedAt: Date }[];
  existedFavorite: number[] | { existedFavorite: number };
  user: UserProps | null;
}

export interface UploadAvatarProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  avatar: string | undefined;
  setAvatar: (avatar: string) => void;
  user: UserProps | null;
  register: UseFormRegister<TProfileSetting>;
  handleSubmit: any;
}

export interface Rating {
  id: string;
  userId: string;
  rating: number;
  mood: string | null;
  emojiImg: string | null;
  movieId: string | null;
  tvId: string | null;
  status: string;
  episode: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRating {
  tvId: string;
  rating: Rating;
}

export interface EditListProps {
  list: List | null;
  submittedData: TCreateList | null;
  yourRating: Rating[];
  findSpecificRating: IRating[];
}

export interface MovieResultProps {
  setMovieId: (movieId: number[]) => void;
  movieId: number[];
  setTvId: (tvId: number[]) => void;
  tvId: number[];
  list: List | null;
  reset: UseFormReset<TCreateList>;
  handleSubmit: (data: any) => void;
  loading: boolean;
  findSpecificRating: IRating[];
  yourRating: Rating[];
  register: UseFormRegister<TCreateList>;
}

export interface ListThumbnailProps {
  list: List | null;
  tvId: Prisma.JsonValue[];
  movieId: Prisma.JsonValue[];
  reset: UseFormReset<TCreateList>;
}

export interface CommentProps {
  id: string;
  message: string;
  userId: string;
  postId: string;
  type: string;
  spoiler: boolean;
  replies: Prisma.JsonValue[] | undefined; // Adjust this to match the type of replies in comment
  parentId: string | null;
  repliedUserId: string | null;
  love: number;
  lovedBy: string[];
  createdAt: Date;
  updatedAt: Date;
}
[];

export interface tvId {
  tv_id: string;
}

export interface movieId {
  movie_id: string;
}

export interface Drama {
  tv_id: string;
  tvDetails: {
    id: string;
    userId: string;
    details: Prisma.JsonValue[];
    cover: string | null;
    related_title: Prisma.JsonValue[];
    cast: Prisma.JsonValue[];
    crew: Prisma.JsonValue[];
    services: Prisma.JsonValue[];
    external_links: Prisma.JsonValue[];
    released_information: Prisma.JsonValue[];
    production_information: Prisma.JsonValue[];
    genres_tags: Prisma.JsonValue[];
    changes: Prisma.JsonValue[];
    changeCount: Number;
    createdAt: Date;
    updatedAt: Date;
  } | null;
}
export interface Movie {
  movie_id: string;
  movieDetails: {
    id: string;
    userId: string;
    details: Prisma.JsonValue[];
    cover: string | null;
    related_title: Prisma.JsonValue[];
    cast: Prisma.JsonValue[];
    crew: Prisma.JsonValue[];
    services: Prisma.JsonValue[];
    external_links: Prisma.JsonValue[];
    released_information: Prisma.JsonValue[];
    production_information: Prisma.JsonValue[];
    genres_tags: Prisma.JsonValue[];
    changes: Prisma.JsonValue[];
    changeCount: Number;
    createdAt: Date;
    updatedAt: Date;
  } | null;
}

interface Photo {
  url: string;
  public_id: string;
  title: string;
  description: string;
}

export interface DramaDB {
  id: string;
  userId: string;
  tv_id: string;
  details: Prisma.JsonValue[];
  cover: string | null;
  related_title: Prisma.JsonValue[];
  cast: CrewRole[];
  crew: CrewRole[];
  services: Prisma.JsonValue[];
  external_links: Prisma.JsonValue[];
  released_information: Prisma.JsonValue[];
  production_information: Prisma.JsonValue[];
  genres_tags: Prisma.JsonValue[];
  changes: Prisma.JsonValue[];
  photo: Photo[];
  changeCount: Number;
  createdAt: Date;
  updatedAt: Date;
}
interface Genre {
  label: string;
  value: string;
}

interface Tag {
  name: string;
  value: string;
}

interface GenreTag {
  genre: Genre[];
  tag: Tag[];
}
export interface MovieDB {
  id: string;
  userId: string;
  movie_id: string;
  details: Prisma.JsonValue[];
  cover: string | null;
  related_title: Prisma.JsonValue[];
  cast: Prisma.JsonValue[];
  crew: Prisma.JsonValue[];
  services: Prisma.JsonValue[];
  external_links: Prisma.JsonValue[];
  released_information: Prisma.JsonValue[];
  production_information: Prisma.JsonValue[];
  genres_tags: GenreTag[];
  changes: Prisma.JsonValue[];
  changeCount: Number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DramaDetails {
  title: string;
  native_title: string;
  country: string;
  known_as: string[];
  synopsis: string;
  content_type: string;
  content_rating: string;
  status: string;
  duration: number;
  episode: number;
  story: string;
}

export interface DramaReleasedInfo {
  adult: boolean;
  air_date: string | null;
  all_episode: Prisma.JsonValue[];
  backdrop_path: string | null;
  broadcast: [
    {
      day: string;
      time: string;
      episode: string;
    }
  ];
  created_by: Prisma.JsonValue[];
  episode_end: number | null;
  episode_run_time: Prisma.JsonValue[];
  episode_start: number;
  first_air_date: string | null;
  genres: Prisma.JsonValue[];
  homepage: string | null;
  id: number;
  in_production: boolean;
  languages: string[];
  last_air_date: string | null;
  last_episode_to_air: Prisma.JsonValue;
  name: string;
  networks: Prisma.JsonValue[];
  next_episode_to_air: string | null;
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  popularity: number;
  poster_path: string;
  production_companies: Prisma.JsonValue[];
  production_countries: Prisma.JsonValue[];
  release_date: string;
  end_date: string;
  season: Prisma.JsonValue[];
  seasons: Prisma.JsonValue[];
  spoken_languages: Prisma.JsonValue[];
  status: string;
  tagline: string;
  title: string;
  type: string[];
  vote_average: number;
  vote_count: string;
  service_name: string | null;
  service_type: string | null;
  service_url: string | null;
  subtitles: string | null;
  availability: string | null;
}

export interface EditDramaPage {
  provider_name: any;
  availability: {
    label: string;
    value: string;
  }[];
  id: string;
  link: string;
  public_id: string;
  service: string;
  service_logo: string;
  service_type: string;
  service_url: string;
  logo: string;
  subtitles: {
    label: string;
    value: string;
  }[];
  order: number;
  page_link: string;
  drama: [{}];
  networks: [{}];
  ads: [{}];
  flatrate: [{}];
  free: [{}];
  rent: [{}];
  buy: [{}];
}
[];

export interface EditPageDefaultvalue {
  provider_name: string;
  service_type: string;
  link: string;
  availability: {
    label: string;
    value: string;
  }[];
  subtitles: {
    label: string;
    value: string;
  }[];
}

export interface AddSeason {
  title: string | undefined;
  name: string | undefined;
  episode_start: number;
  episode_end: number;
  air_date: string | undefined;
  number_of_episodes?: string;
  first_air_date?: string;
}
[];

export interface ExternalLinkType {
  title: string;
  url: string;
  id: string;
  link_url: string;
  link_text: string;
  additional_text: string;
}

export interface CrewType {
  adult: boolean;
  department: string;
  gender: number;
  id: number;
  jobs: [{}];
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  total_episode_count: number;
  imdb_id: string;
  homepage: string | null;
  deathday: string | null;
  birthday: string | null;
  also_known_as: string[];
}

export interface CastType {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  order: number;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  roles: [
    {
      character: string;
      credit_id: string;
      episode_count: number;
    }
  ];
  total_episode_counter: number;
}

export interface PersonType {
  adult: boolean;
  also_known_as: string[];
  biography: string | null;
  birthday: string | null;
  deathday: string | null;
  gender: number;
  id: number;
  imdb_id: string;
  homepage: string | null;
  knwon_for_department: string | null;
  name: string;
  place_of_birth: string | null;
  popularity: number;
  profile_path: string | null;
  poster_path: string | null;
}

type PersonPopularity = {
  itemId: string;
  starCount: number;
  actorName: string;
};
export interface PersonDBType {
  id: string;
  personId: string;
  name: string | null;
  love: number | null;
  lovedBy: Prisma.JsonValue[];
  totalPopularity: number;
  popularity: PersonPopularity | any;
  sentBy: Prisma.JsonValue[];
  details: Prisma.JsonValue[];
  cover: string | null;
  cast: Prisma.JsonValue[];
  crew: Prisma.JsonValue[];
  external_links: Prisma.JsonValue[];
  changes:
    | {
        userId: string;
        timestamp: string;
        field: string;
        oldValue: string | null;
        newValue: string;
      }[]
    | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PersonDetail {
  nationality: string | null;
  first_name: string | null;
  last_name: string | null;
  native_name: string | null;
  gender: string | null;
  also_known_as: string | null;
  biography: string | null;
  birthday: string | null;
  deathday: string | null;
}

export interface PersonExternalID {
  facebook_id: string | null;
  instagram_id: string | null;
  tiktok_id: string | null;
  douyin_id: string | null;
  twitter_id: string | null;
  weibo_id: string | null;
  youtube_id: string | null;
  imdb_id: string | null;
  wikidata_id: string | null;
  trakt_id: string | null;
  mdl_id: string | null;
}

export interface ITvReview {
  id: string;
  tv_id: string;
  userId: string;
  rating_score: {
    acting: number;
    music: number;
    overall: number;
    rewatchValue: number;
    story: number;
  };
  userInfo: {
    name: string;
    displayName: string;
    profileAvatar: string | null;
    image: string | null;
  };
  spoiler: boolean | null;
  finishedWatching: boolean | null;
  dropping: boolean | null;
  episode: number | null;
  review_language: string | null;
  headline: string | null;
  review: string;
  overall_score: number;
  reviewHelpful: number;
  reviewNotHelpful: number;
  reviewBy: [
    {
      userId: string;
      action: string;
    }
  ];
  updatedAt: string;
  createdAt: Date;
}

export interface IMovieReview {
  id: string;
  movie_id: string;
  userId: string;
  rating_score: {
    acting: number;
    music: number;
    overall: number;
    rewatchValue: number;
    story: number;
  } | null;
  userInfo: {
    name: string;
    displayName: string;
    profileAvatar: string | null;
    image: string | null;
  };
  spoiler: boolean | null;
  finishedWatching: boolean | null;
  dropping: boolean | null;
  episode: number | null;
  review_language: string | null;
  headline: string | null;
  review: string;
  overall_score: number;
  reviewHelpful: number;
  reviewNotHelpful: number;
  reviewBy: [
    {
      userId: string;
      action: string;
    }
  ];
  updatedAt: string;
  createdAt: Date;
}

export type ProfileFeedsTypes = {
  id: string;
  userId: string;
  username: string;
  content: string;
  link: {
    author: string;
    date: string;
    description: string;
    image: string;
    logo: string;
    publisher: string;
    title: string;
    url: string;
  };
  image: string | null;
  spoiler: boolean;
  tag: TVShow[];
  like: number;
  likeBy: string[];
  comment: Prisma.JsonValue[];
  createdAt: string;
  updatedAt: string;
};

export interface IProfileFeeds {
  getFeeds: ProfileFeedsTypes[];
  currentUser: currentUserProps | null;
}

interface TrailerResult {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  key: string;
  name: string;
  official: boolean;
  published_at: string;
  site: string;
  size: number;
  type: string;
}

export interface TrailerResponse {
  id: number;
  results: TrailerResult[];
}

export interface CrewRole {
  adult: boolean; // Indicates if the crew member is categorized as an adult
  credit_id: string; // Unique credit identifier
  department: string; // Department the crew member works in (e.g., "Directing")
  gender: number | null; // Gender of the crew member (2 = Male, 1 = Female, 0 = Not specified)
  id: number; // Unique identifier for the crew member
  job: string; // Specific job title (e.g., "Director")
  known_for_department: string; // Department the crew member is most known for
  name: string; // Name of the crew member
  original_name: string; // Original name of the crew member
  popularity: number; // Popularity rating of the crew member
  profile_path: string | null; // Path to the profile image or null if not available
}

interface TitleInfo {
  iso_3166_1: string; // Country code (e.g., "TW" for Taiwan, "US" for the United States)
  title: string; // Title of the content
  type: string; // Type of the title (e.g., movie, show, etc., can be empty)
}

export interface TitleData {
  id: number; // Unique identifier for the title
  title: TitleInfo[]; // Array of title information
}

export interface IExistedFavorite {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  movieId: JsonValue[];
  tvId: JsonValue[];
  favoriteIds: JsonValue[];
}

interface Genre {
  id: number;
  name: string;
}

interface ProductionCompany {
  id: number;
  logo_path: string | null; // Can be null
  name: string;
  origin_country: string;
}

interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

interface BelongsToCollection {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
}

interface Releases {
  countries: string[]; // Or a more specific type if you know the structure
}

export interface TMDBMovie {
  adult: boolean;
  name: string;
  backdrop_path: string | null;
  belongs_to_collection: BelongsToCollection | null; // Can be null
  budget: number;
  genres: Genre[];
  homepage: string | null;
  id: number;
  imdb_id: string | null;
  origin_country: string[];
  original_language: string;
  original_title: string;
  overview: string | null;
  popularity: number;
  poster_path: string | null;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  release_date: string;
  releases: Releases;
  revenue: number;
  runtime: number | null;
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string | null;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}
interface Title {
  iso_3166_1: string;
  title: string;
  type: string;
}

export interface MovieTitles {
  id: number;
  title: Title[];
}

export interface TVShow {
  adult: boolean;
  backdrop_path: string | null;
  created_by: any[];
  episode_run_time: number[];
  first_air_date: string;
  genres: Genre[];
  homepage: string;
  id: number;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  last_episode_to_air: Episode;
  name: string;
  title: string;
  release_date: string;
  next_episode_to_air: Episode | null;
  networks: Network[];
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  seasons: Season[];
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  type: string[];
  vote_average: number;
  vote_count: number;
  aggregate_credits: AggregateCredits;
  alternative_titles: AlternativeTitles;
  changes: Changes;
  content_ratings: ContentRatings;
  credits: Credits;
  episode_groups: EpisodeGroups;
  external_ids: ExternalIds;
  images: Images;
  keywords: Keywords;
  lists: TMDBList;
  recommendations: Recommendations;
  reviews: Reviews;
  screened_theatrically: ScreenedTheatrically;
  similar: Similar;
  translations: Translations;
  videos: Videos;
  "watch/providers": WatchProviders;
  broadcast: {
    day: string;
    time: string;
  }[];
  end_date: string;
}

interface Genre {
  id: number;
  name: string;
}

interface Episode {
  id: number;
  name: string;
  overview: string;
  vote_average: number;
  vote_count: number;
  air_date: string;
  episode_number: number;
  episode_type: string;
  production_code: string;
  runtime: number;
  season_number: number;
  show_id: number;
  still_path: string;
}

interface Network {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}

interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

interface Season {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
  vote_average: number;
}

interface AggregateCredits {
  cast: CastMember[];
  crew: CrewMember[];
}

interface CastMember {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  roles: Role[];
  total_episode_count: number;
  order: number;
}

interface Role {
  credit_id: string;
  character: string;
  episode_count: number;
}

interface CrewMember {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  jobs: Job[];
  department: string;
  total_episode_count: number;
}

interface Job {
  credit_id: string;
  job: string;
  episode_count: number;
}

interface AlternativeTitles {
  results: AlternativeTitle[];
}

interface AlternativeTitle {
  iso_3166_1: string;
  title: string;
  type: string;
}

interface Changes {
  changes: Change[];
}

interface Change {
  key: string;
  items: ChangeItem[];
}

interface ChangeItem {
  id: string;
  action: string;
  time: string;
  iso_639_1: string;
  iso_3166_1: string;
  value: any;
  original_value?: any;
}

interface ContentRatings {
  results: any[];
}

interface Credits {
  cast: CastMember[];
  crew: CrewMember[];
}

interface EpisodeGroups {
  results: any[];
}

interface ExternalIds {
  imdb_id: string | null;
  freebase_mid: string | null;
  freebase_id: string | null;
  tvdb_id: number | null;
  tvrage_id: number | null;
  wikidata_id: string | null;
  facebook_id: string | null;
  instagram_id: string | null;
  twitter_id: string | null;
}

interface Images {
  backdrops: any[];
  logos: any[];
  posters: any[];
}

interface Keywords {
  results: Keyword[];
}

interface Keyword {
  name: string;
  id: number;
}

interface Lists {
  page: number;
  results: List[];
  total_pages: number;
  total_results: number;
}

interface TMDBList {
  description: string;
  favorite_count: number;
  id: number;
  item_count: number;
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  poster_path: string | null;
}

interface Recommendations {
  page: number;
  results: RecommendedShow[];
  total_pages: number;
  total_results: number;
}

interface RecommendedShow {
  adult: boolean;
  backdrop_path: string | null;
  id: number;
  name: string;
  original_language: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  media_type: string;
  genre_ids: number[];
  popularity: number;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  origin_country: string[];
}

interface Reviews {
  page: number;
  results: any[];
  total_pages: number;
  total_results: number;
}

interface ScreenedTheatrically {
  results: any[];
}

interface Similar {
  page: number;
  results: SimilarShow[];
  total_pages: number;
  total_results: number;
}

interface SimilarShow extends RecommendedShow {}

interface Translations {
  translations: Translation[];
}

interface Translation {
  iso_3166_1: string;
  iso_639_1: string;
  name: string;
  english_name: string;
  data: TranslationData;
}

interface TranslationData {
  name: string;
  overview: string;
  homepage: string;
  tagline: string;
}

interface Videos {
  results: Video[];
}

interface Video {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
  id: string;
}

interface WatchProviders {
  results: {
    [key: string]: {
      link: string;
      flatrate?: Provider[];
      ads?: Provider[];
    };
  };
}

interface Provider {
  logo_path: string;
  provider_id: number;
  provider_name: string;
  display_priority: number;
}

export interface TrailerVideo {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  key: string;
  name: string;
  official: boolean;
  published_at: string;
  site: string;
  size: number;
  type: string;
}

type CountryAndNetwork = {
  label: string;
  value: string;
};

export interface DramaProduction {
  language: string[];
  country: CountryAndNetwork[];
  network: CountryAndNetwork[];
}
