import { createTransport } from "nodemailer";

const transport = createTransport({
    host: "smtp.gmail.com",
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    }
});

export const sendMail = async (email: string, targetEmail: string, message: string, trackingId: string) => {
    const encodedEmail = encodeURIComponent(targetEmail);
    const trackingURL = `${Bun.env.BASE_URL}/track/track-mail/${trackingId}?email=${encodedEmail}`;

    const mailOptions = {
        from: email,  // The sender's email
        to: targetEmail,  // The recipient's email
        subject: "You've Got a Tracked Email!",
        html: `
            <p>${message}</p>
            <p>Best regards,</p>
            <p>Your Company Name</p>
            <img src="${trackingURL}" alt="dead pixel" style="display: none;"/>
        `
    };

    try {
        await transport.sendMail(mailOptions);
        console.log(`Email sent successfully to ${targetEmail}`);
    } catch (error) {
        console.error(`Failed to send email to ${targetEmail}:`, error);
        throw new Error("Failed to send email");
    }
};

