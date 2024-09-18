import React from "react";
import dynamic from "next/dynamic";
const HeaderSlider = dynamic(() => import("../Slider/HeaderSlider"));

const Header = async () => {
  return <HeaderSlider />;
};

export default Header;
