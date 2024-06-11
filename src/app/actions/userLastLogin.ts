import prisma from "@/lib/db";
import moment from "moment"; // Import Moment.js

export async function updateUserLastLogin(req: Request) {
  try {
    const {email} = await req.json()
    await prisma.user.update({
      where: { email },
      data: { lastLogin: moment().toISOString() }, // Use Moment.js to get the current date and time
    });
    console.log("User last login updated successfully!");
  } catch (error) {
    console.log("Error updating user last login:", error);
    throw new Error("Error updating user last login");
  }
}
