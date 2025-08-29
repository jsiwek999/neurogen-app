export const EMX_RITUAL_SCHEMA = {
  name: "emx_ritual",
  schema: {
    type: "object",
    additionalProperties: false,
    required: ["title", "duration_seconds", "steps"],
    properties: {
      title: { type: "string", maxLength: 120 },
      duration_seconds: { type: "integer", minimum: 10, maximum: 600 },
      intent: { type: "string" },
      steps: {
        type: "array",
        minItems: 2,
        maxItems: 12,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["tag", "cue", "duration"],
          properties: {
            tag: {
              type: "string",
              enum: ["breath","shift","journal","install","disrupt","identity","ritual","integration","submodal"]
            },
            cue: { type: "string", maxLength: 400 },
            duration: { type: "integer", minimum: 5, maximum: 180 }
          }
        }
      },
      cautions: { type: "string" }
    }
  },
  strict: true
} as const;
