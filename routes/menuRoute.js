const express = require('express');
const router = express.Router()
const { validateSchema } = require('../models/baseModel');
const Menu = require('../models/menuModel');
const { menuController } = require('../controllers/menuController');



router.post("", validateSchema(Menu), menuController.createUpdateMenu);

router.delete("/status/:menuId", menuController.updateMenuStatus);

router.get("", menuController.listMenu);

router.get('/:id', menuController.menuById);


module.exports = router