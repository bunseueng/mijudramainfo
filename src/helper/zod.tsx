import { any, z } from "zod";

export const profileSetting = z.object({
  displayName: z.any(),
  country: z.any(),
  gender: z.any(),
  dateOfBirth: z.any(),
  biography: z.any(),
  profileAvatar: z.any(),
});

export type TProfileSetting = z.infer<typeof profileSetting>;

export const coverPhoto = z.object({
  coverPhoto: z.any(),
});

export type TCoverPhoto = z.infer<typeof coverPhoto>;

export const createList = z.object({
  type: z.any(),
  listTitle: z.any(),
  privacy: z.any(),
  description: z.string().optional(),
  sortby: z.any().optional(),
  userId: z.string().optional(),
  movieId: z.number().optional(),
  thumbnail: z.any().optional(),
  love: z.any().optional(),
  loveBy: z.any().optional(),
  dramaComment: z.string().optional(),
});

export type TCreateList = z.infer<typeof createList>;

export const createRating = z.object({
  userId: z.any().optional(),
  rating: z.any(),
  mood: z.any().optional(),
  emojiImg: z.any().optional(),
  movieId: z.any().optional(),
  tvId: z.number().optional(),
  status: z.any().optional(),
  episode: z.any().optional(),
  notes: z.any().optional(),
});

export type TCreateRating = z.infer<typeof createRating>;

export const addFriend = z.object({
  userId: z.any(),
  friendId: z.any(),
});

export type TAddFriend = z.infer<typeof createRating>;

export const comment = z.object({
  userId: z.string().optional(),
  love: z.any().optional(),
  loveBy: z.any().optional(),
});

export type TComment = z.infer<typeof comment>;

export const personLove = z.object({
  userId: z.string().optional(),
  love: z.number().optional(),
  loveBy: z.string().array().optional(),
});

export type TPersonLove = z.infer<typeof personLove>;

export const createDetails = z.object({
  userId: z.string().optional(),
  tv_id: z.any(),
  details: z
    .object({
      title: z.string().optional(),
      native_title: z.string().optional(),
      country: z.string().optional(),
      known_as: z.string().optional(),
      synopsis: z.string().optional(),
      content_type: z.string().optional(),
      content_rating: z.string().optional(),
      status: z.string().optional(),
      duration: z.string().optional(),
      episode: z.string().optional(),
    })
    .optional(),
  cover: z.string().optional(),
  related_title: z
    .object({
      drama: z.any(),
      story: z.string().optional(),
    })
    .optional(),
  cast: z
    .array(
      z.object({
        person: z.any(),
        cast_role: z.string().optional(),
        character: z.string().optional(),
      })
    )
    .optional(),
  crew: z
    .array(
      z.object({
        person: z.any(),
        job: z.string().optional(),
      })
    )
    .optional(),
  services: z
    .object({
      service: z.string().min(3, { message: "Service provider is required" }),
      link: z.string().min(3, { message: "Page link is required" }),
      service_type: z.string().min(3, { message: "Service type is required" }),
      availability: z.any(),
      subtitles: z.any(),
    })
    .optional(),
  released_information: z.object({}).optional(),
  production_information: z.object({}).optional(),
  genres_tags: z.object({}).optional(),
});

export type TCreateDetails = z.infer<typeof createDetails>;
