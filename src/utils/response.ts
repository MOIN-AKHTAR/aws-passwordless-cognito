import { Response, Request } from 'express';
import logger from '../utils/logger';

type SuccessResponseType = {
  data?: object | string;
  message: string;
  token?: string;
  status: boolean;
};

type SuccessParamType = {
  res: Response;

  data?: object | string | null;

  token?: string;
  message?: string;
  statusCode?: number;
};

type ErrorParamType = {
  req: Request;
  res: Response;
  error: any;
  statusCode?: number;
};

export const sendSuccessResponse = ({
  res,
  data,
  token,
  message = 'Success',
  statusCode = 200,
}: SuccessParamType) => {
  const responseObj: SuccessResponseType = { message, status: true };
  if (data) responseObj.data = data;
  if (token) responseObj.token = token;
  return res.status(statusCode).send(responseObj);
};

export const sendErrorResponse = ({
  req,
  res,
  error,
  statusCode = 500,
}: ErrorParamType) => {
  const status: number = statusCode || 500;
  const _error: string =
    error?.message || error?.errors || error || 'invalid token';
  logger.error(
    `[${req?.method}] ${req?.path} >> StatusCode:: ${status}, Message:: ${_error}`
  );
  return res.status(status).json({ status: false, error: _error });
};
