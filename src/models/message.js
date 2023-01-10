const { Schema, model } = require("mongoose");

const schema = new Schema({
    message: {
        text: {
            type: String,
            required: true,
        },
    },
    users: Array,
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});

module.exports = model("Message", schema);
