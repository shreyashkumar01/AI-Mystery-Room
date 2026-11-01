import mongoose from "mongoose";

const SuspectSchema = new mongoose.Schema(
  {
    suspectId: { type: String, required: true },
    name: { type: String, required: true },
    age: { type: Number },
    occupation: { type: String, required: true },
    relationship: { type: String, required: true },
    motive: { type: String, required: true },
    alibi: { type: String, required: true },
    statement: { type: String, required: true },
    publicDescription: { type: String, required: true },
    avatarUrl: { type: String }
  },
  { _id: false }
);

const ClueSchema = new mongoose.Schema(
  {
    clueId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    evidenceId: { type: String },
    importance: { type: String, enum: ["critical", "supporting", "misleading"], default: "supporting" },
    relatedSuspects: [{ type: String }],
    discoveryText: { type: String, required: true },
    solutionExplanation: { type: String, required: true } // Private field: stripped in public view
  },
  { _id: false }
);

const EvidenceSchema = new mongoose.Schema(
  {
    evidenceId: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ["CHAT", "CCTV", "IMAGE", "DOCUMENT", "WITNESS"]
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: mongoose.Schema.Types.Mixed, required: true },
    mediaUrl: { type: String },
    timestamp: { type: String },
    relatedSuspects: [{ type: String }]
  },
  { _id: false }
);

const TimelineEventSchema = new mongoose.Schema(
  {
    time: { type: String, required: true },
    event: { type: String, required: true },
    relatedSuspects: [{ type: String }]
  },
  { _id: false }
);

const HintSchema = new mongoose.Schema(
  {
    level: { type: Number, required: true },
    content: { type: String, required: true }
  },
  { _id: false }
);

const SolutionSchema = new mongoose.Schema(
  {
    culpritId: { type: String, required: true },
    motive: { type: String, required: true },
    method: { type: String, required: true },
    explanation: { type: String, required: true },
    criticalClueIds: [{ type: String }],
    redHerringExplanations: [{ type: String }]
  },
  { _id: false }
);

const CaseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    premise: { type: String, required: true, trim: true },
    story: { type: String, required: true },
    category: { type: String, default: "mystery" },
    difficulty: {
      type: String,
      required: true,
      enum: ["easy", "medium", "hard"]
    },
    status: {
      type: String,
      required: true,
      enum: ["generating", "active", "failed"],
      default: "active"
    },
    victim: {
      name: { type: String, required: true },
      age: { type: Number },
      occupation: { type: String, required: true },
      description: { type: String, required: true }
    },
    suspects: [SuspectSchema],
    clues: [ClueSchema],
    evidence: [EvidenceSchema],
    timeline: [TimelineEventSchema],
    hints: [HintSchema],
    solution: { type: SolutionSchema, required: true, select: true },
    generationMetadata: {
      model: { type: String },
      promptVersion: { type: String, default: "1.0" },
      generatedAt: { type: Date, default: Date.now },
      validationStatus: { type: String, default: "passed" }
    }
  },
  {
    timestamps: true
  }
);

/**
 * Serializer: toPublicCase (Strict Security - spec.md Section D8)
 * Strips culprit ID, motive, solution, and private clue explanations.
 */
CaseSchema.methods.toPublicCase = function (investigation = null) {
  const caseObj = this.toObject();

  // Strip secret solution completely
  delete caseObj.solution;
  delete caseObj.generationMetadata;

  // Sanitize clues: strip solutionExplanation
  caseObj.clues = caseObj.clues.map((clue) => {
    const isDiscovered = investigation?.discoveredClues?.includes(clue.clueId) || false;
    return {
      clueId: clue.clueId,
      title: clue.title,
      description: isDiscovered ? clue.description : "Examine associated evidence to discover this clue.",
      type: clue.type,
      evidenceId: clue.evidenceId,
      relatedSuspects: clue.relatedSuspects,
      importance: clue.importance,
      isDiscovered,
      discoveryText: isDiscovered ? clue.discoveryText : null
    };
  });

  // Calculate hints remaining
  const maxHints = this.difficulty === "easy" ? 2 : 3;
  const hintsUsedCount = investigation?.hintsUsed?.length || 0;
  const hintsAvailable = Math.max(0, maxHints - hintsUsedCount);

  // Return public case contract
  return {
    caseId: this._id.toString(),
    title: caseObj.title,
    premise: caseObj.premise,
    story: caseObj.story,
    category: caseObj.category,
    difficulty: caseObj.difficulty,
    status: caseObj.status,
    victim: caseObj.victim,
    suspects: caseObj.suspects,
    clues: caseObj.clues,
    evidence: caseObj.evidence,
    timeline: caseObj.timeline,
    hintsAvailable,
    investigation: investigation
      ? {
          investigationId: investigation._id.toString(),
          status: investigation.status,
          discoveredClues: investigation.discoveredClues || [],
          hintsUsed: investigation.hintsUsed || [],
          score: investigation.score || 0
        }
      : null
  };
};

export const Case = mongoose.model("Case", CaseSchema);
