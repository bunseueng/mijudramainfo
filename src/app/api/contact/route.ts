import { sendEmail } from "@/lib/mails";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    if (!payload.name || !payload.email || !payload.message) {
      return NextResponse.json({error: "All field is required"}, {status: 400});
    }

    const subject = `New Contact Form Submission from ${payload.name}`;
    const html = `
      <h1>New Contact Form Submission</h1>
      <p><strong>Name:</strong> ${payload.name}</p>
      <p><strong>Email:</strong> ${payload.email}</p>
      <p><strong>Message:</strong> ${payload.message}</p>
    `;

        await sendEmail(payload.email, subject, html as any);


      return NextResponse.json({message: "Success"}, {status: 200});
  } catch (error: any) {
    console.error(error);
      return NextResponse.json({error: "Something went wrong!"}, {status: 500});
  }
}
