import { Request, Response } from 'express';
import EmergencyContact from '../models/EmergencyContact';


interface AuthRequest extends Request {
  user?: any;
}

// @desc    Get emergency contacts by district
// @route   GET /api/emergency/contacts
// @access  Public
export const getEmergencyContacts = async (req: Request, res: Response) => {
  try {
    const { district, type } = req.query;

    const query: any = { isActive: true };
    if (district) query.district = district;
    if (type) query.type = type;

    const contacts = await EmergencyContact.find(query).sort({ type: 1, name: 1 });

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });

  } catch (error) {
    console.error('Get emergency contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching emergency contacts'
    });
  }
};

// @desc    Get contacts by district for quick access
// @route   GET /api/emergency/contacts/district/:district
// @access  Public
export const getContactsByDistrict = async (req: Request, res: Response) => {
  try {
    const { district } = req.params;

    const contacts = await EmergencyContact.find({
      district: district,
      isActive: true
    }).sort({ type: 1, name: 1 });

    // Group contacts by type for better organization
    const groupedContacts = contacts.reduce((acc, contact) => {
      if (!acc[contact.type]) {
        acc[contact.type] = [];
      }
      acc[contact.type].push(contact);
      return acc;
    }, {} as Record<string, typeof contacts>);

    res.status(200).json({
      success: true,
      district,
      count: contacts.length,
      data: groupedContacts
    });

  } catch (error) {
    console.error('Get contacts by district error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching district contacts'
    });
  }
};



// @desc    Create new emergency contact (Admin only)
// @route   POST /api/emergency/contacts
// @access  Private (Admin)
export const createEmergencyContact = async (req: Request, res: Response) => {
  try {
    const contactData = req.body;
    const contact = await EmergencyContact.create(contactData);

    res.status(201).json({
      success: true,
      message: 'Emergency contact created successfully',
      data: contact
    });

  } catch (error: any) {
    console.error('Create emergency contact error:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating emergency contact'
    });
  }
};

// @desc    Update emergency contact (Admin only)
// @route   PUT /api/emergency/contacts/:id
// @access  Private (Admin)
export const updateEmergencyContact = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const contact = await EmergencyContact.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Emergency contact not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Emergency contact updated successfully',
      data: contact
    });

  } catch (error: any) {
    console.error('Update emergency contact error:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating emergency contact'
    });
  }
};

// @desc    Delete emergency contact (Admin only)
// @route   DELETE /api/emergency/contacts/:id
// @access  Private (Admin)
export const deleteEmergencyContact = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const contact = await EmergencyContact.findByIdAndDelete(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Emergency contact not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Emergency contact deleted successfully'
    });

  } catch (error) {
    console.error('Delete emergency contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting emergency contact'
    });
  }
};


