import express from "express";
import cors from "cors";
import joi from "joi";
import { MongoClient } from "mongodb";
import bcrypt from 'bcrypt';

import dotenv from "dotenv";
dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

mongoClient.connect().then(() => {
	db = mongoClient.db("my_wallet");
});

app.listen(process.env.PORTA);