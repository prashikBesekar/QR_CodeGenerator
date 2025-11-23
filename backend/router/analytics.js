import express from 'express';
import { trackScan, getDashboard, getQRAnalytics } from '../controllers/analyticsController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', auth, getDashboard);
router.get('/qr/:id', auth, getQRAnalytics);
router.post('/track/:id', trackScan);

export default router;