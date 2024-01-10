const { Schema, model } = require('mongoose')

const User = new Schema({
    UserID : { type: String, unique: true },
    info: {
        reason: { type: String },
        type: { type: String}
    },
});


module.exports = model("Blacklists", User)