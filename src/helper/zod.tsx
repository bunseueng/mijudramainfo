import { any, z } from "zod";

export const signInForm = z.object({
  email: z.string().min(1, { message: "Email is required" }).email({
    message: "Must be a valid email",
  }),
  password: z
    .string()
    .min(6, { message: "Password must be atleast 6 characters" }),
});

export type TSignInForm = z.infer<typeof signInForm>;

export const signUpForm = z.object({
  name: z.string().min(3, { message: "Username is required" }),
  email: z.string().min(1, { message: "Email is required" }).email({
    message: "Must be a valid email",
  }),
  password: z
    .string()
    .min(6, { message: "Password must be atleast 6 characters" }),

  terms: z.literal(true, {
    errorMap: () => ({ message: "You must accept Terms and Conditions" }),
  }),
});

export type TSignUpForm = z.infer<typeof signUpForm>;

export const forgotPassword = z.object({
  email: z.string().email("This is not a valid email."),
});

export type TForgotPassword = z.infer<typeof forgotPassword>;

export const resetPassword = z
  .object({
    token: z.any(),
    password: z
      .string()
      .min(6, { message: "Password must be atleast 6 characters" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm Password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password don't match",
  });

export type TResetPassword = z.infer<typeof resetPassword>;

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
      id: any(),
      service: z
        .string()
        .min(3, { message: "Service provider is required" })
        .optional(),
      link: z.string().min(3, { message: "Page link is required" }),
      service_type: z
        .string()
        .min(3, { message: "Service type is required" })
        .optional(),
      availability: z.any(),
      subtitles: z.any(),
    })
    .optional(),
  released_information: z
    .object({
      name: z.any(),
      title: z.string().min(3, { message: "Please input some name" }),
      episode_start: z.any(),
      episode_end: z.any(),
      air_date: z.string().min(1, { message: "Please pick a date" }),
    })
    .optional(),
  production_information: z.object({}).optional(),
  genres_tags: z.object({}).optional(),
});

export type TCreateDetails = z.infer<typeof createDetails>;

export const externalLink = z.object({
  id: z.string().min(3, { message: "is required." }).optional(),
  url: z.string().min(3, { message: "is required." }).optional(),
  link_text: z.string().optional(),
  additional_text: z.string().optional(),
  selectedExternal: any(),
});

export type TExternalLink = z.infer<typeof externalLink>;

export const coin = z.object({
  email: z.any(),
  items: z.any(),
});

export type TCoin = z.infer<typeof externalLink>;

export const CreatePersonDetails = z.object({
  userId: z.string().optional(),
  tv_id: z.any(),
  details: z
    .object({
      stage_name: z.string().optional(),
      first_name: z.string().optional(),
      last_name: z.string().optional(),
      native_name: z.string().optional(),
      nationality: z.string().optional(),
      gender: z.string().optional(),
      also_known_as: z.string().optional(),
      biography: z.string().optional(),
      birthday: z.string().optional(),
      date_of_death: z.string().optional(),
    })
    .optional(),
  cover: z.string().optional(),
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
  external_links: z
    .object({
      facebook: z.string().optional(),
      instagram: z.string().optional(),
      tiktok: z.string().optional(),
      douyin: z.string().optional(),
      twitter: z.string().optional(),
      weibo: z.string().optional(),
      youtube: z.string().optional(),
      IMDB: z.string().optional(),
      wikidata: z.string().optional(),
      trakt: z.string().optional(),
      mdl: z.string().optional(),
    })
    .optional(),
});

export type TCreatePersonDetails = z.infer<typeof CreatePersonDetails>;
