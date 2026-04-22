import express from "express";
import dotenv from "dotenv"
import authRoutes from "./routes/auth.route.js"
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import messageRoute from "./routes/message.route.js"
import cors from "cors";

dotenv.config();
const app = express();
const PORT = process.env.PORT
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());


app.use(cors({
     origin: ["http://localhost:5173", "http://13.60.183.125"],
    credentials:true
}));


app.use("/api/auth" , authRoutes);
app.use("/api/message",messageRoute);

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
    connectDB();
});
