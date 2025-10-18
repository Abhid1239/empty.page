// src/models/Note.ts
import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({
  content: {
    type: String,
    default: "<h2>Welcome!</h2><p>Start typing here...</p>",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    // MongoDB will automatically delete documents after this time
    index: { expires: "24h" },
  },
});

export default mongoose.models.Note || mongoose.model("Note", NoteSchema);
