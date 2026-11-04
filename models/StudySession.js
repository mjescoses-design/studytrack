const mongoose = require("mongoose");

const studySessionSchema = new mongoose.Schema(
    {
        subject: { type: String, required: true },
        topic: { type: String, required: true },
        duration: { type: Number, required: true },
        date: { type: Date, required: true },
        notes: { type: String, default: "" }
    },
    { collection: "studySessions" }
);

module.exports = mongoose.model("StudySession", studySessionSchema);