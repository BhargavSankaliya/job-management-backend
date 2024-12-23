const { CustomError, errorHandler } = require("../middlewares/error.js");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const createResponse = require("../middlewares/response.js");
const { convertIdToObjectId, commonFilter } = require("../middlewares/commonFilter.js");
const Menu = require("../models/menuModel.js");
const TaskModel = require("../models/taskModel.js");
const taskHistoryModel = require("../models/taskHistoryModel.js");
const UserModel = require("../models/userModel.js");
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
      await taskHistoryForUpdateStatus(findTask, `Task Status updated from ${oldTaskStatus} to ${findTask.taskStatus} successfully.`)
    }
    else if (findTask.taskStatus == 'Progress' && (taskStatus == 'ToDo' || taskStatus == 'Completed')) {
      findTask.taskStatus = taskStatus;

      if (req.files && req.files.completedPicture[0]) {
        findTask.completedPicture = req.files.completedPicture[0].filename
      }

      await taskHistoryForUpdateStatus(findTask, `Task Status updated from ${oldTaskStatus} to ${findTask.taskStatus} successfully.`);
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

      const userDetails = await UserModel.findById(assignUser);

      await taskHistoryForUpdateStatus(findTask, `Task Assign the user to ${userDetails.firstName} ${userDetails.lastName}`);
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

    let query = [
      {
        $lookup: {
          from: "taskcategories",
          localField: "category.categoryId",
          foreignField: "_id",
          as: "categoryDetails"
        }
      },
      {
        $addFields: {
          category: {
            $map: {
              input: "$category",
              as: "cat",
              in: {
                $mergeObjects: [
                  "$$cat",
                  {
                    name: {
                      $arrayElemAt: [
                        {
                          $map: {
                            input: {
                              $filter: {
                                input:
                                  "$categoryDetails",
                                as: "detail",
                                cond: {
                                  $eq: [
                                    "$$detail._id",
                                    "$$cat.categoryId"
                                  ]
                                }
                              }
                            },
                            as: "matchedDetail",
                            in: "$$matchedDetail.name"
                          }
                        },
                        0
                      ]
                    },
                    type: {
                      $arrayElemAt: [
                        {
                          $map: {
                            input: {
                              $filter: {
                                input:
                                  "$categoryDetails",
                                as: "detail",
                                cond: {
                                  $eq: [
                                    "$$detail._id",
                                    "$$cat.categoryId"
                                  ]
                                }
                              }
                            },
                            as: "matchedDetail",
                            in: "$$matchedDetail.type"
                          }
                        },
                        0
                      ]
                    }
                  }
                ]
              }
            }
          }
        }
      },
      {
        $project: { ...commonFilter.task }
      }
    ]

    if (req.query.status) {
      query.push({
        $match: {
          status: req.query.status
        }
      })
    }

    let taskList = await TaskModel.aggregate(query)

    createResponse(taskList, 200, "Task list get successfully.", res);
  } catch (error) {
    errorHandler(error, req, res);
  }
};

taskController.taskById = async (req, res, next) => {
  try {
    const { id } = req.params; // Get the user ID from the URL parameters

    let query = [
      {
        $match: {
          _id: convertIdToObjectId(id)
        }
      },
      {
        $lookup: {
          from: "taskcategories",
          localField: "category.categoryId",
          foreignField: "_id",
          as: "categoryDetails"
        }
      },
      {
        $addFields: {
          category: {
            $map: {
              input: "$category",
              as: "cat",
              in: {
                $mergeObjects: [
                  "$$cat",
                  {
                    name: {
                      $arrayElemAt: [
                        {
                          $map: {
                            input: {
                              $filter: {
                                input:
                                  "$categoryDetails",
                                as: "detail",
                                cond: {
                                  $eq: [
                                    "$$detail._id",
                                    "$$cat.categoryId"
                                  ]
                                }
                              }
                            },
                            as: "matchedDetail",
                            in: "$$matchedDetail.name"
                          }
                        },
                        0
                      ]
                    },
                    type: {
                      $arrayElemAt: [
                        {
                          $map: {
                            input: {
                              $filter: {
                                input:
                                  "$categoryDetails",
                                as: "detail",
                                cond: {
                                  $eq: [
                                    "$$detail._id",
                                    "$$cat.categoryId"
                                  ]
                                }
                              }
                            },
                            as: "matchedDetail",
                            in: "$$matchedDetail.type"
                          }
                        },
                        0
                      ]
                    }
                  }
                ]
              }
            }
          }
        }
      },
    ]

    const taskCategory = await TaskModel.aggregate(query);
    if (!taskCategory[0]) {
      throw new CustomError("Task Category not found!", 404);
    }

    createResponse(taskCategory[0], 200, "Task Category retrieved successfully.", res);
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
    comment: "Task Created"
  })

  return history

}

const taskHistoryForUpdateStatus = async (task, comment) => {

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
    comment: comment,
    totalMinutes: 0,
    assignUserId: task.assignUserId,
  })

  return history
}

module.exports = { taskController }
