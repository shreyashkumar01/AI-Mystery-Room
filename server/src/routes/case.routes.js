import { Router } from "express";
import * as caseController from "../controllers/case.controller.js";
import { caseCreationLimiter } from "../middleware/rateLimit.middleware.js";

const router = Router();

// Health Check (spec.md Section D3 Endpoint 7)
router.get("/health", caseController.healthCheck);

// Case Routes
router.post("/cases", caseCreationLimiter, caseController.createCase);
router.get("/cases/:id", caseController.getCase);
router.post("/cases/:id/clues/:clueId/discover", caseController.discoverClue);
router.post("/cases/:id/hints", caseController.requestHint);
router.post("/cases/:id/accuse", caseController.submitAccusation);
router.get("/cases/:id/result", caseController.getResult);

export default router;
