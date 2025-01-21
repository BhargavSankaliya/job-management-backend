const express = require('express');
const router = express.Router()
const { validateSchema } = require('../models/baseModel');
const Role = require('../models/roleModel');
const TaskModel = require('../models/taskModel');
const { taskController } = require('../controllers/taskController');



router.post("", taskController.createUpdateTask);

router.put("/status/:taskId/:taskStatus", taskController.updateTaskStatus);

router.put("/assign/:taskId/:assignUser", taskController.assignUser);

router.post("/list/all", taskController.listTask);

router.get("/mobile", taskController.mobileTaskList);

router.get("/updateAll", taskController.updateAll);

router.get('/details/:id', taskController.taskById);

router.get('/details-admin/:id', taskController.taskDetailsByIdForAdmin);

router.get('/details-comment/:id', taskController.taskCommentListForAdmin);

router.get('/details-user-time/:id', taskController.taskUserTimeListForAdmin);

router.post('/dashboard-task-count', taskController.taskCountForDashboard);

router.post('/search/:slug', taskController.searchParameter);

router.post('/saveDate', taskController.dateSaveAndUpdate);

router.get('/saveDate', taskController.dateGetUserIdWise);



module.exports = router