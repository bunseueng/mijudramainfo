import FeedsReport from "@/app/component/ui/emails/FeedsReport";
import prisma from "@/lib/db";
import { render } from "@react-email/components";
import { NextResponse } from "next/server";
import { sendEmailFromReport } from "../../../../../lib/mails";

export async function PATCH(request: Request, props: { params: Promise<{ name: string }> }) {
  const params = await props.params;
  const { email, reason, explanation } = await request.json();

  // Check if the user email exists
  const user = await prisma.user.findUnique({
    where: {
      email: email, // Use the correct email value
    },
  });

  if (!user) {
    return NextResponse.json({ message: "No user found with this email." }, { status: 404 });
  }

  await prisma.feeds.update({
    where: {
      username: params.name,
    },
    data: {
      report: [
        {
          reason: reason,          // Use reason instead of reportReason
          explanation: explanation, // Use explanation instead of reportExplanation
        },
      ],
    },
  });
  const url = `${process.env.APP_URL}/profile/${user.name}/feeds`
  try {
    const html = render(
      FeedsReport({
        params: {
          username: user.name,
          reason: reason,
          details: explanation,
          url
        },
      })
    );

     // Send email to user
     await sendEmailFromReport("MijuDramaInfo@gmail.com", email as string, `Report Request from ${user?.name}`, html);

    return NextResponse.json({
      status: 200,
      message: "Email sent successfully. Please check your email.",
    });
  } catch (error) {
    console.log("The error is", error);
    return NextResponse.json({
      status: 500,
      message: "Something went wrong. Please try again!",
    });
  }
}
  