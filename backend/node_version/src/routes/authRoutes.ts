import { Router } from 'express';
import { googleLogin, microsoftLogin, logout } from '../controllers/authController';

const router = Router();

router.post('/login/google', googleLogin);
router.post('/login/microsoft', microsoftLogin);
router.post('/logout', logout); 

export default router;
