const { CustomError, errorHandler } = require("../middlewares/error.js");
const mongoose = require("mongoose");
const createResponse = require("../middlewares/response.js");
const { commonFilter, convertIdToObjectId } = require("../middlewares/commonFilter.js");
const ClientMasterModel = require("../models/clientMasterModel.js");
const { taskController } = require("./taskController.js");
const clientMasterController = {};

clientMasterController.createUpdate = async (req, res, next) => {
  try {

    if (req.query.id) {

      let updateClientDetails = await ClientMasterModel.findOneAndUpdate({ _id: convertIdToObjectId(req.query.id) }, req.body);

      return createResponse(null, 200, "Client Details Updated Successfully.", res);
    }
    else {

      let clientCreated = await ClientMasterModel.create(req.body);

      return createResponse(clientCreated, 200, "Client Created Successfully.", res);
    }

  } catch (error) {
    errorHandler(error, req, res)
  }
}

clientMasterController.updateClientStatus = async (req, res, next) => {
  try {

    const { clientId } = req.params;

    if (!clientId) {
      throw new CustomError("Client not found!", 404);
    }

    let clientDetails = await ClientMasterModel.findById(clientId);

    if (!clientDetails) {
      throw new CustomError("Client Details not found!", 404);
    }

    if (clientDetails.status == 'Active') {
      clientDetails.status = 'Inactive'
    }
    else if (clientDetails.status == 'Inactive') {
      clientDetails.status = 'Active'
    }

    clientDetails.save();

    createResponse(null, 200, `Client ${clientDetails.status}d successfully.`, res);
  } catch (error) {
    errorHandler(error, req, res);
  }
};

clientMasterController.listOfClient = async (req, res, next) => {
  try {

    let clientMasterList = !req.query.status ? await ClientMasterModel.aggregate([{ $match: { isDeleted: false } }]) : await ClientMasterModel.aggregate([{ $match: { status: req.query.status } }]);

    createResponse(clientMasterList, 200, "Client list get successfully.", res);
  } catch (error) {
    errorHandler(error, req, res);
  }
};

clientMasterController.createMultipleClient = async (req, res, next) => {
  try {

    let fetcheName = await taskController.fetchPartyName();
    fetcheName = fetcheName.map((x) => { return { name: x.partyName, email: "abc@gmail.com", phoneNumberCountryCode: "+91", phoneNumber: "998866557744", whatsappNumberCountryCode: "+91", whatsappNumber: "998866557744" } });

    const entry = fetcheName.map(async (x) => {
      await ClientMasterModel.create(x);
    })

    await Promise.all(entry);

    createResponse(entry, 200, "Client list get successfully.", res);
  } catch (error) {
    errorHandler(error, req, res);
  }
};

clientMasterController.clientById = async (req, res, next) => {
  try {
    const { id } = req.params; // Get the user ID from the URL parameters

    const ClientDetails = await ClientMasterModel.findById(id);
    if (!ClientDetails) {
      throw new CustomError("Client not found!", 404);
    }

    createResponse(ClientDetails, 200, "Client Details retrieved successfully.", res);
  } catch (error) {
    errorHandler(error, req, res);
  }
};

module.exports = { clientMasterController }
