import express from 'express';
import { profile } from '../models/profile.js';

const profileRoute = express.Router();

profileRoute.use(express.json());