const { CustomError, errorHandler } = require("../middlewares/error.js");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const createResponse = require("../middlewares/response.js");
const UserModel = require("../models/userModel.js");
const { commonFilter, convertIdToObjectId } = require("../middlewares/commonFilter.js");
const Role = require("../models/roleModel.js");
const roleController = {};

roleController.createUpdateRole = async (req, res, next) => {
  try {

    if (req.query.id) {

      if (req.body.permission.length > 0) {
        req.body.permission.map((x) => x.menuId = convertIdToObjectId(x.menuId));
      }

      let updateRole = await Role.findOneAndUpdate({ _id: convertIdToObjectId(req.query.id) }, req.body);

      return createResponse(null, 200, "Role Updated Successfully.", res);
    }
    else {
      if (req.body.permission.length > 0) {
        req.body.permission = req.body.permission.map((x) => convertIdToObjectId(x.menuId));
      }

      let userCreated = await Role.create(
        req.body
      );

      return createResponse(userCreated, 200, "Role Created Successfully.", res);
    }

  } catch (error) {
    errorHandler(error, req, res)
  }
}

roleController.updateRoleStatus = async (req, res, next) => {
  try {

    const { roleId } = req.params;

    if (!roleId) {
      throw new CustomError("Role not found!", 404);
    }

    let findRole = await Role.findById(roleId);

    if (!findRole) {
      throw new CustomError("Role Details not found!", 404);
    }

    if (findRole.status == 'Active') {
      findRole.status = 'Inactive'
    }
    else if (findRole.status == 'Inactive') {
      findRole.status = 'Active'
    }

    findRole.save();

    createResponse(null, 200, `Role ${findRole.status}d successfully.`, res);
  } catch (error) {
    errorHandler(error, req, res);
  }
};

roleController.listRole = async (req, res, next) => {
  try {

    let roleList = !req.query.status ? await Role.aggregate([{ $project: commonFilter.role }]) : await Role.aggregate([{ $match: { status: req.query.status } }, { $project: commonFilter.role }]);

    createResponse(roleList, 200, "Role list get successfully.", res);
  } catch (error) {
    errorHandler(error, req, res);
  }
};

roleController.roleById = async (req, res, next) => {
  try {
    const { id } = req.params; // Get the user ID from the URL parameters

    const role = await Role.findById(id);
    if (!role) {
      throw new CustomError("Role not found!", 404);
    }

    createResponse(role, 200, "Role retrieved successfully.", res);
  } catch (error) {
    errorHandler(error, req, res);
  }
};

roleController.sideMenuList = async (req, res, next) => {
  try {
    const id = req.user.roleId; // Get the user ID from the URL parameters

    const role = await Role.findById(id);
    if (!role) {
      throw new CustomError("Role not found!", 404);
    }

    let query = [
      {
        $match: {
          _id: convertIdToObjectId(req.query.id ? req.query.id : req.user.roleId)
        }
      },
      {
        $lookup: {
          from: "menus",
          localField: "permission.menuId",
          foreignField: "_id",
          as: "menuList",
          pipeline: [
            {
              $match: {
                status: "Active"
              }
            },
            {
              $project: commonFilter.menu
            }
          ]
        }
      },
      {
        $unwind: {
          path: "$menuList",
          preserveNullAndEmptyArrays: false
        }
      },
      {
        $replaceRoot: {
          newRoot: {
            $ifNull: ["$menuList", {}]
          }
        }
      }
    ]

    let menuList = await Role.aggregate(query);

    createResponse(menuList, 200, "Role retrieved successfully.", res);
  } catch (error) {
    errorHandler(error, req, res);
  }
};

module.exports = { roleController }
