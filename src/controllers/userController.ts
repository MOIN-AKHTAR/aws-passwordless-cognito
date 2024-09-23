import { Request, Response } from 'express';
import logger from '../utils/logger';
import { sendErrorResponse, sendSuccessResponse } from '../utils/response';
import {
  initiateAuthCognito,
  verifyAuthChallangeCognito,
  getUserFromCognito,
} from '../utils/cognito';
import { AdminCreateUserCommand } from '@aws-sdk/client-cognito-identity-provider';
import { idpClient } from '../config/idp';

const UserController = () => {
  const createAuthChallange = async (req: Request, res: Response) => {
    try {
      // Checking for user alrady on cognito or not
      const user = await getUserFromCognito(req.body.email);

      // If no user on cgnito than create without sending mail to them
      if (!user) {
        const command = new AdminCreateUserCommand({
          UserPoolId: `${process.env.AWS_COGNITO_POOL_ID}`,
          Username: req.body.email,
          UserAttributes: [{ Name: 'email', Value: req.body.email }],
          MessageAction: 'SUPPRESS', // Suppress the automatic invite email
        });
        await idpClient.send(command);
      }
      // Start CUTOM_AUTH ---. This will trigger DEFINE_AUTH and CREATE_AUTH_CHALLANGE triggers which will send otp to your mail via ses.
      const initialAuthChallangeResponse = await initiateAuthCognito(
        req.body.email
      );

      return sendSuccessResponse({
        res,
        message: 'Initial Auth Challange',
        data: {
          session: initialAuthChallangeResponse?.Session,
          userName: initialAuthChallangeResponse?.ChallengeParameters?.USERNAME,
        },
      });
    } catch (error) {
      logError(`Error While createAuthChallange ==> `, error?.message);
      return sendErrorResponse({
        req,
        res,
        statusCode: error?.statusCode || 400,
        error,
      });
    }
  };

  const verifyAuthChallange = async (req: Request, res: Response) => {
    try {
      // Vrifying auth challange.This will trigger VERIFY_AUTH_CHALLANGE trigger
      const verifyAuthChallageResponse = await verifyAuthChallangeCognito(
        req.body.session,
        req.body.userName,
        req.body.otp
      );

      // If otp is ok than user will get tokens
      if (verifyAuthChallageResponse.AuthenticationResult?.AccessToken)
        return sendSuccessResponse({
          res,
          message: 'Verified Auth Challange',
          data: {
            accessToken:
              verifyAuthChallageResponse.AuthenticationResult?.AccessToken,
            idToken: verifyAuthChallageResponse.AuthenticationResult?.IdToken,
            refreshToken:
              verifyAuthChallageResponse.AuthenticationResult?.RefreshToken,
          },
        });
      // Send new session to try again
      return sendErrorResponse({
        error: {
          session: verifyAuthChallageResponse?.Session,
          limitExceeded:
            verifyAuthChallageResponse.ChallengeParameters?.attempts ===
            verifyAuthChallageResponse?.ChallengeParameters?.maxAttempts,
        },
        req,
        res,
        statusCode: 400,
      });
    } catch (error) {
      logError(`Error While verifyAuthChallange ==> `, error?.message);
      return sendErrorResponse({
        req,
        res,
        statusCode: error?.statusCode || 400,
        error: 'Limit exceed',
      });
    }
  };

  const logError = (context: string, value?: any) =>
    logger.error(`User - ${context} => ${JSON.stringify(value)}`);

  return {
    createAuthChallange,
    verifyAuthChallange,
  };
};

export default UserController;
