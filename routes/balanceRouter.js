import { Router } from "express";
import { cashIn, cashOut, getBalance } from "./../controllers/balanceController.js";
import validHeader from "./../middlewares/userMiddleware.js"

const balanceRouter = Router();

balanceRouter.post('/cash-in', validHeader, cashIn);
balanceRouter.post('/cash-out', validHeader, cashOut);
balanceRouter.get('/balance', validHeader, getBalance);

export default balanceRouter;