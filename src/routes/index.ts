import { Router } from 'express';
import userrRoute from '../routes/user';

const router = Router();

router.use('/user', userrRoute);

export default router;
