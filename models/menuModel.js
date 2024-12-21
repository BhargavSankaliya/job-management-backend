const mongoose = require("mongoose");
const validator = require("validator");
const commonSchema = require("./CommonModel");

const menuSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Role Name is requied.'],
            trim: true,
            default: ''
        },
        icon: {
            type: String,
            required: [true, 'Icon is requied.'],
            trim: true,
            default: ''
        },
        url: {
            type: String,
            required: [true, 'URL is requied.'],
            trim: true,
            default: ''
        },
        parentMenu: {
            type: String,
            required: [false, 'URL is requied.'],
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

menuSchema.add(commonSchema);

const Menu = mongoose.model("Menu", menuSchema);

module.exports = Menu;
