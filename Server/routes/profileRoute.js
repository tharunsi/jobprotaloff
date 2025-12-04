import express from 'express';
import {profileData} from '../models/profile.js';

import protectRoute from '../middleware/protectRoute.js';

export const ProfileDataRoute = express.Router();


ProfileDataRoute.post('/profileData', protectRoute, async (req, res) => {
  try {
    const userId = req.user._id;
    // Upsert: if profile exists update, else create
    let prof = await profileData.findOne({ userId });
    if (prof) {
      Object.assign(prof, req.body);
      await prof.save();
    } else {
      prof = new profileData({ ...req.body, userId });
      await prof.save();
    }
    res.status(201).json({ message: 'Profile saved', profile: prof });
  } catch (error) {
    res.status(500).json({ message: 'Error saving profile', error: error.message });
  }
});

// Get my profile
ProfileDataRoute.get('/profileData', protectRoute, async (req, res) => {
  try {
    const userId = req.user._id;
    const profile = await profileData.findOne({ userId });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
});

// public: get profile by userId (if client wants to view someone)
ProfileDataRoute.get('/profileData/:userId', async (req, res) => {
  try {
    const profile = await profileData.findOne({ userId: req.params.userId });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
});