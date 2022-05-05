import bcrypt from 'bcrypt';
import {v4} from "uuid";
import joi from "joi";
import dayjs from 'dayjs';
import db from "./../db.js"
import dotenv from "dotenv";

export async function signUp(req, res) {
    const {name, email, password, password_confirm} = req.body;

    if (password !== password_confirm) {
        return res.status(422).send("Passwords must match.")
    }

    const signupSchema = joi.object({
        name: joi.string().pattern(/^[a-zA-ZãÃÇ-Üá-ú ]*$/i).required(),
        email: joi.string().email({ tlds: { allow: false } }).required(),
        password: joi.string().required(),
        password_confirm: joi.string().required()
    });

    const validation = signupSchema.validate(req.body);
    if (validation.error) {
        console.log("Erro de validação! ", validation.error.details);
    };

    try {
        const exists = await db.collection('users').findOne({email});
        if (exists) {
            return res.status(409).send("Email already in use.");
        };

        const passwordHash = bcrypt.hashSync(password, process.env.HASH);
        await db.collection('users').insertOne({
            name,
            email,
            password: passwordHash,
            cash_in: [],
            cash_out: []
        });
        
        res.status(201).send("Account created succesfully.");
    } catch (e) {
        console.log("Erro de conexão! ",e);
        res.status(500).send();
    }
};

export async function signIn(req, res) {
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
            const token = v4();

            await db.collection('sessions').insertOne({
                userId: user._id,
                token
            });

            res.status(200).send(token);
        } else {
            res.status(401).send("Email or password is incorrect.");
        }

    } catch (e) {
        res.status(500).send();
    }
}