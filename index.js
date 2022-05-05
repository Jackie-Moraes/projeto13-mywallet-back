import express from "express";
import cors from "cors";
import joi from "joi";
import { MongoClient } from "mongodb";
import bcrypt from 'bcrypt';
import {v4} from "uuid";
import dotenv from "dotenv";
import { signIn, signUp } from "./controllers/authController";
import { cashIn, cashOut } from "./controllers/balanceController";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const mongoClient = new MongoClient(process.env.MONGO_URI);
await mongoClient.connect();
const db = mongoClient.db(process.env.BANCO);

app.post('/sign-up', signUp);
app.post('/sign-in', signIn);
app.post('/cash-in', cashIn);
app.post('/cash-out', cashOut);

app.listen(process.env.PORTA);