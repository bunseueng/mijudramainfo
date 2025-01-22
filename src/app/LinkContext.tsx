"use client";

import { createContext, useContext } from "react";
import NextLink, { type LinkProps } from "next/link";

type CustomLinkProps = LinkProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement>;

const CustomLink: React.FC<CustomLinkProps> = ({
  prefetch = false,
  ...props
}) => <NextLink {...props} prefetch={prefetch} />;

const LinkContext = createContext<React.FC<CustomLinkProps>>(CustomLink);

export const useLinkComponent = () => useContext(LinkContext);

type LinkProviderProps = {
  children: React.ReactNode;
  prefetch?: boolean;
};

export const LinkProvider: React.FC<LinkProviderProps> = ({
  children,
  prefetch = false,
}) => {
  const CustomLinkWithPrefetch: React.FC<CustomLinkProps> = (props) => (
    <CustomLink {...props} prefetch={prefetch} />
  );

  return (
    <LinkContext.Provider value={CustomLinkWithPrefetch}>
      {children}
    </LinkContext.Provider>
  );
};
