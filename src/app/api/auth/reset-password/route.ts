import prisma from "@/lib/db";
import Cryptr from "cryptr";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

type ResetPasswordPayload = {
  email: string;
  signature: string;
  password: string;
  confirmPassword: string;
};

export async function POST(request: NextRequest) {
  try {
    const payload: ResetPasswordPayload = await request.json();

    // Decrypt email
    const crypter = new Cryptr(process.env.NEXTAUTH_SECRET!);
    const email = crypter.decrypt(payload.email);

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "Reset URL is not correct. Please double check it.",
        },
        { status: 404 }
      );
    }

    const passwordResetTokenExpiry = user.passwordResetTokenExpiry;

    if (!passwordResetTokenExpiry) {
      return NextResponse.json(
        { message: "Invalid token or has expired. Please try again" },
        { status: 400 }
      );
    }

    const today = new Date();

    if (today > passwordResetTokenExpiry) {
      return NextResponse.json(
        { message: "Invalid token or has expired. Please try again" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(payload.password, 12);

    await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        hashedPassword,
        token: null,
        passwordResetTokenExpiry: null,
      },
    });

    return NextResponse.json(
      {
        message: "Password changed successfully. Please login with new password.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { message: "An error occurred while resetting the password" },
      { status: 500 }
    );
  }
}