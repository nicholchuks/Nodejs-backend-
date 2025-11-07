import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: process.env.SMTP_PORT || 587,
      secure: false, // use SSL (465) or TLS (587)
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email options
    const mailOptions = {
      from: `"Task Tracker App" <${process.env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Email send failed:", error);
    throw new Error("Email could not be sent");
  }
};

export default sendEmail;
