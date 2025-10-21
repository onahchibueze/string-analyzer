import AnalyzedString from "../models/string.js";
import { computeProperties } from "../utils/analyzer.js";

export async function createString(req, res) {
  const { value } = req.body;

  // Validate request body
  if (value === undefined)
    return res.status(400).json({ error: "value required" });

  if (typeof value !== "string")
    return res.status(422).json({ error: "value must be a string" });

  // Compute string properties
  const props = computeProperties(value);
  const id = props.sha256_hash;

  // Check for duplicates
  const existing = await AnalyzedString.findOne({ id });
  if (existing) return res.status(409).json({ error: "String already exists" });

  // Save to database
  const doc = new AnalyzedString({
    id,
    value,
    properties: props,
  });
  await doc.save();

  // Respond to client
  return res.status(201).json({
    id,
    value,
    properties: props,
    created_at: doc.created_at.toISOString(),
  });
}
export async function getString(req, res) {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ error: "Missing string ID" });

    const doc = await AnalyzedString.findOne({ id });

    if (!doc) return res.status(404).json({ error: "String not found" });

    return res.status(201).json({
      id: doc.id,
      value: doc.value,
      properties: doc.properties,
      created_at: doc.created_at.toISOString(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
}

export async function listStrings(req, res) {
  const {
    is_palindrome,
    min_length,
    max_length,
    word_count,
    contains_character,
  } = req.query;
  const filters = {};
  if (is_palindrome !== undefined) {
    if (is_palindrome !== "true" && is_palindrome !== "false") {
      return res
        .status(400)

        .json({ error: " is palindrome must be either through or false" });
    }
    filters["properties.is_palindrome"] = is_palindrome === "true";
  }
  if (min_length !== undefined) {
    const v = parseInt(min_length, 10);
    if (Number.isNaN(v))
      return res.status(400).json({ error: " Min_length must  be an integer" });
    filters["properties.length"] = {
      ...(filters["properties.length"] || {}),
      $gte: v,
    };
  }
  if (max_length !== undefined) {
    const v = parseInt(max_length, 10);
    if (Number.isNaN(v))
      return res.status(400).json({ error: " Max_length must  be an integer" });
    filters["properties.length"] = {
      ...(filters[properties.length] || {}),
      $lte: v,
    };
  }
  if (word_count !== undefined) {
    const v = parseInt(word_count, 10);
    if (Number.isNaN(v))
      return res.status(400).json({ error: "word_count must be integer" });
    filters["properties.word_count"] = v;
  }
  if (contains_character !== undefined) {
    if (typeof contains_character !== "string" || contains_character !== 1) {
      return res
        .status(400)
        .json({ error: "contains_character must be a single character" });
    }
    filters[`properties.character_frequency_map.${contains_character}`] = {
      $exists: true,
      $ne: 0,
    };
  }
  const docs = await AnalyzedString.find(filters).sort({ created_at: -1 });
  const data = docs.map((d) => ({
    id: d.id,
    value: d.value,
    properties: d.properties,
    created_at: d.created_at.toISOString(),
  }));
  return res.json({
    data,
    count: data.length,
    filters_applied: req.query,
  });
}
function parseNaturalLanguage(query) {
  const q = query.toLowerCase();
  const parsed = {};

  if (/single word/.test(q)) parsed.word_count = 1;
  if (/palindromic|palindrome/.test(q)) parsed.is_palindrome = true;

  const longerMatch = q.match(/longer than (\d+)/);
  if (longerMatch) parsed.min_length = parseInt(longerMatch[1], 10) + 1;

  const containsLetter = q.match(/containing the letter (\w)/);
  if (containsLetter) parsed.contains_character = containsLetter[1];

  return Object.keys(parsed).length ? parsed : null;
}

export async function naturalLanguage(req, res) {
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: "query param required" });

  const parsed = parseNaturalLanguage(decodeURIComponent(query));
  if (!parsed)
    return res
      .status(400)
      .json({ error: "Unable to parse natural language query" });

  const mongoFilters = {};
  if (parsed.is_palindrome !== undefined)
    mongoFilters["properties.is_palindrome"] = parsed.is_palindrome;
  if (parsed.word_count !== undefined)
    mongoFilters["properties.word_count"] = parsed.word_count;
  if (parsed.min_length !== undefined)
    mongoFilters["properties.length"] = { $gte: parsed.min_length };
  if (parsed.contains_character !== undefined)
    mongoFilters[
      `properties.character_frequency_map.${parsed.contains_character}`
    ] = { $exists: true, $ne: 0 };

  const docs = await AnalyzedString.find(mongoFilters).sort({ created_at: -1 });
  const data = docs.map((d) => ({
    id: d.id,
    value: d.value,
    properties: d.properties,
    created_at: d.created_at.toISOString(),
  }));

  return res.json({
    data,
    count: data.length,
    interpreted_query: {
      original: query,
      parsed_filters: parsed,
    },
  });
}
export async function deleteString(req, res) {
  const { id } = req.params;
  if (!id)
    return res.status(400).json({
      error: "missing param",
    });

  const result = await AnalyzedString.findOneAndDelete({
    "properties.sha256_hash": id,
  });

  if (!result) return res.status(404).json({ error: "Not found" });

  return res.status(204).send();
}
