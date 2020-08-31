import { Router, NextFunction, Request, Response } from 'express';
import {
  getSetting, getSettings, setSetting
} from '../controllers/settings';

const settingsRouter = Router();

settingsRouter.put('/:settingName', setSetting);
settingsRouter.put('/', setSetting);

settingsRouter.get('/:settingName', getSetting);
settingsRouter.get('', getSettings);

settingsRouter.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send({});
});

export default settingsRouter;
