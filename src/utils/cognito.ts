import {
  InitiateAuthCommand,
  AuthFlowType,
  RespondToAuthChallengeCommand,
  ChallengeNameType,
  AdminGetUserCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { idpClient } from '../config/idp';
import { calculateSecretHash } from '../utils/helpers';
import logger from '../utils/logger';

export const initiateAuthCognito = async (userName: string) => {
  try {
    const secretHash = calculateSecretHash(
      `${userName}`,
      `${process.env.AWS_COGNITO_APP_CLIENT}`,
      `${process.env.AWS_COGNITO_APP_SECRET}`
    );

    const initializeAuthCommand = new InitiateAuthCommand({
      AuthFlow: AuthFlowType.CUSTOM_AUTH,
      ClientId: `${process.env.AWS_COGNITO_APP_CLIENT}`,
      AuthParameters: {
        USERNAME: userName,
        SECRET_HASH: secretHash,
      },
    });
    logHttp('Initialized user custom auth');

    return idpClient.send(initializeAuthCommand);
  } catch (error) {
    logError('Error while initiateAuthCgnito ', error);
    throw new Error(error as string);
  }
};

export const verifyAuthChallangeCognito = (
  session: string,
  userName: string,
  otp: string
) => {
  try {
    const secretHash = calculateSecretHash(
      `${userName}`,
      `${process.env.AWS_COGNITO_APP_CLIENT}`,
      `${process.env.AWS_COGNITO_APP_SECRET}`
    );
    const verifyAuthChallangeCommand = new RespondToAuthChallengeCommand({
      ChallengeName: ChallengeNameType.CUSTOM_CHALLENGE,
      ClientId: `${process.env.AWS_COGNITO_APP_CLIENT}`,
      Session: session,
      ChallengeResponses: {
        USERNAME: userName, // Username provided in the initiateAuth request
        ANSWER: otp, // The OTP provided by the user
        SECRET_HASH: secretHash,
      },
    });
    logHttp('verifyAuthChallange user custom auth');
    return idpClient.send(verifyAuthChallangeCommand);
  } catch (error) {
    logError('Error while initiateAuthCgnito ', error);
    throw new Error(error as string);
  }
};

export const getUserFromCognito = async (userName: string) => {
  try {
    const command = new AdminGetUserCommand({
      Username: userName,
      UserPoolId: `${process.env.AWS_COGNITO_POOL_ID}`,
    });

    logHttp('getUserFromCognito for passwordless auth');

    try {
      const user = await idpClient.send(command);
      return user;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_: unknown) {
      return null;
    }
  } catch (error) {
    logError(
      'Error while getUserFromCognito ',
      error?.includes('does not exist')
    );
    throw new Error(error as string);
  }
};

const logHttp = (context: string, value?: any) =>
  logger.http(`Cognito - ${context} => ${JSON.stringify(value)}`);

const logError = (context: string, value?: any) =>
  logger.error(`Cognito - ${context} => ${JSON.stringify(value)}`);
