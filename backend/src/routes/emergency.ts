import express from 'express';
import {
  getEmergencyContacts,
  getContactsByDistrict,
  createEmergencyContact,
  updateEmergencyContact,
  deleteEmergencyContact
} from '../controllers/emergencyController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/contacts', getEmergencyContacts);
router.get('/contacts/district/:district', getContactsByDistrict);



// Admin only routes
router.use(protect);
router.use(authorize('admin'));

router.post('/contacts', createEmergencyContact);
router.put('/contacts/:id', updateEmergencyContact);
router.delete('/contacts/:id', deleteEmergencyContact);


export default router;
