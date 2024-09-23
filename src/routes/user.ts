import { Router } from 'express';
import { validationWrapper } from '../utils/helpers';
import {
  createAuthChallangeValidation,
  verifyAuthChallangeValidation,
} from '../validations/userValidation';
import UserController from '../controllers/userController';
const userController = UserController();

const router = Router();

router
  .route('/password-less/auth')
  .post(
    createAuthChallangeValidation,
    validationWrapper(userController.createAuthChallange)
  );
router
  .route('/password-less/verify')
  .post(
    verifyAuthChallangeValidation,
    validationWrapper(userController.verifyAuthChallange)
  );

export default router;
