import Section from "./component/ui/Main/Section";
import HeaderSlider from "./component/ui/Slider/HeaderSlider";

export default function Home() {
  return (
    <div className="relative bg-customLight dark:bg-customDark">
      <HeaderSlider />
      <Section />
    </div>
  );
}
