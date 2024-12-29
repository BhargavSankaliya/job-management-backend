const { CustomError, errorHandler } = require("../middlewares/error.js");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const createResponse = require("../middlewares/response.js");
const UserModel = require("../models/userModel.js");
const { commonFilter, convertIdToObjectId } = require("../middlewares/commonFilter.js");
const authController = {};
const jwt = require("jsonwebtoken");
const Role = require("../models/roleModel.js");

authController.userCreateUpdate = async (req, res, next) => {
  try {

    if (req.files && !!req.files.profilePicture) {
      req.body.profilePicture = req.files.profilePicture[0].filename;
    }

    if (req.body.roleId != 'null' && !!req.body.roleId) {
      req.body.roleId = convertIdToObjectId(req.body.roleId)
    }

    if (req.query.id) {

      let users = await UserModel.findOneAndUpdate({ _id: convertIdToObjectId(req.query.id) }, req.body)
      return createResponse(null, 200, "User Details Updated Successfully.", res);

    }

    else {

      const findUser = await UserModel.findOne({ email: req.body.email });

      if (!!findUser) {
        if (findUser.email === req.body.email) {
          throw new CustomError("Email already exists!", 400);
        }
      }

      let userCreated = await UserModel.create(
        req.body
      );

      return createResponse(userCreated, 200, "User Created Successfully.", res);

    }

  } catch (error) {
    errorHandler(error, req, res)
  }
}


authController.getUsersByStatus = async (req, res, next) => {
  try {
    let userList = !req.query.status ? await UserModel.aggregate([{ $project: commonFilter.user }]) : await UserModel.aggregate([{ $match: { status: req.query.status } }, { $project: commonFilter.user }]);

    createResponse(userList, 200, "Users retrieved successfully.", res);
  } catch (error) {
    errorHandler(error, req, res);
  }
};

authController.toggleUserStatus = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      throw new CustomError("User not found!", 404);
    }

    let userFind = await UserModel.findById(userId);

    if (!userFind) {
      throw new CustomError("User Details not found!", 404);
    }

    if (userFind.status == 'Active') {
      userFind.status = 'Inactive'
    }
    else if (userFind.status == 'Inactive') {
      userFind.status = 'Active'
    }

    userFind.save();

    createResponse(null, 200, `User ${userFind.status}d successfully.`, res);
  } catch (error) {
    errorHandler(error, req, res);
  }
};

authController.getUserById = async (req, res, next) => {
  try {
    const { id } = req.params; // Get the user ID from the URL parameters

    // Find the user by ID
    const user = await UserModel.findById(id);
    if (!user) {
      throw new CustomError("User not found!", 404);
    }

    createResponse(user, 200, "User retrieved successfully.", res);
  } catch (error) {
    errorHandler(error, req, res);
  }
};
authController.getUserByIdForAdmin = async (req, res, next) => {
  try {
    const { _id } = req.user; // Get the user ID from the URL parameters

    // Find the user by
    let user = await UserModel.findById(_id);

    if (!user) {
      throw new CustomError("User not found!", 404);
    }

    const role = await Role.findById(user.roleId);
    createResponse({...user._doc,roleDetails : role}, 200, "User retrieved successfully.", res);
  } catch (error) {
    errorHandler(error, req, res);
  }
};

authController.login = async (req, res, next) => {
  try {
    const { email, password } = req.body; // Get the user ID from the URL parameters

    // Find the user by ID
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new CustomError("Please Enter correct email!", 404);
    }

    if (password != user.password) {
      throw new CustomError("Please Enter correct password!", 404);
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "365d",
    });

    user.token = token;
    user.save()

    createResponse(user, 200, "User retrieved successfully.", res);
  } catch (error) {
    errorHandler(error, req, res);
  }
};


module.exports = { authController }
