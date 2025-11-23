import express from 'express';
import {createQR, getQRCodes, updateQR, deleteQR} from '../controllers/qrController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(auth); // Apply auth middleware to all routes in this file

router.post('/', createQR);
// List current user's QR codes
router.get('/', getQRCodes);
router.put('/:id', updateQR);
router.delete('/:id', deleteQR);

export default router;
