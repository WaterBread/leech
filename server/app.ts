import Express, { json } from 'express';
import cors from 'cors';
import torrentRouter from './routes/torrent';
import filelistRouter from './routes/filelist';
import settingsRouter from './routes/settings';
import systemRouter from './routes/system';

const app = Express();
app.use(cors());
app.use(json());

app.use('/torrent', torrentRouter);
app.use('/filelist', filelistRouter);
app.use('/settings', settingsRouter);
app.use('/system', systemRouter);

export default app;
