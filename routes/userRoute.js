const express = require('express');

const router = express.Router()
const { validateSchema } = require('../models/baseModel');
const { authController } = require('../controllers/authController');
const UserModel = require('../models/userModel');
const verifyToken = require('../middlewares/verifyToken');


//ads create and update api (if update then _id pass in query)
router.post("", verifyToken, validateSchema(UserModel), authController.userCreateUpdate);

router.get("", verifyToken, authController.getUsersByStatus);

router.delete('/status/:userId', authController.toggleUserStatus);

router.get('/details/:id', verifyToken, authController.getUserById);

router.post('/login', authController.login);


module.exports = router