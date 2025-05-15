import nodemailer from "nodemailer";

interface MailOptions {
  from?: string | undefined;
  to: string | string[];
  subject: string;
  html: string;
}

const { EMAIL_PASS, EMAIL_PORT, EMAIL_HOST, EMAIL_USER, EMAIL_SERVICE, EMAIL_NAME } = process.env;

const sendEmail = async (mailOptions: MailOptions) => {
  try {
    const transporter: any = nodemailer.createTransport({
      service: EMAIL_SERVICE,
      host: EMAIL_HOST,
      port: EMAIL_PORT,
      secure: false,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    } as any);

    if (!mailOptions.from) {
      mailOptions.from = `${EMAIL_NAME} <${EMAIL_USER}>`;
    }

    await transporter.sendMail(mailOptions);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: "Failed to send email" };
  }
};

export default sendEmail;
