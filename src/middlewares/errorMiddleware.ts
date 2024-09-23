import { Request, Response } from 'express';
import { HttpException } from '../utils/error';
import { sendErrorResponse } from '../utils/response';
import logger from '../utils/logger';

const errorMiddleware = (
  error: HttpException,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _: unknown
) => {
  logger.error(
    `[${req.method}] ${req.path} >> StatusCode:: ${error?.status}, Message:: ${error?.message}`
  );

  return sendErrorResponse({
    error,
    req,
    res,
    statusCode: 400,
  });
};

export default errorMiddleware;
