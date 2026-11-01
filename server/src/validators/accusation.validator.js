import { z } from "zod";

/**
 * Accusation Submission Validator (spec.md Section D3 Endpoint 5)
 */
export const accusationRequestSchema = z.object({
  suspectId: z
    .string({ required_error: "Please select a suspect to accuse." })
    .min(1, { message: "Suspect ID is required." }),
  reasoning: z
    .string()
    .max(1000, { message: "Reasoning cannot exceed 1000 characters." })
    .optional()
    .default("")
});
