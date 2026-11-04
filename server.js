const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB error:", err.message));

app.use("/api/sessions", require("./routes/sessions"));
app.get("/api/test", (req, res) => {
    res.json({ message: "StudyTrack API is working!" });
});

app.listen(PORT, () => {
    console.log(`StudyTrack is running on port ${PORT}`);
});