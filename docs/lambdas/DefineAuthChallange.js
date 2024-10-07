exports.handler = async (event) => {
  if (
    event.request.session &&
    event.request.session.length > 0 &&
    event.request.session.slice(-1)[0].challengeResult === true
  ) {
    // The user answered the challenge correctly, issue tokens
    event.response.issueTokens = true;
    event.response.failAuthentication = false;
    console.log('User successfully authenticated, issuing tokens.');
  } else if (
    event.request.session &&
    event.request.session.length >= 3 &&
    event.request.session.slice(-1)[0].challengeResult === false
  ) {
    // The user failed too many attempts, fail authentication
    event.response.issueTokens = false;
    event.response.failAuthentication = true;
    event.response.challengeName = 'CUSTOM_CHALLENGE';
    console.log('User failed too many times.');
  } else {
    // Continue presenting challenges (OTP, etc.)
    event.response.issueTokens = false;
    event.response.failAuthentication = false;
    event.response.challengeName = 'CUSTOM_CHALLENGE';
    console.log('Presenting next challenge.');
  }
  return event;
};
