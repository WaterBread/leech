import { Router, NextFunction, Request, Response } from 'express';
import {
  getDiskSpaceSummary
} from '../controllers/system';

const systemRouter = Router();

systemRouter.get('/diskspace', getDiskSpaceSummary)

systemRouter.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send({});
});

export default systemRouter;
