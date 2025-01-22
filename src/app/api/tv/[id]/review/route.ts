import { getCurrentUser } from "@/app/actions/getCurrentUser";
import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    try {
      const currentUser = await getCurrentUser();
  
      if (!currentUser) {
        console.error("Invalid User");
        return NextResponse.json({ message: "Invalid User" }, { status: 400 });
      }
  
      const {
        tv_id,
        userInfo,
        rating_score,
        spoiler,
        finishedWatching,
        dropping,
        review_language,
        episode,
        headline,
        review,
        overall_score,
      } = await req.json();

      const missingFields = [];
      if (!tv_id) missingFields.push("tv_id");
      if (!userInfo) missingFields.push("userInfo");
      if (rating_score === undefined || rating_score === null) missingFields.push("rating_score");
      if (spoiler === undefined || spoiler === null) missingFields.push("spoiler");
      if (finishedWatching === undefined || finishedWatching === null) missingFields.push("finishedWatching");
      if(finishedWatching === false) {
        if (dropping === undefined || dropping === null) missingFields.push("dropping");
        if (episode === undefined || episode === null) missingFields.push("episode");
      }
      if (!review_language) missingFields.push("review_language");
      if (!headline) missingFields.push("headline");
      if (!review) missingFields.push("review");
      if (overall_score === undefined || overall_score === null) missingFields.push("overall_score");
  
      if (missingFields.length > 0) {
        return NextResponse.json(
          { message: `Missing required fields: ${missingFields.join(", ")}` },
          { status: 404 }
        );
      }
  
  
      const createDetails = await prisma.tvReview.create({
        data: {
          userId: currentUser.id,
          tv_id,
          userInfo,
          rating_score,
          spoiler,
          finishedWatching,
          dropping,
          review_language,
          episode,
          headline,
          review,
          overall_score,
        },
      });

      await prisma.user.update({
        where: { id: currentUser.id },
        data: {
          points: { increment: 5 }, // Increment by a certain number of points
        },
      });
  
        return NextResponse.json({ createDetails, message: "Success" }, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error }, { status: 500 });
    }
}

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      console.error("Invalid User");
      return NextResponse.json({ message: "Invalid User" }, { status: 400 });
    }

    const { feedback } = await req.json();

    const findExistingReview = await prisma.tvReview.findUnique({
      where: {
        tv_id: params.id, // Use the correct identifier
      },
    });

    if (!findExistingReview) {
      return NextResponse.json({ message: "Review Not Found" }, { status: 404 });
    }

    // Handle reviewBy as an array of JSON objects
    let reviewByArray: any[] = Array.isArray(findExistingReview.reviewBy)
      ? (findExistingReview.reviewBy as any[])
      : [];

    const existingUserActionIndex = reviewByArray.findIndex(item => item.userId === currentUser.id);
    let updateData = {};

    if (feedback === "Cancel") {
      if (existingUserActionIndex !== -1) {
        const previousAction = reviewByArray[existingUserActionIndex].action;

        // Decrement the appropriate counter based on previous action
        if (previousAction === "Yes") {
          updateData = {
            reviewHelpful: { decrement: 1 },
          };
        } else if (previousAction === "No") {
          updateData = {
            reviewNotHelpful: { decrement: 1 },
          };
        }

        // Remove the user's action from reviewBy array
        reviewByArray = reviewByArray.filter(item => item.userId !== currentUser.id);

        // Update the reviewBy array in the updateData
        updateData = {
          ...updateData,
          reviewBy: reviewByArray,
        };
      }
    } else {
      if (existingUserActionIndex !== -1) {
        const previousAction = reviewByArray[existingUserActionIndex].action;

        if (previousAction === "Yes" && feedback === "No") {
          updateData = {
            reviewHelpful: { decrement: 1 },
            reviewNotHelpful: { increment: 1 },
          };
        } else if (previousAction === "No" && feedback === "Yes") {
          updateData = {
            reviewHelpful: { increment: 1 },
            reviewNotHelpful: { decrement: 1 },
          };
        }

        // Update the user's action in the reviewBy array
        reviewByArray[existingUserActionIndex].action = feedback;
      } else {
        // Add the userId if not already present
        reviewByArray.push({ userId: currentUser.id, action: feedback });

        // Depending on the feedback, increment the respective counter
        updateData = feedback === "Yes"
          ? { reviewHelpful: { increment: 1 } }
          : { reviewNotHelpful: { increment: 1 } };
      }

      // Include the updated reviewBy array in the updateData
      updateData = {
        ...updateData,
        reviewBy: reviewByArray,
      };
    }

    // Update the review in the database
    const updatingReview = await prisma.tvReview.update({
      where: { id: findExistingReview.id },
      data: updateData,
    });

    return NextResponse.json({ updatingReview, message: "Success" }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}


  
export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const findReleaseInfo = await prisma?.tvReview.findUnique({
      where: {
        tv_id: params.id
      }
    });
    return NextResponse.json({ findReleaseInfo, message: "Success" }, { status: 200 });
  } catch (error: any) {
    console.log(error.message);
  }
}
