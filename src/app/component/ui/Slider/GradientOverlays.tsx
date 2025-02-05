import React from "react";

interface GradientOverlaysProps {
  left: string;
  right: string;
  center: string;
}

const GradientOverlays: React.FC<GradientOverlaysProps> = ({
  left,
  right,
  center,
}) => (
  <div className="max-w-[1808px] w-full h-full absolute top-0 right-0 left-0 mx-auto flex justify-between z-[100]">
    <div className="h-full w-[30%]" style={{ background: left }} />
    <div
      className="absolute top-0 w-full h-[120px]"
      style={{ background: center }}
    />
    <div className="h-full w-[15%]" style={{ background: right }} />
  </div>
);

export default React.memo(GradientOverlays);
