require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { connectToDB } = require("./utils/db");
const router = require("./routes");
const socket = require("socket.io");

const app = express();
const PORT = process.env.PORT || 3000;
const morganLog =
    process.env.NODE_ENV === "production" ? morgan("dev") : morgan("common");

app.use(express.json());
app.use(cors());
app.use(morganLog);

app.use("/api", router);

connectToDB();

const server = app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
});

const io = socket(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    });

    socket.on("send-msg", (data) => {
        const receiverSocket = onlineUsers.get(data.to);
        if (receiverSocket) {
            socket.to(receiverSocket).emit("receive-msg", data.message);
        }
    });
});
