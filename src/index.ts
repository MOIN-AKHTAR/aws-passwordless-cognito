import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import logger from './utils/logger';
import routes from './routes';

import { sendSuccessResponse } from './utils/response';
import errorMiddleware from './middlewares/errorMiddleware';

const app: express.Application = express();

app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));
app.use(helmet());
app.use(
  cors({
    origin: process.env.ENV === 'development' ? '*' : process.env.WEB_URL,
  })
);

app.get('/', (_: Request, res: Response) =>
  sendSuccessResponse({
    statusCode: 200,
    message: 'Hello from server',
    res,
  })
);

// Routes
app.use('/api/v1', routes);

const PORT = process.env.PORT || 5000;

app.use(errorMiddleware);

app.listen(PORT, async () => {
  try {
    logger.info(`Server is running on port ${PORT}`);
  } catch (error) {
    throw new Error(error?.message || error);
  }
});

process.on('unhandledRejection', () => {
  process.exit(1);
});
