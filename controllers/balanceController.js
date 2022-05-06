import joi from "joi";
import dayjs from "dayjs";
import db from "./../db.js"
import dotenv from "dotenv";

export async function getBalance(req, res) {
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '').trim();
    const session = await db.collection("sessions").findOne({ token });

    if (!session) {
        console.log("Session not found.")
        return res.status(401).send();
    }

    try {
        const user = await db.collection('users').findOne({_id: session.userId});

        if (user) {
            res.status(200).send(user.balance)
        } else {
            console.log("User not found.")
            res.status(401).send();
        }
    } catch (e) {
        console.log("Erro ao conectar ", e);
        res.status(401).send();
    }
}

export async function postBalance(req, res) {
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '').trim();
    const session = await db.collection("sessions").findOne({ token });

    if (!session) return res.status(401).send();

    const cashinSchema = joi.object({
        value: joi.number().required(),
        description: joi.string().required(),
        operation: joi.string().valid('cashIn', "cashOut").required()
    });

    const validation = cashinSchema.validate(req.body);

    if (validation.error) {
        console.log(validation.error.details);
    };

    try {
        const {value, description, operation} = req.body
        const user = await db.collection('users').findOne({ 
            _id: session.userId 
        });

        if (user) {
            const entry = {
                date: dayjs().locale('pt-br').format('DD/MM'),
                value,
                description,
                operation,
            }
            await db.collection('users').updateOne({_id: session.userId}, {$push: {balance: entry}});
            console.log("New entry created successfully.");
            res.status(201).send();
        } else {
            res.status(401).send();
        }
    } catch (e) {
        console.log(e);
        res.status(401).send();
    }
}