import { check } from 'express-validator';

export const createUserValidation = [
  check('name').notEmpty().withMessage('Please provide name'),
  check('email').notEmpty().withMessage('Please provide the email'),
  check('url').notEmpty().withMessage('Please provide url'),
];

export const createAuthChallangeValidation = [
  check('email')
    .notEmpty()
    .withMessage('Please provide the email')
    .bail()
    .isEmail()
    .withMessage('Please provide a valid email'),
];

export const verifyAuthChallangeValidation = [
  check('session').notEmpty().withMessage('Please provide session'),
  check('userName').notEmpty().withMessage('Please provide userName'),
  check('otp').notEmpty().withMessage('Please provide otp'),
];
