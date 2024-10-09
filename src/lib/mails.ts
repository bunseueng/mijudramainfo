import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST!,
    port: Number(process.env.EMAIL_PORT) || 0,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
})

// To send the email

export const sendEmail = async (
    to: string,
    subject: string,
    html: string
  ): Promise<string | null> => {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: to,
      subject: subject,
      html: html,
    });
  
    return info?.messageId;
}

export const sendEmailFromReport = async (
  from: string,
  subject: string,
  html: string,
  replyTo: string
): Promise<string | null> => {
  const info = await transporter.sendMail({
    from: from,
    to: process.env.EMAIL_FROM,
    subject: subject,
    html: html,
    replyTo: replyTo,
  });

  return info?.messageId;
}