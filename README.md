# String Analyzer Service

A simple REST API that analyzes strings and stores their computed properties in MongoDB.

## Features

- Compute length, palindrome (case-insensitive), unique characters, word count, SHA-256 hash, character frequency map.
- Endpoints:
  - POST /strings
  - GET /strings/:string_value
  - GET /strings (with filters)
  - GET /strings/filter-by-natural-language?query=...
  - DELETE /strings/:string_value

## Setup (local)

1. Clone:
   git clone <your-repo-url>
   cd string-analyzer

2. Install:
   npm install

3. Create `.env`:
   PORT=5000
   MONGODB_URI=<your-mongo-uri>

4. Run (dev):
   npm run dev

## Example

POST /strings body: { "value": "Racecar!" }

## Tests

Use curl or Postman with examples in the repository.

## Deploy

Deploy to Railway / Heroku / other Node-capable host. Add `MONGODB_URI` as environment variable.
