const express = require('express');
const router = express.Router()
const { validateSchema } = require('../models/baseModel');
const Role = require('../models/roleModel');
const TaskModel = require('../models/taskModel');
const { taskController } = require('../controllers/taskController');



router.post("", validateSchema(TaskModel), taskController.createUpdateTask);

router.put("/status/:taskId/:taskStatus", taskController.updateTaskStatus);

router.put("/assign/:taskId/:assignUser", taskController.assignUser);

router.get("", taskController.listTask);

router.get("/mobile", taskController.mobileTaskList);

router.get('/details/:id', taskController.taskById);

router.get('/details-admin/:id', taskController.taskDetailsByIdForAdmin);

router.get('/details-comment/:id', taskController.taskCommentListForAdmin);

router.get('/details-user-time/:id', taskController.taskUserTimeListForAdmin);

router.post('/dashboard-task-count', taskController.taskCountForDashboard);



module.exports = router