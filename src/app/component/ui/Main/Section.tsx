import SectionContent from "./SectionContent";
import { DramaDB } from "@/helper/type";

export type HomeDramaT = {
  heading: string;
  getDrama: DramaDB[];
  existingRatings: any;
  categoryData: any;
  isDataLoading: boolean;
  path: string;
};

export default async function Section() {
  return <SectionContent />;
}
