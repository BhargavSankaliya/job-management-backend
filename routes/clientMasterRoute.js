const express = require('express');
const router = express.Router()
const { validateSchema } = require('../models/baseModel');
const { clientMasterController } = require('../controllers/clientMasterController');
const ClientMasterModel = require('../models/clientMasterModel');



router.post("", validateSchema(ClientMasterModel), clientMasterController.createUpdate);

router.delete("/status/:clientId", clientMasterController.updateClientStatus);

router.get("", clientMasterController.listOfClient);

router.get("/test", clientMasterController.createMultipleClient);

router.get('/details/:id', clientMasterController.clientById);

module.exports = router