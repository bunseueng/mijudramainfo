import { genres } from "@/helper/item-list";

export const getGenreName = (id: string) => {
    const genre = genres.find((g) => g.id.includes(id));
    return genre ? genre.value : "";
  };