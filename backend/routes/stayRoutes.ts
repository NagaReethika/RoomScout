import express from 'express';
import { getStays } from '../controllers/stayController.ts';

const router = express.Router();

router.get('/', getStays);

export default router;
