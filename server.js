const express = require("express");
const ErrorHandler = require("./middleware/error");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));

// CORS configuration
const corsOptions = {
  origin: "https://e-safar-frontend.vercel.app", // Use environment variable or fallback to localhost
  credentials: true,
};

app.use(cors(corsOptions));

// import routes
const user = require("./Controller/User");

app.use("/api/v2/user", user); // Ensure routes are defined after CORS middleware

app.use(ErrorHandler);
const connectDatabase = require("./db/Database");

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

// create server
const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

// unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Shutting down the server for ${err.message}`);
  console.log(`shutting down the server for unhandle promise rejection`);

  server.close(() => {
    process.exit(1);
  });
});
