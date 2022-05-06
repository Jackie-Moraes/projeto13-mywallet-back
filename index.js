import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routes/usersRouter.js";
import balanceRouter from "./routes/balanceRouter.js"


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// routers
app.use(userRouter);
app.use(balanceRouter);


app.listen(process.env.PORTA);