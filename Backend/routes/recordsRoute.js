import express from "express";
import recordsController from "./recordsController.js";

const router = express.Router();

// GET all records
router.get("/", recordsController.getAllRecords);

// CREATE a record
router.post("/", recordsController.createRecord);

// GET one record
router.get("/:id", recordsController.getRecordById);

// UPDATE a record
router.put("/:id", recordsController.updateRecord);

// DELETE a record
router.delete("/:id", recordsController.deleteRecord);

export default router;
