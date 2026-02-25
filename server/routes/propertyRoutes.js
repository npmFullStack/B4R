import express from "express";
import {
  getUserProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  deletePropertyImage,
} from "../controllers/propertyController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// All routes are protected
router.use(authMiddleware);

router.get("/", getUserProperties);
router.get("/:id", getPropertyById);
router.post("/", upload.array("images", 10), createProperty);
router.put("/:id", upload.array("images", 10), updateProperty);
router.delete("/:id", deleteProperty);
router.delete("/:propertyId/images/:imageName", deletePropertyImage);

export default router;
