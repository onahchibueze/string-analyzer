import crypto from "crypto";

function normalizeForPalindrome(s) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function computeProperties(value) {
  const length = value.length;
  const word_count = value.trim() === "" ? 0 : value.trim().split(/\s+/).length;
  const unique_characters = new Set([...value]).size;

  const freq = {};
  for (const ch of value) {
    freq[ch] = (freq[ch] || 0) + 1;
  }

  const sha256_hash = crypto.createHash("sha256").update(value).digest("hex");
  const norm = normalizeForPalindrome(value);
  const is_palindrome = norm === norm.split("").reverse().join("");

  return {
    length,
    is_palindrome,
    word_count,
    unique_characters,
    sha256_hash,
    character_frequency: freq,
  };
}
