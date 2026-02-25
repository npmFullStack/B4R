// routes/propertyRulesRoutes.js
import express from "express";
import {
  getPropertyRules,
  addPropertyRule,
  addMultiplePropertyRules,
  updatePropertyRule,
  deletePropertyRule,
  deleteAllPropertyRules,
} from "../controllers/propertyRulesController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);
router.get("/:propertyId/rules", getPropertyRules);
router.post("/:propertyId/rules", addPropertyRule);
router.post("/:propertyId/rules/bulk", addMultiplePropertyRules);
router.put("/:propertyId/rules/:ruleId", updatePropertyRule);
router.delete("/:propertyId/rules/:ruleId", deletePropertyRule);
router.delete("/:propertyId/rules", deleteAllPropertyRules);

export default router;
