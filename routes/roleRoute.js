const express = require('express');
const router = express.Router()
const { validateSchema } = require('../models/baseModel');
const Role = require('../models/roleModel');
const { roleController } = require('../controllers/roleController');



router.post("", validateSchema(Role), roleController.createUpdateRole);

router.delete("/status/:roleId", roleController.updateRoleStatus);

router.get("", roleController.listRole);

router.get('/details/:id', roleController.roleById);

router.get('/side-menuList', roleController.sideMenuList);


module.exports = router