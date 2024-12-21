const express = require("express");
const connectDB = require("./database/db");
const app = express();
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const path = require("path");
const userRoute = require("./routes/userRoute");
const roleRoute = require("./routes/roleRoute");
const menuRoute = require("./routes/menuRoute");
const taskRoute = require("./routes/taskRoute");
const taskCategoryRoute = require("./routes/taskCategoryRoute");
const { errorHandler } = require("./middlewares/error");
const verifyToken = require("./middlewares/verifyToken");
const config = require('./config/index')
const multer = require("multer");
const fs = require("fs");
const cors = require("cors");

dotenv.config();
app.use(cors());
app.use(express.json({ limit: "2gb" }));
app.use(express.urlencoded({ limit: "2gb", extended: true }));
app.use(cookieParser());

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dirPath = "uploads";
    if (file.fieldname === "profilePicture") {
      dirPath = "uploads/profilePicture";
    }

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    cb(null, dirPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});

// Create upload middleware
const upload = multer({ storage: storage });

// Define upload fields
const cpUpload = upload.fields([
  { name: "profilePicture", maxCount: 1 },
]);

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/role", verifyToken, roleRoute);
app.use("/api/menu", verifyToken, menuRoute);
app.use("/api/user", cpUpload, userRoute);
app.use("/api/task", verifyToken, taskRoute);
app.use("/api/task-category", verifyToken, taskCategoryRoute);

// Error handling
app.use((err, req, res, next) => {
  res.status(err.status || 500).send({
    data: null,
    meta: {
      success: false,
      status: err.status || 500,
      message: err.message || "Internal Server Error",
      timestamp: new Date().toISOString(),
    },
  });
});
app.use(errorHandler);

// Serve the static files from the dist directory
app.use(express.static(path.join(__dirname, 'frontend')));

// Serve the index.html file for all requests (for Angular routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/index.html'));
});

// Create HTTP server
const http = require("http");
let server = http.createServer(app);
app.set("port", process.env.PORT || config.PORT);

server.listen(config.server.port, () => {
  connectDB();
  console.log(`Server is running on port ${config.server.port} in ${process.env.NODE_ENV} mode`);
});
