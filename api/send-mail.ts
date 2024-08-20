// import { Hono } from 'hono'
// import { v4 as uuid } from "uuid"
// import Track from '../model/track-model';
// import { sendMail } from '../utils/sendMail';
// const app = new Hono()

// app.post('/send-mail', async (c) => {
//     const { email, password } = await c.req.json();
//     //checks
//     if (!email || !password) return c.json({ error: "Email and password are required" });
//     if (password !== Bun.env.PASSWORD) return c.json({ error: "wrong password" });

//     //tracking id, data store => db
//     const trackingId = uuid();
//     try {
//         await Track.create({ trackingId })
//         await sendMail(email, trackingId);

//         return c.json({
//             trackingId: trackingId,
//             message: "Email sent succesfully"
//         })
//     } catch (error) {
//         console.log(error);
//         return c.json({ error: "failed to send email" })

//     }

// })

// export default app
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
        await Track.create({
            trackingId,
            userActions: [{ email, ip: null }]
        });
        await sendMail(email, trackingId);

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
