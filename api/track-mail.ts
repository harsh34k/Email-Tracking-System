// import { Hono } from "hono";
// import { getConnInfo } from 'hono/bun';
// import Track from "../model/track-model";
// import { promises as fs } from "fs";
// const app = new Hono();
// let imageBuffer: Buffer;
// (
//     async () => {
//         try {
//             imageBuffer = await fs.readFile(__dirname + "./assets/images.jpeg")
//         } catch (error) {
//             console.log(error);
//         }
//     })();
// app.get('/track-mail/:id', async (c) => {
//     const id = c.req.param('id');
//     //getting user IP address
//     const userIP = c.req.raw.headers.get('true-client-ip') || c.req.raw.headers.get('cf-connecting-ip') || getConnInfo(c).remote.address || "0.0.0.0"
//     //checks
//     if (!id) return c.json({ error: "Tracking ID is required" })
//     try {
//         const track = await Track.findOne({ trackingId: id })
//         if (!track) return c.json({ error: "Tracking ID not found" })
//         //check if user already opened the email
//         if (!track.userIPs.includes(userIP)) {
//             track.userIPs.push(userIP)
//             track.opens++
//             await track.save()
//         }
//         return new Response(imageBuffer, {
//             headers: {
//                 'Content-Type': 'image/jpeg',
//                 'Cache-Control': 'no-cache',
//                 "content-length": imageBuffer.length.toString()
//             }
//         })


//     } catch (error) {
//         console.log(error)
//         return c.json({ error: " Failed to track email" })
//     }
// })

// export default app;

import { Hono } from "hono";
import { getConnInfo } from 'hono/bun';
import Track from "../model/track-model";
import { promises as fs } from "fs";

const app = new Hono();
let imageBuffer: Buffer;

(async () => {
    try {
        imageBuffer = await fs.readFile(__dirname + "./assets/images.jpeg");
    } catch (error) {
        console.log(error);
    }
})();

app.get('/track-mail/:id', async (c) => {
    const id = c.req.param('id');
    const userIP = c.req.raw.headers.get('true-client-ip') || c.req.raw.headers.get('cf-connecting-ip') || getConnInfo(c).remote.address || "0.0.0.0";

    const track = await Track.findOne({ trackingId: id });
    if (!track) return c.json({ error: "Tracking ID not found" });

    const email = c.req.query('email'); // Assuming email is passed as a query param

    if (email && !track.userActions.some(action => action.email === email && action.ip === userIP)) {
        track.userActions.push({ email, ip: userIP });
        track.opens++;
        await track.save();
    }

    return new Response(imageBuffer, {
        headers: {
            'Content-Type': 'image/jpeg',
            'Cache-Control': 'no-cache',
            "content-length": imageBuffer.length.toString()
        }
    });
});

export default app;
