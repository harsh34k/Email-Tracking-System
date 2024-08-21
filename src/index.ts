import { Hono } from 'hono'
import { cors } from "hono/cors"
import trackMailRoute from "../api/track-mail"
import sendMailRoute from "../api/send-mail"
import getMailStatusRoute from "../api/get-mail-status"
import dashBoardRoute from "../api/dashBoard"
import { dbConnect } from './config/db.config'
const app = new Hono()
dbConnect()

app.use(cors())

//routes
app.route("/track", trackMailRoute);
app.route("/dashboard", dashBoardRoute);
app.route("/api", sendMailRoute);
app.route('/status', getMailStatusRoute)
app.get("/", async (c) => {
    return c.json({ msg: "Welcome to the app" });
})


export default app


