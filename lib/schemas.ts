// lib/schemas.ts
export const EMX_RITUAL_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: { type: "string", minLength: 3, maxLength: 60 },
    intent: {
      type: "string",
      enum: ["reset", "focus", "sleep", "energize", "downshift", "unwind", "ground"],
    },
    duration_seconds: { type: "integer", minimum: 30, maximum: 3600 },
    steps: {
      type: "array",
      minItems: 4,
      maxItems: 9,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          tag: {
            type: "string",
            enum: ["posture", "breath", "gaze", "visualize", "move", "note", "meta", "transition"],
          },
          cue: { type: "string", minLength: 5, maxLength: 200 },
          duration: { type: "integer", minimum: 10, maximum: 300 },
        },
        required: ["tag", "cue", "duration"],
      },
    },
    // Make it required but allow empty array
    cautions: {
      type: "array",
      default: [],
      items: { type: "string", minLength: 3, maxLength: 140 },
    },
  },
  // IMPORTANT: must include EVERY key in properties
  required: ["title", "intent", "duration_seconds", "steps", "cautions"],
} as const;
