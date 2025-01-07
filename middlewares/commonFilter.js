const { default: mongoose } = require("mongoose");

const commonFilter = {};

// jetla table create thay enu common projection setup karvu ahiya
// start

commonFilter.menu = {
    _id: 1,
    name: 1,
    icon: 1,
    url: 1,
    parentMenu: 1,
    status: 1
};

commonFilter.role = {
    _id: 1,
    name: 1,
    permission: 1,
    status: 1
};

commonFilter.taskCategory = {
    _id: 1,
    name: 1,
    type: 1,
    order: 1,
    status: 1,
};

commonFilter.task = {
    _id: 1,
    counter: 1,
    assignUserId: 1,
    jobNo: 1,
    partyName: 1,
    jobName: 1,
    size: 1,
    operator: 1,
    isView: 1,
    transportation: 1,
    taskPriority: 1,
    Note: 1,
    category: 1,
    taskStatus: 1,
    status: 1,
    createdAt: 1
};

commonFilter.user = {
    _id: 1,
    firstName: 1,
    lastName: 1,
    email: 1,
    phone: 1,
    password: 1,
    isVerified: 1,
    gender: 1,
    address: 1,
    profilePicture: 1,
    status: 1,
};

// end

// pagination setup start
commonFilter.paginationCalculation = async (list, limit, page) => {
    return {
        currentPage: page,
        limit: limit,
        isLastPage: list.length >= limit ? false : true
    }
}
// pagination setup end

const convertIdToObjectId = (id) => {
    return new mongoose.Types.ObjectId(id.toString());
};

module.exports = { commonFilter, convertIdToObjectId };