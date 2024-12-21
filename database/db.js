const mongoose = require("mongoose")
// const config = require("../environmentVariable.json")
const config = require('../config')

const connectDB = async () => {
   try {
      await mongoose.connect(config.db.uri)
      console.log("database connected successfully!")
   }
   catch (error) {
      console.log("database is not connected! " + error)
   }
}

module.exports = connectDB