const mongoose = require("mongoose");
const validator = require("validator");
const commonSchema = require("./CommonModel");

const clientMasterSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is requied.'],
            trim: true,
            default: ''
        },
        email: {
            type: String,
            required: [true, 'Email is requied.'],
            trim: true,
            default: ''
        },
        whatsappNumberCountryCode: {
            type: String,
            required: [true, 'Whatsapp Country Code is requied.'],
            trim: true,
            default: ''
        },
        whatsappNumber: {
            type: String,
            required: [true, 'Whatsapp Number is requied.'],
            trim: true,
            default: ''
        },
        phoneNumberCountryCode: {
            type: String,
            required: [true, 'Country Code is requied.'],
            trim: true,
            default: ''
        },
        phoneNumber: {
            type: String,
            required: [true, 'Phone Number is requied.'],
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

clientMasterSchema.add(commonSchema);

const ClientMasterModel = mongoose.model("clientMaster", clientMasterSchema);

module.exports = ClientMasterModel;
