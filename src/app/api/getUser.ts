// pages/api/getUser.ts

import prisma from "@/lib/db";


export default async function handler(req: any, res: any) {
  try {
    const { userName } = req.query;
    const currentUser = await prisma.user.findUnique({
      where: {
        name: userName as string,
      },
    });
    res.status(200).json(currentUser);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user" });
  }
}
