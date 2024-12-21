const express = require('express');
const router = express.Router()
const { validateSchema } = require('../models/baseModel');
const TaskCategory = require('../models/taskCategoryModel');
const { taskCategoryController } = require('../controllers/taskCategoryController');



router.post("", validateSchema(TaskCategory), taskCategoryController.createUpdateTaskCategory);

router.delete("/status/:taskCategoryId", taskCategoryController.updateTaskCategoryStatus);

router.get("", taskCategoryController.listTaskCategory);

router.get('/details/:id', taskCategoryController.taskCategoryById);


module.exports = router