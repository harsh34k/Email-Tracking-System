// import { Hono } from 'hono';
// import { v4 as uuid } from 'uuid';
// import Track from '../model/track-model';
// import * as crypto from 'crypto-js';
// import { getConnInfo } from 'hono/bun';
// const ip = require('ip');

// // Function to generate the HTML with tracking pixel
// const generateEmailHtml = (targetEmail: string, trackingId: string): string => {
//     const token = crypto.SHA256(targetEmail).toString(crypto.enc.Hex);
//     const trackingUrl = `${process.env.BASE_URL}/track/track-mail/${trackingId}?email=${encodeURIComponent(targetEmail)}&token=${token}`;
//     return `<div><img src="${trackingUrl}" alt="Tracking Pixel" style="display: none;"/></div>`;
// };

// const app = new Hono();

// app.post('/send-mail', async (c) => {
//     console.log("Request raw data:", c.req.raw);

//     const { email, targetEmail } = await c.req.json();

//     // Basic checks
//     if (!email || !targetEmail) {
//         return c.json({ error: "Email and target email are required" }, 400);
//     }

//     // Capture the sender's IP address from the request headers
//     let senderIP: string;

//     try {
//         senderIP = ip.address(); // Fallback to server's local IP
//     } catch (error) {
//         console.error("Failed to retrieve sender IP:", error);
//         senderIP = "0.0.0.0"; // Fallback IP in case of an error
//     }
//     console.log("Sender IP:", senderIP);


//     console.log("Sender IP:", senderIP);

//     // Generate tracking ID and store in the database
//     const trackingId = uuid();
//     try {
//         await Track.create({
//             trackingId,
//             senderEmail: email,
//             senderIP: senderIP,
//             receiverEmail: targetEmail,
//             receiverIP: "0.0.0.0", // Initialized and will be updated when the email is opened
//             opens: 0, // Starts with 0 opens
//         });

//         // Generate HTML with tracking pixel
//         const htmlContent = generateEmailHtml(targetEmail, trackingId);

//         return c.json({
//             trackingId,
//             html: htmlContent,
//             message: "HTML content generated successfully"
//         });
//     } catch (error) {
//         console.error("Failed to store tracking data:", error);
//         return c.json({ error: "Failed to generate HTML" }, 500);
//     }
// });

// export default app;
import { Hono } from 'hono';
import { v4 as uuid } from "uuid";
import Track from '../model/track-model';
import { sendMail } from '../utils/sendMail';

const app = new Hono();

app.post('/send-mail', async (c) => {
    const { email, password } = await c.req.json();
    if (!email || !password) return c.json({ error: "Email and password are required" });
    if (password !== Bun.env.PASSWORD) return c.json({ error: "wrong password" });

    const trackingId = uuid();
    try {
        // Handle a single email string instead of an array
        // const singleEmail = Array.isArray(email) ? email[0] : email;

        await Track.create({
            trackingId,
        });
        await sendMail(email, trackingId); // Pass as string if single email

        return c.json({
            trackingId: trackingId,
            message: "Email sent successfully"
        });
    } catch (error) {
        console.log(error);
        return c.json({ error: "failed to send email" });
    }
});



export default app;