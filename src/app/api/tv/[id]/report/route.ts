import prisma from "@/lib/db";
import { render } from "@react-email/components";
import { NextResponse } from "next/server";
import { sendEmailFromReport } from "../../../../../lib/mails";
import DramaReport from "@/app/component/ui/emails/DramaReport";
import { getCurrentUser } from "@/app/actions/getCurrentUser";

export async function PATCH(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const { problemType, extraDetails, type } = await request.json();

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const tv = await prisma.drama.findUnique({
    where: {
      tv_id: params.id, // Use the correct email value
    },
  });

  const url = `${process.env.APP_URL}/tv/${params.id}`;
  const existingReport = tv?.report || [];
  const report = [
    {
      problemType: problemType, // Use reason instead of reportReason
      extraDetails: extraDetails, // Use explanation instead of reportExplanation
      url,
      type,
    },
    ...existingReport,
  ];
  if (!tv) {
    await prisma.drama.create({
      data: {
        userId: user.id,
        tv_id: params.id,
        report: report as any,
      },
    });
    return NextResponse.json({ message: "Email sent successfully. Please check your email." }, { status: 200 });
  } else {
    await prisma.drama.update({
      where: {
        tv_id: params.id,
      },
      data: {
        report: report as any,
      },
    });
  }

  try {
    const html = render(
      DramaReport({
        params: {
          username: user?.displayName || (user?.name as string),
          problemType: problemType,
          extraDetails: extraDetails,
          url,
        },
      })
    );

    // Send email to user
    await sendEmailFromReport(
      user?.email as string,
      `Report Request from ${user?.name}`,
      html as any,
      user?.email as string
    );

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
