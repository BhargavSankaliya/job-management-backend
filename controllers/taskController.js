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
      const userDetails = await UserModel.findById(assignUser);
      await taskHistoryForUpdateStatus(findTask, `Task Assign the user to ${userDetails.firstName} ${userDetails.lastName}`);
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

    let query = [
      {
        $match: {
          createdAt: { $gte: new Date(req.body.startDate), $lt: new Date(req.body.endDate) },
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
      {
        $project: { ...commonFilter.task }
      },
      {
        $lookup: {
          from: "users",
          localField: "assignUserId",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          userName: {
            $concat: [
              "$userDetails.firstName",
              " ",
              "$userDetails.lastName"
            ]
          }
        }
      },
    ]

    if (req.query.status) {
      query.push({
        $match: {
          status: req.query.status
        }
      })
    }

    if (req.query.taskStatus) {
      query.push({
        $match: {
          taskStatus: req.query.taskStatus
        }
      })
    }

    let taskList = await TaskModel.aggregate(query)

    createResponse(taskList, 200, "Task list get successfully.", res);
  } catch (error) {
    errorHandler(error, req, res);
  }
};

taskController.mobileTaskList = async (req, res, next) => {
  try {

    let query = [
      {
        $match: {
          assignUserId: convertIdToObjectId(req.user._id)
        }
      },
      {
        $sort: {
          taskPriority: -1
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

taskController.taskDetailsByIdForAdmin = async (req, res, next) => {
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
          from: "users",
          localField: "assignUserId",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true
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

taskController.taskCommentListForAdmin = async (req, res, next) => {
  try {
    const { id } = req.params; // Get the user ID from the URL parameters

    let query = [
      {
        $match: {
          taskId: convertIdToObjectId(id)
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "assignUserId",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true
        }
      },
    ]

    const taskHistory = await taskHistoryModel.aggregate(query);
    if (taskHistory.length == 0) {
      throw new CustomError("Task History not found!", 404);
    }

    createResponse(taskHistory, 200, "Task History retrieved successfully.", res);
  } catch (error) {
    errorHandler(error, req, res);
  }
};

taskController.taskUserTimeListForAdmin = async (req, res, next) => {
  try {
    const { id } = req.params; // Get the user ID from the URL parameters

    let query = [
      {
        $match: {
          taskId: convertIdToObjectId(id),
          taskStatus: "Progress"
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "assignUserId",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          userName: {
            $concat: [
              "$userDetails.firstName",
              " ",
              "$userDetails.lastName"
            ]
          }
        }
      },
      {
        $addFields: {
          endTime: {
            $ifNull: ["$endTime", new Date()]
          }
        }
      },
      {
        $addFields: {
          totalMinutes: {
            $divide: [
              {
                $subtract: ["$endTime", "$startTime"]
              },
              1000 * 60
            ]
          }
        }
      },
      {
        $group: {
          _id: "$assignUserId",
          totalMinutes: {
            $sum: "$totalMinutes"
          },
          userName: {
            $first: "$userName"
          }
        }
      },
      {
        $addFields: {
          hours: {
            $round: {
              $floor: {
                $divide: ["$totalMinutes", 60]
              }
            }
          },
          minutes: {
            $round: {
              $mod: ["$totalMinutes", 60]
            }
          }
        }
      },
      {
        $addFields: {
          totalTime: {
            $concat: [
              {
                $cond: {
                  if: {
                    $gte: ["$hours", 10]
                  },
                  then: {
                    $concat: [
                      {
                        $toString: "$hours"
                      },
                      " Hours"
                    ]
                  },
                  else: {
                    $concat: [
                      "0",
                      {
                        $toString: "$hours"
                      },
                      " Hours"
                    ]
                  }
                }
              },
              " ",
              {
                $cond: {
                  if: {
                    $gte: ["$minutes", 10]
                  },
                  then: {
                    $concat: [
                      {
                        $toString: "$minutes"
                      },
                      " Minutes"
                    ]
                  },
                  else: {
                    $concat: [
                      "0",
                      {
                        $toString: "$minutes"
                      },
                      " Minutes"
                    ]
                  }
                }
              }
            ]
          }
        }
      },
      {
        $project: {
          _id: 1,
          userName: 1,
          totalTime: 1
        }
      }
    ]

    const taskHistory = await taskHistoryModel.aggregate(query);
    if (taskHistory.length == 0) {
      return createResponse([], 200, "Task History retrieved successfully.", res);
    }

    createResponse(taskHistory, 200, "Task History retrieved successfully.", res);
  } catch (error) {
    errorHandler(error, req, res);
  }
};

taskController.taskCountForDashboard = async (req, res, next) => {
  try {
    const { startDate, endDate, userId, taskStatus, taskPriority } = req.body; // Get the user ID from the URL parameters

    // console.log(new Date(startDate));
    // console.log(new Date(endDate));
    let matchUserCondition = {}
    let matchStatusCondition = {}
    let matchPriorityCondition = {}

    if (!!userId) {
      matchUserCondition = { assignUserId: convertIdToObjectId(userId) }
    }
    if (!!taskStatus) {
      matchStatusCondition = { taskStatus: taskStatus }
    }
    if (!!taskPriority) {
      matchPriorityCondition = { taskPriority: taskPriority }
    }

    let todoQuery = [
      {
        $match: {
          createdAt: { $gte: new Date(startDate), $lt: new Date(endDate) },
          taskStatus: "ToDo"
        }
      }
    ];

    let progressQuery = [
      {
        $match: {
          taskStatus: "Progress",
          createdAt: { $gte: new Date(startDate), $lt: new Date(endDate) }
        }
      }
    ];

    let completedQuery = [
      {
        $match: {
          taskStatus: "Completed",
          createdAt: { $gte: new Date(startDate), $lt: new Date(endDate) }
        }
      }
    ];

    let allQuery = [
      {
        $match: {
          createdAt: { $gte: new Date(startDate), $lt: new Date(endDate) }
        }
      }
    ];

    let userIdWiseTaskList = [
      {
        $match: {
          createdAt: { $gte: new Date(startDate), $lt: new Date(endDate) }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "assignUserId",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          userName: {
            $concat: [
              "$userDetails.firstName",
              " ",
              "$userDetails.lastName"
            ]
          }
        }
      },
      {
        $sort: {
          taskPriority: -1
        }
      }
    ]

    if (!!userId) {
      allQuery.push({ $match: matchUserCondition });
      todoQuery.push({ $match: matchUserCondition });
      progressQuery.push({ $match: matchUserCondition });
      completedQuery.push({ $match: matchUserCondition });
      userIdWiseTaskList.push({ $match: matchUserCondition });
    }
    if (!!taskStatus) {
      allQuery.push({ $match: matchStatusCondition });
      todoQuery.push({ $match: matchStatusCondition });
      progressQuery.push({ $match: matchStatusCondition });
      completedQuery.push({ $match: matchStatusCondition });
      userIdWiseTaskList.push({ $match: matchStatusCondition });
    }
    if (!!taskPriority) {
      allQuery.push({ $match: matchPriorityCondition });
      todoQuery.push({ $match: matchPriorityCondition });
      progressQuery.push({ $match: matchPriorityCondition });
      completedQuery.push({ $match: matchPriorityCondition });
      userIdWiseTaskList.push({ $match: matchPriorityCondition });
    }

    const [all, todo, progress, completed, taskListByUserId] = await Promise.all([TaskModel.aggregate(allQuery), TaskModel.aggregate(todoQuery), TaskModel.aggregate(progressQuery), TaskModel.aggregate(completedQuery), TaskModel.aggregate(userIdWiseTaskList)])

    createResponse({ all: all.length, todo: todo.length, progress: progress.length, completed: completed.length, taskListByUserId }, 200, "Task Count Retrived Successfully.", res);
  } catch (error) {
    errorHandler(error, req, res);
  }
};



taskController.searchParameter = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { search } = req.body;

    let query = [
      {
        $match: {
          [slug]: { $regex: search, $options: "i" },
        },
      },
      {
        $project: {
          [slug]: `$${slug}`,
          _id: 0,
        },
      },
    ];

    const searchList = await TaskModel.aggregate(query);

    if (searchList.length === 0) {
      // Return immediately to avoid executing the next line
      return createResponse([], 200, "Search list retrieved successfully.", res);
    }

    createResponse(searchList, 200, "Search list retrieved successfully.", res);
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
