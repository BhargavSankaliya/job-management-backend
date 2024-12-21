const { CustomError, errorHandler } = require("../middlewares/error.js");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const createResponse = require("../middlewares/response.js");
const { convertIdToObjectId, commonFilter } = require("../middlewares/commonFilter.js");
const Menu = require("../models/menuModel.js");
const menuController = {};

menuController.createUpdateMenu = async (req, res, next) => {
  try {

    if (req.query.id) {

      let updateMenu = await Menu.findOneAndUpdate({ _id: convertIdToObjectId(req.query.id) }, req.body);

      return createResponse(null, 200, "Menu Updated Successfully.", res);
    }
    else {
      let userCreated = await Menu.create(
        req.body
      );

      return createResponse(userCreated, 200, "Menu Created Successfully.", res);
    }

  } catch (error) {
    errorHandler(error, req, res)
  }
}

menuController.updateMenuStatus = async (req, res, next) => {
  try {

    const { menuId } = req.params;

    if (!menuId) {
      throw new CustomError("Menu not found!", 404);
    }

    let findMenu = await Menu.findById(menuId);

    if (!findMenu) {
      throw new CustomError("Menu Details not found!", 404);
    }

    if (findMenu.status == 'Active') {
      findMenu.status = 'Inactive'
    }
    else if (findMenu.status == 'Inactive') {
      findMenu.status = 'Active'
    }

    findMenu.save();

    createResponse(null, 200, `Menu ${findMenu.status}d successfully.`, res);
  } catch (error) {
    errorHandler(error, req, res);
  }
};

menuController.listMenu = async (req, res, next) => {
  try {

    let MenuList = !req.query.status ? await Menu.aggregate([{ $project: commonFilter.menu }]) : await Menu.aggregate([{ $match: { status: req.query.status } }, { $project: commonFilter.menu }]);

    createResponse(MenuList, 200, "Menu list get successfully.", res);
  } catch (error) {
    errorHandler(error, req, res);
  }
};

menuController.menuById = async (req, res, next) => {
  try {
    const { id } = req.params; // Get the user ID from the URL parameters

    const menu = await Menu.findById(id);
    if (!menu) {
      throw new CustomError("Menu not found!", 404);
    }

    createResponse(menu, 200, "Menu retrieved successfully.", res);
  } catch (error) {
    errorHandler(error, req, res);
  }
};

module.exports = { menuController }
