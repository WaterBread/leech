import { Request, Response } from 'express';
import * as settingsModel from '../models/settings';

export const getSettings = async (req: Request, res: Response) => {
  try {
    const settings = await settingsModel.getAllSettings();
    res.status(200).send({ settings });
  } catch (e) {
    console.error(e);
    res.status(500).send();
  }
};

export const getSetting = async (req: Request, res: Response) => {
  const { settingName } = req.params;

  try {
    const value = await settingsModel.getSetting(settingName);
    res.status(200).send({ value });
  } catch (e) {
    console.error(e);
    res.status(500).send();
  }
};

export const setSetting = async (req: Request, res: Response) => {
  const { value } = req.body;
  const { settingName } = req.params;

  try {
    await settingsModel.setSetting(settingName, value);
    res.status(201).send();
  } catch (e) {
    console.error(e);
    res.status(500).send();
  }
};
