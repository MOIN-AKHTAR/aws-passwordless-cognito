import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';

export const idpClient = new CognitoIdentityProviderClient({
  region: `${process.env.AWS_REGION}`,
  credentials: {
    accessKeyId: `${process.env.AWS_ACCESS_KEY}`,
    secretAccessKey: `${process.env.AWS_SECRET_KEY}`,
  },
});
