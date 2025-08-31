import express from "express";
import dotenv from 'dotenv';
import connectDb from "../db.js";
import allRouter from "./controllers/Allrouter.js";
import cors from "cors";
import path from "path";
import uploadRouter from "./controllers/upload.js";
import { fileURLToPath } from 'url'; 

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

app.use(express.json());


connectDb();
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// REST API for uploads
app.use('/api/upload', uploadRouter);

app.use("/api", allRouter);

export default app;
