import { UseFormRegister, UseFormReset } from "react-hook-form";
import { TCreateList, TProfileSetting } from "./zod";
import { Prisma } from "@prisma/client";

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

export interface ICurrentUser {
  currentUser: currentUserProps;
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
  replies: Prisma.JsonValue[] | undefined; // Adjust this to match the type of replies in comment
  parentId: string | null;
  repliedUserId: string | null;
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

export interface DramaDB {
  id: string;
  userId: string;
  tv_id: string;
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
  genres_tags: Prisma.JsonValue[];
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

export interface ITmdbDrama {
  adult: boolean;
  backdrop_path: string;
  broadcast: {
    day: string[];
    time: string;
    all_episode: [{}];
  }[];
  created_by: any[];
  episode_run_time: any[];
  first_air_date: string;
  genres: any[];
  homepage: string;
  id: number;
  in_production: boolean;
  language: string[];
  last_air_date: string;
  last_episode_to_air: any;
  name: string;
  networks: any[];
  next_episode_to_air: any;
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: any[];
  production_countries: any[];
  seasons: any[];
  spoken_languages: any[];
  status: string;
  tagline: string;
  type: string[];
  vote_average: number;
  vote_count: number;
  release_date: string;
  end_date: string;
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

type TProfileFeeds = {
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
  tag: ITmdbDrama[];
  like: number;
  likeBy: string[];
  comment: Prisma.JsonValue[];
  createdAt: string;
  updatedAt: string;
};

export interface IProfileFeeds {
  getFeeds: TProfileFeeds[];
  currentUser: currentUserProps | null;
}

export interface IActor {
  cast: {
    adult: boolean;
    character: string;
    credit_id: string;
    gender: number;
    id: number;
    known_for_department: string;
    name: string;
    order: number;
    original_name: string;
    popularity: number;
    profile_path: string;
  }[];
  tvShow: {
    adult: boolean;
    backdrop_path: string;
    first_air_date: string;
    genre_ids: number[];
    id: number;
    name: string;
    origin_country: string[];
    original_language: string;
    original_name: string;
    overview: string;
    popularity: number;
    poster_path: string;
    vote_average: number;
    vote_count: number;
    cast: [
      {
        adult: boolean;
        character: string;
        credit_id: string;
        gender: number;
        id: number;
        known_for_department: string;
        name: string;
        order: number;
        original_name: string;
        popularity: number;
        profile_path: string;
      }
    ];
  };
}
