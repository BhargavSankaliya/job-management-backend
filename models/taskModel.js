const mongoose = require("mongoose");
const validator = require("validator");
const commonSchema = require("./CommonModel");


const categorySchema = new mongoose.Schema({
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
    },
    value: {
        type: String,
        required: false,
        default: false
    }
})

const taskSchema = new mongoose.Schema(
    {
        counter: {
            type: Number,
            required: [true, 'Counter Number is requied.'],
            trim: true,
            default: ''
        },
        jobNo: {
            type: Number,
            required: [false, 'Job No. is requied.'],
            default: ''
        },
        partyName: {
            type: String,
            required: [true, 'Party Name is requied.'],
            trim: true,
            default: ''
        },
        jobName: {
            type: String,
            required: [true, 'Party Name is requied.'],
            trim: true,
            default: ''
        },
        size: {
            type: String,
            required: [true, 'Size is requied.'],
            trim: true,
            default: ''
        },
        operator: {
            type: String,
            required: [true, 'Operator is requied.'],
            trim: true,
            default: ''
        },
        transportation: {
            type: String,
            required: [false, 'Transportation is requied.'],
            trim: true,
            default: ''
        },
        Note: {
            type: String,
            required: [false, 'Note is requied.'],
            trim: true,
            default: ''
        },

        assignUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
        },

        category: [categorySchema],

        taskStatus: {
            type: String,
            enum: ["ToDo", "Progress", "Completed"],
            required: [true, 'Task Status is required.'],
            default: 'ToDo'
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

taskSchema.add(commonSchema);

const TaskModel = mongoose.model("Task", taskSchema);

module.exports = TaskModel;
