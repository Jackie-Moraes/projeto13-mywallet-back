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
await mongoClient.connect();
const db = mongoClient.db(process.env.BANCO);

app.post('/sign-up', async (req, res) => {
    const {name, email, password, password_confirm} = req.body;

    if (password !== password_confirm) {
        return res.status(422).send("Passwords must match.")
    }

    const signupSchema = joi.object({
        name: joi.string().required(),
        email: joi.string().email({ tlds: { allow: false } }).required(),
        password: joi.string().required(),
        password_confirm: joi.string().required()
    })

    const validation = signupSchema.validate(req.body);
    if (validation.error) {
        console.log(validation.error.details);
    }

    try {
        const exists = await db.collection('users').findOne(email);
        if (exists) {
            return res.status(409).send("Email already in use.");
        }

        const passwordHash = bcrypt.hashSync(password, process.env.HASH);
        await db.collection('users').insertOne({
            name: name,
            email: email,
            password: passwordHash,
            cash_in: [],
            cash_out: []
        });
        
        res.status(201).send("Account created succesfully.");
    } catch (e) {
        console.log(e);
        res.status(500).send();
    }
})

app.post('/sign-in', async (req, res) => {
    const {email, password} = req.body;

    const signinSchema = joi.object({
        email: joi.string().email({ tlds: { allow: false } }).required(),
        password: joi.string().required(),
    })

    const validation = signinSchema.validate(req.body);
    if (validation.error) {
        console.log(validation.error.details);
    }
    
    try {
        const user = await db.collection('users').findOne({email: email});

        if (user && bcrypt.compareSync(password, user.password)) {
            res.status(200).send();
        } else {
            res.status(401).send("Email or password is incorrect.");
        }

    } catch (e) {
        res.status(500).send();
    }
});

app.post('/cash-in', async (req, res) => {
    
});

app.post('/cash-out', async (req, res) => {

});


app.listen(process.env.PORTA);