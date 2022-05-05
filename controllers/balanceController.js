import joi from "joi";
import dayjs from "dayjs";
import db from "./../db.js"
import dotenv from "dotenv";

export async function getBalance(req, res) {
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '').trim();
    const session = await db.collection("sessions").findOne({ token });

    if (!session) {
        console.log("Sessão não encontrada ", e)
        return res.status(401).send();
    }

    try {
        const user = await db.collection('users').findOne({_id: session.userId});

        if (user) {
            delete user._id;
            delete user.email;
            delete user.password;
            res.status(200).send(user)
        } else {
            console.log("Usuário não encontrado ", e)
            res.status(401).send();
        }
    } catch (e) {
        console.log("Erro ao conectar ", e);
        res.status(401).send();
    }
}

export async function cashIn(req, res) {
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '').trim();
    const session = await db.collection("sessions").findOne({ token });

    if (!session) return res.status(401).send();

    const cashinSchema = joi.object({
        value: joi.number().required(),
        description: joi.string().required()
    });

    const validation = cashinSchema.validate(req.body);

    if (validation.error) {
        console.log(validation.error.details);
    };

    try {
        const user = await db.collection('users').findOne({ 
            _id: session.userId 
        });
        
        if (user) {
            await db.collection('users').updateOne({_id: session.userId}, {$push: {cash_in: req.body}});
            console.log("New Cash-In created successfully.");
            res.status(201).send();
        } else {
            res.status(401).send();
        }
    } catch (e) {
        res.status(401).send();
    }
}

export async function cashOut(req, res) {
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '').trim();
    const session = await db.collection("sessions").findOne({ token });

    if (!session) return res.status(401).send();

    const cashoutSchema = joi.object({
        value: joi.number().required(),
        description: joi.string().required()
    });

    const validation = cashoutSchema.validate(req.body);

    if (validation.error) {
        console.log(validation.error.details);
    };

    try {
        const user = await db.collection('users').findOne({_id: session.userId});
        
        if (user) {
            await db.collection('users').updateOne({_id: session.userId}, {$push: {cash_out: req.body}});
            console.log("New Cash-Out created successfully.");
            res.status(201).send();
        } else {
            res.status(401).send();
        }
    } catch (e) {
        res.status(401).send();
    }
}