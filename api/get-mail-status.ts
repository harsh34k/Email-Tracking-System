import { Hono } from 'hono';
import Track from '../model/track-model';

const app = new Hono();

app.get('/get-mail-status/:id', async (c) => { // Removed extra quotation mark in the route
    const id = c.req.param('id');

    if (!id) {
        return c.json({ error: "Tracking ID is required" }, 400); // Added 400 Bad Request status code for missing ID
    }

    try {
        const track = await Track.findOne({ trackingId: id });

        if (!track) {
            return c.json({ error: "Tracking ID not found" }, 404); // Added 404 Not Found status code for missing tracking record
        }

        return c.json({ data: track }, 200); // Explicitly set the 200 OK status
    } catch (error) {
        console.error("Error fetching email status:", error);
        return c.json({ error: "Failed to get email status" }, 500); // Added 500 Internal Server Error status code for errors
    }
});

export default app;
