{
"Version": "2012-10-17",
"Statement": [
{
"Sid": "CognitSid",
"Effect": "Allow",
"Action": [
"cognito-idp:AdminGetUser",
"cognito-idp:GetUser",
"cognito-idp:AdminCreateUser",
"cognito-idp:AdminDeleteUser",
"cognito-idp:AdminDisableUser",
"cognito-idp:AdminEnableUser",
"cognito-idp:AdminInitiateAuth",
"cognito-idp:AdminSetUserPassword",
"cognito-idp:AdminInitiateAuth",
"cognito-idp:AdminRespondToAuthChallenge"
],
"Resource": "COGNITO_ARN"
}
]
}
