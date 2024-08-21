import { Hono } from 'hono';
import Track from '../model/track-model';

const app = new Hono();

// Endpoint to get all tracking records for the dashboard
app.get('/dashboard', async (c) => {
    try {
        // Fetch all tracking records from the database
        const tracks = await Track.find({});

        // Check if there are no records
        if (!tracks.length) {
            return c.json({ message: "No records found" }, 404); // Return 404 Not Found if no records exist
        }

        // Return the records with a 200 OK status
        return c.json({ data: tracks }, 200);
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        return c.json({ error: "Failed to get dashboard data" }, 500); // Return 500 Internal Server Error for errors
    }
});

export default app;
