const mongoose = require("mongoose");
const validator = require("validator");
const commonSchema = require("./CommonModel");

const taskHistorySchema = new mongoose.Schema(
    {
        taskId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'TaskId is requied.'],
        },
        taskStatus: {
            type: String,
            enum: ["ToDo", "Progress", "Completed"],
            required: [true, 'Task Status is required.'],
        },
        startTime: {
            type: Date,
            default: Date.now,
            required: true
        },
        endTime: {
            type: Date,
            required: false
        },
        totalMinutes: {
            type: Number,
            required: false
        },
        assignUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        comment: {
            type: String,
            required: false,
            default: ''
        },
        status: {
            type: String,
            enum: ["Active", "Inactive"],
            required: [true, 'Status is required.'],
            default: 'Active'
        },
    },
    { timestamps: true }
);

taskHistorySchema.add(commonSchema);

const taskHistoryModel = mongoose.model("Task-History", taskHistorySchema);

module.exports = taskHistoryModel;
