// routes/publicPropertyRoutes.js
import express from "express";
import {
  searchProperties,
  getPublicPropertyById,
  getCities,
} from "../controllers/publicPropertyController.js";

const router = express.Router();

// Public routes (no auth required)
router.get("/properties/search", searchProperties);
router.get("/properties/cities", getCities);
router.get("/properties/:id", getPublicPropertyById);

export default router;
