const mongoose = require("mongoose");
const validator = require("validator");
const commonSchema = require("./CommonModel");

const TaskCategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Role Name is requied.'],
            trim: true,
            default: ''
        },
        type: {
            type: String,
            enum: ["checkbox", "text"],
            required: [true, 'Type is requied.'],
            trim: true,
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

TaskCategorySchema.add(commonSchema);

const TaskCategory = mongoose.model("TaskCategory", TaskCategorySchema);

module.exports = TaskCategory;
