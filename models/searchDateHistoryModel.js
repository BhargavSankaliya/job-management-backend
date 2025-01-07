const mongoose = require("mongoose");
const validator = require("validator");
const commonSchema = require("./CommonModel");

const SearchDateHistorySchema = new mongoose.Schema(
    {
        startDate: {
            type: Date,
            required: [true, 'Start Date is requied.'],
            default: ''
        },
        endDate: {
            type: Date,
            required: [true, 'End Date is requied.'],
            trim: true,
            default: 0
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'UserId is requied.'],
        },
    },
    { timestamps: true }
);

const SearchDateHistoryModel = mongoose.model("SearchDateHistory", SearchDateHistorySchema);

module.exports = SearchDateHistoryModel;
