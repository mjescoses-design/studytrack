const express = require("express");
const router = express.Router();
const StudySession = require("../models/StudySession");

// READ: get all sessions, newest first
router.get("/", async (req, res) => {
    try {
        const sessions = await StudySession.find().sort({ date: -1 });
        res.json(sessions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CREATE: add a new session
router.post("/", async (req, res) => {
    try {
        const session = await StudySession.create(req.body);
        res.status(201).json(session);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// UPDATE: edit a session by id
router.put("/:id", async (req, res) => {
    try {
        const session = await StudySession.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!session) return res.status(404).json({ error: "Session not found" });
        res.json(session);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE: remove a session by id
router.delete("/:id", async (req, res) => {
    try {
        const session = await StudySession.findByIdAndDelete(req.params.id);
        if (!session) return res.status(404).json({ error: "Session not found" });
        res.json({ message: "Session deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;