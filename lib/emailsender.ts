import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type sendEmail = {
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  text: string;
};

export async function SendEmail(data: sendEmail) {
  await resend.emails.send(data);
}
