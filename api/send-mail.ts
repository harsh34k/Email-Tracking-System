import { Hono } from 'hono';
import { v4 as uuid } from 'uuid';
import Track from '../model/track-model';
import * as crypto from 'crypto-js';
import { getConnInfo } from 'hono/bun';

// Function to generate the HTML with tracking pixel
const generateEmailHtml = (targetEmail: string, trackingId: string): string => {
    const token = crypto.SHA256(targetEmail).toString(crypto.enc.Hex);
    const trackingUrl = `${process.env.BASE_URL}/track/track-mail/${trackingId}?email=${encodeURIComponent(targetEmail)}&token=${token}`;
    return `<div><img src="${trackingUrl}" alt="Tracking Pixel" style="display: none;"/></div>`;
};

const app = new Hono();

app.post('/send-mail', async (c) => {
    const { email, targetEmail } = await c.req.json();

    // Basic checks
    if (!email || !targetEmail) {
        return c.json({ error: "Email and target email are required" }, 400);
    }

    // Capture the sender's IP address from the request headers
    let senderIP: string;

    try {
        senderIP = c.req.raw.headers.get('true-client-ip')
            || c.req.raw.headers.get('cf-connecting-ip')
            || getConnInfo(c)?.remote?.address
            || "0.0.0.0";
    } catch (error) {
        console.error("Failed to retrieve sender IP:", error);
        senderIP = "0.0.0.0"; // Fallback IP in case of an error
    }

    // Generate tracking ID and store in the database
    const trackingId = uuid();
    try {
        // Store sender's and target's information separately
        await Track.create({
            trackingId,
            senderEmail: email,
            senderIP: senderIP,
            receiverEmail: targetEmail,
            receiverIP: "0.0.0.0", // Initialized and will be updated when the email is opened
            opens: 0, // Starts with 0 opens
        });

        // Generate HTML with tracking pixel
        const htmlContent = generateEmailHtml(targetEmail, trackingId);

        return c.json({
            trackingId,
            html: htmlContent,
            message: "HTML content generated successfully"
        });
    } catch (error) {
        console.error(error);
        return c.json({ error: "Failed to generate HTML" }, 500);
    }
});

export default app;
