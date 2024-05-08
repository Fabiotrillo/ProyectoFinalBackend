import express from 'express';
import  UserController  from '../controllers/UserController.js';
import { checkRole } from '../midlewares/auth.js';
import { upload } from '../utils.js';
import methodOverride from "method-override";

const router = express.Router();

router.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      let method = req.body._method
      delete req.body._method
      return method
    }
  }));


router.get('/', UserController.getUsers);

router.get('/:userId', UserController.getUserById);

router.post('/', UserController.createUser);

router.delete('/deleteUser', checkRole(['admin']), UserController.deleteUser);

router.delete('/', UserController.deleteInactiveUsers);

router.put('/:userId', checkRole(['admin']), UserController.updateUser);

router.post('/documents', upload.any('documents'), UserController.uploadDocuments);

router.post('/profiles-image', upload.single('profileImage'), UserController.uploadProfileImage);


export default router;

export { router as UserRouter };