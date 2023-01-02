require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { connectToDB } = require("./utils/db");
const router = require("./routes");

const app = express();
const PORT = process.env.PORT || 3000;
const morganLog =
  process.env.NODE_ENV === "production" ? morgan("dev") : morgan("common");

app.use(express.json());
app.use(cors());
app.use(morganLog);

app.use("/api", router);

connectToDB();

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
