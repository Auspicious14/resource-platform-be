import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config();

export const sendEmail = async (
  email: any,
  subject: any,
  html: any,
  text: any
) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      secure: true,
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const options = () => {
      return {
        from: `CV Builder <${process.env.EMAIL_USERNAME}>`,
        to: email,
        subject,
        html: html,
        text: text,
      };
    };

    await transporter.sendMail(options());
  } catch (error) {
    return error;
  }
};
