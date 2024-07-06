const express = require("express");
const ErrorHandler = require("./middleware/error");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
const corsOptions = {
  credentials: true,
};

app.use(cors(corsOptions));
// import routes
const user = require("./Controller/User");

app.use(ErrorHandler);
const connectDatabase = require("./db/Database");
// const cloudinary = require("cloudinary");
require("dotenv").config();
// Handling uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`shutting down the server for handling uncaught exception`);
});

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "config/.env",
  });
}

// connect db
connectDatabase();
// cloudinary.config({
//   cloud_name: 'dw2akyum5',
//   api_key: '813325225287557',
//   api_secret: 'Ga8WkWni5X8t1EO-LOunfEHN-1g'
// });

// create server
const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

app.use("/api/v2/user", user);

// unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Shutting down the server for ${err.message}`);
  console.log(`shutting down the server for unhandle promise rejection`);

  server.close(() => {
    process.exit(1);
  });
});
