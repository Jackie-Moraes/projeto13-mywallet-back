import { Router } from "express";
import { postBalance, getBalance } from "./../controllers/balanceController.js";
import {validHeader} from "./../middlewares/userMiddleware.js"

const balanceRouter = Router();

balanceRouter.get('/balance', validHeader, getBalance);
balanceRouter.post('/balance', validHeader, postBalance);

export default balanceRouter;