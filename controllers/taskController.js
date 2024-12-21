const { CustomError, errorHandler } = require("../middlewares/error.js");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const createResponse = require("../middlewares/response.js");
const { convertIdToObjectId, commonFilter } = require("../middlewares/commonFilter.js");
const Menu = require("../models/menuModel.js");
const TaskModel = require("../models/taskModel.js");
const taskHistoryModel = require("../models/taskHistoryModel.js");
const taskController = {};

taskController.createUpdateTask = async (req, res, next) => {
  try {

    if (req.query.id) {

      let update = await TaskModel.findOneAndUpdate({ _id: convertIdToObjectId(req.query.id) }, req.body);

      return createResponse(null, 200, "Task Updated Successfully.", res);
    }
    else {
      let taskCreate = await TaskModel.create(
        req.body
      );

      let history = await createTaskHistory(taskCreate);

      return createResponse(taskCreate, 200, "Task Created Successfully.", res);
    }

  } catch (error) {
    errorHandler(error, req, res)
  }
}

taskController.updateTaskStatus = async (req, res, next) => {
  try {

    const { taskId, taskStatus } = req.params;

    if (!taskId) {
      throw new CustomError("Task not found!", 404);
    }

    let findTask = await TaskModel.findById(taskId);

    if (!findTask) {
      throw new CustomError("Task Details not found!", 404);
    }

    const oldTaskStatus = findTask.taskStatus

    if (findTask.taskStatus == 'ToDo' && (taskStatus == 'Progress' || taskStatus == 'Completed')) {
      findTask.taskStatus = taskStatus;
      await taskHistoryForUpdateStatus(findTask)
    }
    else if (findTask.taskStatus == 'Progress' && (taskStatus == 'ToDo' || taskStatus == 'Completed')) {
      findTask.taskStatus = taskStatus;
      await taskHistoryForUpdateStatus(findTask);
    }

    findTask.save();


    createResponse(null, 200, `Task Status updated from ${oldTaskStatus} to ${findTask.taskStatus} successfully.`, res);
  } catch (error) {
    errorHandler(error, req, res);
  }
};

taskController.assignUser = async (req, res, next) => {
  try {

    const { taskId, assignUser } = req.params;

    if (!taskId) {
      throw new CustomError("Task not found!", 404);
    }

    let findTask = await TaskModel.findById(taskId);

    if (!findTask) {
      throw new CustomError("Task Details not found!", 404);
    }

    if (findTask.assignUserId.toString() != assignUser) {
      findTask.assignUserId = convertIdToObjectId(assignUser);
    }
    else {
      throw new CustomError("You can't assign your self!", 404);
    }

    findTask.save();

    createResponse(null, 200, `Task assigned successfully.`, res);
  } catch (error) {
    errorHandler(error, req, res);
  }
};

taskController.listTask = async (req, res, next) => {
  try {

    let taskList = !req.query.status ? await TaskModel.aggregate([{ $project: commonFilter.task }]) : await TaskModel.aggregate([{ $match: { status: req.query.status } }, { $project: commonFilter.task }]);

    createResponse(taskList, 200, "Task list get successfully.", res);
  } catch (error) {
    errorHandler(error, req, res);
  }
};

taskController.taskById = async (req, res, next) => {
  try {
    const { id } = req.params; // Get the user ID from the URL parameters

    const taskCategory = await TaskModel.findById(id);
    if (!taskCategory) {
      throw new CustomError("Task Category not found!", 404);
    }

    createResponse(taskCategory, 200, "Task Category retrieved successfully.", res);
  } catch (error) {
    errorHandler(error, req, res);
  }
};

const createTaskHistory = async (task) => {

  let history = await taskHistoryModel.create({
    taskId: task._id,
    taskStatus: task.taskStatus,
    startTime: Date.now(),
    endTime: null,
    totalMinutes: 0,
    assignUserId: task.assignUserId,
  })

  return history

}

const taskHistoryForUpdateStatus = async (task) => {

  let findOldHistory = await taskHistoryModel.findOne({ taskId: task._id, endTime: null });

  if (!!findOldHistory) {

    findOldHistory.endTime = Date.now();
    findOldHistory.save()
  }

  let history = await taskHistoryModel.create({
    taskId: task._id,
    taskStatus: task.taskStatus,
    startTime: Date.now(),
    endTime: null,
    totalMinutes: 0,
    assignUserId: task.assignUserId,
  })

  return history


}

module.exports = { taskController }
