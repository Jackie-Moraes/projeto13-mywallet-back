import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import { signIn, signUp } from "./controllers/authController.js";
import { cashIn, cashOut } from "./controllers/balanceController.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());





app.post('/sign-up', signUp);
app.post('/sign-in', signIn);
app.post('/cash-in', cashIn);
app.post('/cash-out', cashOut);

app.listen(process.env.PORTA);