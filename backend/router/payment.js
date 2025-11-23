import express from 'express';
import { getPayment, updatePayment, deletePayment, createCheckout } from '../controllers/paymentController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/checkout', auth, createCheckout);
router.get('/:id', auth, getPayment);
router.put('/:id', auth, updatePayment);
router.delete('/:id', auth, deletePayment);

export default router;