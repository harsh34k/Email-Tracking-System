// import { html } from "hono/html";
// import { createTransport } from "nodemailer";

// const transport = createTransport({
//     host: "smtp.gmail.com",
//     auth: {
//         user: process.env.MAIL_USER,
//         pass: process.env.MAIL_PASSWORD
//     }
// });
// export const sendMail = async (emails: string[], trackingId: string) => {
//     const trackingURL = `${Bun.env.BASE_URL}/track/track-mail/${trackingId}`;
//     const mailOptions = {
//         from: process.env.Mail_USER,
//         to: emails,
//         subject: "Tracking dead pixel ID",
//         html: `
//         <h1>Tracking ID: ${trackingId}</h1>
//         <img src="${trackingURL}" alt="dead pixel"
//         style="display: none;"/>

//         `
//     }
//     try {

//         await transport.sendMail(mailOptions)
//     } catch (error) {

//         console.log(error);

//         throw new Error("Failed to send email");
//     }
// }

import { html } from "hono/html";
import { createTransport } from "nodemailer";

const transport = createTransport({
    host: "smtp.gmail.com",
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    }
});

// export const sendMail = async (emails: string[], trackingId: string) => {
//     const trackingURL = `${Bun.env.BASE_URL}/track/track-mail/${trackingId}`;
//     const mailOptions = {
//         from: process.env.Mail_USER,
//         to: emails,
//         subject: "Tracking dead pixel ID",
//         html: `
//         <h1>Tracking ID: ${trackingId}</h1>
//         <img src="${trackingURL}" alt="dead pixel"
//         style="display: none;"/>
//         `
//     };

//     try {
//         await transport.sendMail(mailOptions);
//     } catch (error) {
//         console.log(error);
//         throw new Error("Failed to send email");
//     }
// };

export const sendMail = async (emails: string[], trackingId: string) => {
    emails.forEach(async (email) => {
        const encodedEmail = encodeURIComponent(email);
        const trackingURL = `${Bun.env.BASE_URL}/track/track-mail/${trackingId}?email=${encodedEmail}`;
        const mailOptions = {
            from: process.env.MAIL_USER,
            to: email,
            subject: "Tracking dead pixel ID",
            html: `
            <h1>Tracking ID: ${trackingId}</h1>
            <img src="${trackingURL}" alt="dead pixel" style="display: none;"/>
            `
        };
        try {
            await transport.sendMail(mailOptions);
        } catch (error) {
            console.log(error);
            throw new Error("Failed to send email");
        }
    });
};

