const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const ses = new SESClient();

exports.handler = async (event) => {
  if (!event.userName) {
    throw new Error('missing email');
  }

  let otpCode;
  if (!event.request.session || !event.request.session.length) {
    // new auth session
    otpCode = Math.floor(1000000 + Math.random() * 9000000);
    await sendEmail(event.userName, otpCode);
  } else {
    // existing session, user has provided a wrong answer, so we need to
    // give them another chance
    const previousChallenge = event.request.session.length-1;
    const challengeMetadata = event.request.session[previousChallenge]["challengeMetadata"];
    if (challengeMetadata) {
      // challengeMetadata should start with "CODE-", hence index of 5
      otpCode = challengeMetadata;
    }
  }

  const attempts = event.request.session.length;
  const attemptsLeft = 3 - attempts;
  event.response.publicChallengeParameters = {
    email: event.userName,
    maxAttempts: 3,
    attempts,
    attemptsLeft,
  };

  // NOTE: the private challenge parameters are passed along to the
  // verify step and is not exposed to the caller
  // need to pass the secret code along so we can verify the user's answer
  event.response.privateChallengeParameters = {
    secretLoginCode: otpCode,
  };
  event.response.challengeMetadata = otpCode;

  return event;
};

async function sendEmail(emailAddress, otpCode) {
  const commandObj = {
    Destination: {
      ToAddresses: [emailAddress],
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: `<html><body><p>This is your one-time login code:</p><h3>${otpCode}</h3></body></html>`,
        },
        Text: {
          Charset: 'UTF-8',
          Data: `Your one-time login code: ${otpCode}`,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Your one-time login code',
      },
    },
    Source: `${process.env.MAIL_FROM}`,
  };
  const command = new SendEmailCommand(commandObj);

  await ses.send(command);
}
