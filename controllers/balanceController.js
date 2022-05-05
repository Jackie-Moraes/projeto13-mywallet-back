import bcrypt from 'bcrypt';
import {v4} from "uuid";
import joi from "joi";

export async function cashIn(req, res) {
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '').trim();
    const session = await db.collections("sessions").findOne({ token });

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
        const user = await db.collections('users').findOne({ 
            _id: session.userId 
        });
        
        if (user) {

            await db.collection('users').updateOne({
                user
            }, {$push: {cash_in: req.body}});

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
    const session = await db.collections("sessions").findOne({ token });

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
        const user = await db.collections('users').findOne({ 
            _id: session.userId 
        });
        
        if (user) {

            await db.collection('users').updateOne({
                user
            }, {$push: {cash_out: req.body}});

            res.status(201).send();
        } else {
            res.status(401).send();
        }

    } catch (e) {
        res.status(401).send();
    }
}