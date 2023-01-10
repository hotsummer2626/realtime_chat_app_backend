const Message = require("../models/message");

const addMessage = async (req, res, next) => {
    try {
        const { from, to, message } = req.body;
        const data = await Message.create({
            message: { text: message },
            users: [from, to],
            sender: from,
        });
        if (data) {
            return res.json({ msg: data.message, status: true });
        }
        return res.json({
            msg: "Failed to add message to the database",
            status: false,
        });
    } catch (err) {
        next(err);
    }
};

const getAllMessages = async (req, res, next) => {
    try {
        const { senderId, receiverId } = req.params;
        const messages = await Message.find({
            users: {
                $all: [senderId, receiverId],
            },
        })
            .sort({ updateAt: 1 })
            .exec();
        const projectMessages = messages.map((msg) => ({
            fromSelf: msg.sender.toString() === senderId,
            message: msg.message.text,
        }));
        return res.json(projectMessages);
    } catch (err) {
        next(err``);
    }
};

module.exports = {
    addMessage,
    getAllMessages,
};
