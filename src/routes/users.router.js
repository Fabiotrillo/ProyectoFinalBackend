import express from 'express';
import  UserController  from '../controllers/UserController.js';
import { checkRole } from '../midlewares/auth.js';

const router = express.Router();

router.get('/', UserController.getUsers);

router.get('/:userId', UserController.getUserById);

router.post('/', UserController.createUser);

router.delete('/:userId', checkRole(['admin']), UserController.deleteUser);

router.put('/:userId', checkRole(['admin']), UserController.updateUser);

export default router;

export { router as UserRouter };