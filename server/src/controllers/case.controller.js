import * as caseService from "../services/case.service.js";
import { successResponse } from "../utils/apiResponse.js";
import { createCaseRequestSchema } from "../validators/case.validator.js";
import { accusationRequestSchema } from "../validators/accusation.validator.js";

export const createCase = async (req, res, next) => {
  try {
    const { premise, difficulty } = createCaseRequestSchema.parse(req.body);
    const result = await caseService.createMysteryCase(premise, difficulty);
    return successResponse(res, result, "Mystery generated successfully", 201);
  } catch (error) {
    next(error);
  }
};

export const getCase = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await caseService.getCaseById(id);
    return successResponse(res, result, "Case retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const discoverClue = async (req, res, next) => {
  try {
    const { id, clueId } = req.params;
    const result = await caseService.discoverClue(id, clueId);
    return successResponse(res, result, "Clue discovered successfully");
  } catch (error) {
    next(error);
  }
};

export const requestHint = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await caseService.requestHint(id);
    return successResponse(res, result, "Hint revealed successfully");
  } catch (error) {
    next(error);
  }
};

export const submitAccusation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { suspectId, reasoning } = accusationRequestSchema.parse(req.body);
    const result = await caseService.submitAccusation(id, suspectId, reasoning);
    return successResponse(res, result, "Accusation submitted successfully");
  } catch (error) {
    next(error);
  }
};

export const getResult = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await caseService.getCaseResult(id);
    return successResponse(res, result, "Investigation result retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const healthCheck = (req, res) => {
  return successResponse(res, { status: "healthy", timestamp: new Date() }, "AI Mystery Room API is running");
};
