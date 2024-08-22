import { Hono } from 'hono';
import { v4 as uuid } from 'uuid';
import Track from '../model/track-model';
import * as crypto from 'crypto-js';


// Create a function to generate the HTML with tracking pixel
// const generateEmailHtml = (targetEmail: string, trackingId: string): string => {
//     const encodedEmail = encodeURIComponent(targetEmail);
//     const trackingUrl = `${process.env.BASE_URL}/track/track-mail/${trackingId}?email=${encodedEmail}`;
//     return `<div>
// <img src="${trackingUrl}" alt="Tracking Pixel" style="display: none;"/>
// </div>`;
// };
const generateEmailHtml = (targetEmail: string, trackingId: string): string => {
    const token = crypto.SHA256(targetEmail).toString(crypto.enc.Hex);
    const trackingUrl = `${process.env.BASE_URL}/track/track-mail/${trackingId}?email=${encodeURIComponent(targetEmail)}&token=${token}`;
    return `<div><img src="${trackingUrl}" alt="Tracking Pixel" style="display: none;"/></div>`;
};

const app = new Hono();

app.post('/send-mail', async (c) => {
    const { email, targetEmail, } = await c.req.json();

    // Basic checks
    if (!email || !targetEmail) {
        return c.json({ error: "Email, password, target email, and message are required" }, 400);
    }
    const userIP = "0.0.0.0";
    // if (password !== Bun.env.PASSWORD) {
    //     return c.json({ error: "Wrong password" }, 403);
    // }

    // Generate tracking ID and store in the database
    const trackingId = uuid();
    try {
        await Track.create({ trackingId, userActions: [{ email: targetEmail, ip: userIP }] });

        // Generate HTML with tracking pixel
        const htmlContent = generateEmailHtml(targetEmail, trackingId);

        return c.json({
            trackingId: trackingId,
            html: htmlContent,
            message: "HTML content generated successfully"
        });
    } catch (error) {
        console.error(error);
        return c.json({ error: "Failed to generate HTML" }, 500);
    }
});

export default app;
