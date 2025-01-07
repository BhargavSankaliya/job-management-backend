const { CustomError, errorHandler } = require("../middlewares/error.js");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const createResponse = require("../middlewares/response.js");
const { convertIdToObjectId, commonFilter } = require("../middlewares/commonFilter.js");
const Menu = require("../models/menuModel.js");
const TaskCategory = require("../models/taskCategoryModel.js");
const taskCategoryController = {};

taskCategoryController.createUpdateTaskCategory = async (req, res, next) => {
  try {

    if (req.query.id) {

      let update = await TaskCategory.findOneAndUpdate({ _id: convertIdToObjectId(req.query.id) }, req.body);

      return createResponse(null, 200, "Task Category Updated Successfully.", res);
    }
    else {
      let taskCategory = await TaskCategory.create(
        req.body
      );

      return createResponse(taskCategory, 200, "Task Category Created Successfully.", res);
    }

  } catch (error) {
    errorHandler(error, req, res)
  }
}

taskCategoryController.updateTaskCategoryStatus = async (req, res, next) => {
  try {

    const { taskCategoryId } = req.params;

    if (!taskCategoryId) {
      throw new CustomError("Task Category not found!", 404);
    }

    let findTaskCategory = await TaskCategory.findById(taskCategoryId);

    if (!findTaskCategory) {
      throw new CustomError("Task Category Details not found!", 404);
    }

    if (findTaskCategory.status == 'Active') {
      findTaskCategory.status = 'Inactive'
    }
    else if (findTaskCategory.status == 'Inactive') {
      findTaskCategory.status = 'Active'
    }

    findTaskCategory.save();

    createResponse(null, 200, `Task Category ${findTaskCategory.status}d successfully.`, res);
  } catch (error) {
    errorHandler(error, req, res);
  }
};

taskCategoryController.listTaskCategory = async (req, res, next) => {
  try {

    let taskCategoryList = !req.query.status ? await TaskCategory.aggregate([{ $project: commonFilter.taskCategory }, { $sort: { order: 1 } }]) : await TaskCategory.aggregate([{ $match: { status: req.query.status } }, { $project: commonFilter.taskCategory }, { $sort: { order: 1 } }]);

    createResponse(taskCategoryList, 200, "Task Category list get successfully.", res);
  } catch (error) {
    errorHandler(error, req, res);
  }
};

taskCategoryController.taskCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params; // Get the user ID from the URL parameters

    const taskCategory = await TaskCategory.findById(id);
    if (!taskCategory) {
      throw new CustomError("Task Category not found!", 404);
    }

    createResponse(taskCategory, 200, "Task Category retrieved successfully.", res);
  } catch (error) {
    errorHandler(error, req, res);
  }
};

module.exports = { taskCategoryController }
