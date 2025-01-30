import prisma from "@/lib/db";
import { render } from "@react-email/components";
import { NextResponse } from "next/server";
import { sendEmailFromReport } from "../../../../../lib/mails";
import DramaReport from "@/app/component/ui/emails/DramaReport";
import { getCurrentUser } from "@/app/actions/getCurrentUser";

export async function PATCH(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const {problemType, extraDetails, type } = await request.json();

  const user = await getCurrentUser()
  if(!user) {
    return NextResponse.json({message: "Unauthorized"}, {status: 401
    })
  }
  const person = await prisma.person.findUnique({
    where: {
      personId: params.id, // Use the correct email value
    },
  });


  const url = `${process.env.APP_URL}/person/${params.id}`
  const  existingReport = person?.report || []
  const report = [
    {
      problemType: problemType, // Use reason instead of reportReason
      extraDetails: extraDetails, // Use explanation instead of reportExplanation
      url,
      type
    },
    ...existingReport
  ]

  if (!person) {
    await prisma.person.create({
      data: {
        personId: params.id,
        report: report as any
      },
    });
  } else {
    await prisma.person.update({
      where: {
        personId:  params.id,
      },
      data: {
        report: report as any
      },
    });
  }
  try {
    const html = render(
      DramaReport({
        params: {
          username: user?.displayName || user?.name as string,
          problemType: problemType,
          extraDetails: extraDetails,
          url
        },
      })
    );

    // Send email to user
    await sendEmailFromReport("MijuDramaInfo@gmail.com", `Report Request from ${user?.name}`, html as any, user?.email as string);

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
  