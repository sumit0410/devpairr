const express = require("express");
const connectDB = require("./config/Database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const dotenv = require("dotenv");
const initializeSocket = require("./utils/socket");
const chatRouter = require("./routes/chat");
const cloudinary = require("../src/utils/cloudinary");
dotenv.config();
const app = express();
app.use(
  cors({
    origin: "https://devpairrs.onrender.com",
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);
console.log(cloudinary.config());

const server = http.createServer(app);
initializeSocket(server);
connectDB()
  .then(() => {
    console.log("DB Connected Successfully");
    server.listen(process.env.PORT, () => {
      console.log("server is running on port 7777");
    });
  })
  .catch((err) => {
    console.log("Couldn't connect with DB", err);
  });
