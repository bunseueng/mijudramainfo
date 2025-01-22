"use client";

import { useLinkComponent } from "@/app/LinkContext";

const Link = (
  props: React.ComponentProps<ReturnType<typeof useLinkComponent>>
) => {
  const LinkComponent = useLinkComponent();
  return <LinkComponent {...props} />;
};

export default Link;
