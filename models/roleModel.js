const mongoose = require("mongoose");
const validator = require("validator");
const commonSchema = require("./CommonModel");

const permissionSchema = new mongoose.Schema({
    menuId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        default: null
    },
    isShow: {
        type: Boolean,
        required: false,
        default: false
    }
})

const roleSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Role Name is requied.'],
            trim: true,
            default: ''
        },

        permission: [permissionSchema],

        status: {
            type: String,
            enum: ["Active", "Inactive"],
            required: [true, 'Status is required.'],
            default: 'Active'
        },
    },
    { timestamps: true }
);

roleSchema.add(commonSchema);

const Role = mongoose.model("Role", roleSchema);

module.exports = Role;
