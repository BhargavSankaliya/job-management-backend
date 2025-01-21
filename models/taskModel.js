const mongoose = require("mongoose");
const validator = require("validator");
const commonSchema = require("./CommonModel");
const JobCounter = require("./jobCounterModel");


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
            type: String,
            required: [false, 'Job No. is requied.'],
            default: ''
        },
        taskPriority: {
            type: Number,
            required: [true, 'Task Priority is required.'],
            default: 10
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
            enum: ["ToDo", "Progress", "Completed", "Hold", "Dispatch", "Billing", "Cancel"],
            required: [true, 'Task Status is required.'],
            default: 'ToDo'
        },

        completedPicture: {
            type: String,
            required: false,
            default: ''
        },
        billingPicture: {
            type: String,
            required: false,
            default: ''
        },
        initialImage: {
            type: String,
            required: false,
            default: ''
        },
        isHold: {
            type: Boolean,
            required: false,
            default: false
        },
        isCancel: {
            type: Boolean,
            required: false,
            default: false
        },
        finalCounter: {
            type: String,
            required: false,
            default: ''
        },
        remarks: {
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

        isView: {
            required: false,
            type: Boolean,
            default: false
        },
    },
    { timestamps: true }
);

taskSchema.add(commonSchema);

// Pre-save hook to handle jobNo
taskSchema.pre("save", async function (next) {
    const task = this;

    if (!task.jobNo) {
        const currentMonth = new Date().toISOString().slice(0, 7); // Format: YYYY-MM

        // Find or create the job counter for the current month
        let jobCounter = await JobCounter.findOne({ month: currentMonth });

        if (!jobCounter) {
            jobCounter = new JobCounter({ month: currentMonth, counter: 0 });
        }

        // Increment the counter and format it as 0001, 0002, etc.
        jobCounter.counter += 1;
        await jobCounter.save();

        task.jobNo = jobCounter.counter.toString().padStart(4, "0"); // Pad with leading zeros
    }

    next();
});

const TaskModel = mongoose.model("Task", taskSchema);

module.exports = TaskModel;
