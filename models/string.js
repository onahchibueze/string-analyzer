// src/models/string.js
import mongoose from "mongoose";

const StringSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  value: {
    type: String,
    required: true,
  },
  properties: {
    length: Number,
    is_palindrome: Boolean,
    unique_characters: Number,
    word_count: Number,
    sha256_hash: String,
    character_frequency_map: mongoose.Schema.Types.Mixed,
  },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model("AnalyzedString", StringSchema);
