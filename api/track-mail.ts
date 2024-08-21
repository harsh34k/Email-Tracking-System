import { Hono } from "hono";
import { getConnInfo } from 'hono/bun';
import Track from "../model/track-model";
import { promises as fs } from "fs";

const app = new Hono();
let imageBuffer: Buffer | null = null;

// Load the tracking pixel image into memory
(async () => {
    try {
        imageBuffer = await fs.readFile(__dirname + "/assets/images.jpeg");
    } catch (error) {
        console.error("Error reading image file:", error);
    }
})();

app.get('/track-mail/:id', async (c) => {
    const id = c.req.param('id');
    const userIP = c.req.raw.headers.get('true-client-ip') || c.req.raw.headers.get('cf-connecting-ip') || getConnInfo(c).remote.address || "0.0.0.0";

    // Fetch the tracking record from the database
    const track = await Track.findOne({ trackingId: id });
    if (!track) {
        return c.json({ error: "Tracking ID not found" }, 404);
    }

    // Extract email from query parameters
    const email = c.req.query('email'); // Assuming email is passed as a query parameter

    // Update the tracking record if the email and IP are unique
    if (email) {
        const existingAction = track.userActions.find(action => action.email === email && action.ip === userIP);
        if (!existingAction) {
            track.userActions.push({ email, ip: userIP });
            track.opens++;
            await track.save();
        }
    }

    // Ensure image buffer is available
    if (!imageBuffer) {
        return c.json({ error: "Image not available" }, 500);
    }

    // Return the image buffer as the response
    return new Response(imageBuffer, {
        headers: {
            'Content-Type': 'image/jpeg',
            'Cache-Control': 'no-cache',
            "Content-Length": imageBuffer.length.toString(),
        }
    });
});

export default app;
