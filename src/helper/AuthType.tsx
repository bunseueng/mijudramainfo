import { UserRole } from "@prisma/client";

declare module "next-auth" {
  interface User {
    name: string;
    profileAvatar: string | null;
    role: UserRole;
  }

  interface Session {
    user: User & {
      name: string;
      profileAvatar: string | null;
    };
    token: {
      name: string;
      profileAvatar: string | null;
      role: UserRole;
    };
  }
}
