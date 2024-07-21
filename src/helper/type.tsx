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
  public_id: string | null;
  name: string;
  displayName: string | null;
  email: string;
  emailVerified: string | null;
  image: string | null;
  country: string | null;
  gender: string;
  dateOfBirth: Date | null;
  biography: string | null;
  coverPhoto: string | null;
  profileAvatar: string | null;
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
  public_id: string | null;
  name: string;
  displayName: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  country: string | null;
  gender: string;
  role: string;
  dateOfBirth: Date | null;
  biography: string | null;
  coverPhoto: string | null;
  profileAvatar: string | null;
  followers: string[];
  following: string[];
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUser {
  user: UserProps | null;
}

export interface findSpecificUserProps {
  id: string;
  public_id: string | null;
  name: string;
  displayName: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  country: string | null;
  gender: string;
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
  register: UseFormRegister<TCreateList>;
  reset: UseFormReset<TCreateList>;
  handleSubmit: (data: any) => void;
}

export interface CommentProps {
  id: string;
  message: string;
  userId: string;
  postId: string;
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

export interface EditDramaPage {
  availability: {
    label: string;
    value: string;
  }[];
  id: string;
  link: string;
  public_id: string;
  service: string;
  service_logo: string;
  service_name: string;
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
}
[];

export interface EditPageDefaultvalue {
  service_name: string;
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
