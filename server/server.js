const express = require("express");
const http = require("http");

const bodyParser = require("body-parser");
const cors = require("cors");

const helmet = require("helmet");
const morgan = require("morgan");

const dotenv = require("dotenv");
const mongoose = require("mongoose");

const ClintRoutes = require("./routes/client.route");
const GenerateRoutes = require("./routes/generate.route");
const ManagementRoutes = require("./routes/management.route");
const SalesRoutes = require("./routes/sales.route");

const app = express();

if (app.get("env") === "development") {
  dotenv.config();
}

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

app.use(morgan("tiny"));
app.use(cors());

const connect = () => {
  try {
    mongoose.set("strictQuery", true);
    mongoose.connect(process.env.MONGODB, {
      autoIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connect With Database ...");
  } catch (error) {
    console.error(
      "error when connect with database and the error message is ",
      error,
      message
    );
  }
};

mongoose.connection.on("connected", () => {
  console.log("Connect With BackEnd");
});

mongoose.connection.on("disconnected", () => {
  console.error("error when Connect With BackEnd");
});

app.use("/client", ClintRoutes);
app.use("/generate", GenerateRoutes);
app.use("/management", ManagementRoutes);
app.use("/sales", SalesRoutes);

const server = http.createServer(app);

server.listen(process.env.PORT || 4000, () => {
  connect();
  console.log("Server Running ...");
});
