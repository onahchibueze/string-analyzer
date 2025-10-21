import express from "express";
import {
  createString,
  deleteString,
  getString,
  listStrings,
  naturalLanguage,
} from "../controllers/stringController.js";
const router = express.Router();
router.post("/", createString);
router.get("/", listStrings);
router.get("/filter-by-natural-language", naturalLanguage);
router.delete("/:id", deleteString);

router.get("/:id", getString);

export default router;
