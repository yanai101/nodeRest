const mongoose = require("mongoose");

const usersShema = mongoose.Schema({
        _id: mongoose.Schema.Types.ObjectId,
        username: {type: String, require: true, unique: true}, //match ... for regex
        password: {type: String, require: true},
        type: {
            type: String,
            enum: ["ADMIN", "VIEW", "ATTACK", "EXPLOR", "TECH"],
            require: true
        },
        time: Date,
    },
    {timestamps: true}
);
//}, { timestamps: true });

module.exports = mongoose.model("Users", usersShema);
