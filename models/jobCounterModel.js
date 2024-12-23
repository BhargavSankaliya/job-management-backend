const mongoose = require("mongoose");

const jobCounterSchema = new mongoose.Schema({
    month: { type: String, required: true }, // Format: YYYY-MM
    counter: { type: Number, required: true, default: 0 }
});

const JobCounter = mongoose.model("JobCounter", jobCounterSchema);

module.exports = JobCounter;