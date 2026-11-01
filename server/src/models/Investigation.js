import mongoose from "mongoose";

const AccusationSchema = new mongoose.Schema(
  {
    suspectId: { type: String, required: true },
    reasoning: { type: String, default: "" },
    submittedAt: { type: Date, default: Date.now },
    isCorrect: { type: Boolean, required: true }
  },
  { _id: false }
);

const ScoreBreakdownSchema = new mongoose.Schema(
  {
    basePoints: { type: Number, default: 0 },
    cluePoints: { type: Number, default: 0 },
    hintPenalty: { type: Number, default: 0 },
    finalScore: { type: Number, default: 0 }
  },
  { _id: false }
);

const InvestigationSchema = new mongoose.Schema(
  {
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Case",
      required: true,
      index: true
    },
    status: {
      type: String,
      enum: ["active", "completed", "abandoned"],
      default: "active",
      required: true
    },
    discoveredClues: {
      type: [String],
      default: []
    },
    hintsUsed: {
      type: [Number],
      default: []
    },
    score: {
      type: Number,
      default: 0
    },
    accusation: {
      type: AccusationSchema,
      default: null
    },
    scoreBreakdown: {
      type: ScoreBreakdownSchema,
      default: () => ({
        basePoints: 0,
        cluePoints: 0,
        hintPenalty: 0,
        finalScore: 0
      })
    },
    startedAt: {
      type: Date,
      default: Date.now
    },
    completedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

export const Investigation = mongoose.model("Investigation", InvestigationSchema);
