const {Schema, model} = require("mongoose");

const Mods = new Schema({
    UserID: { type: String, unique: true },
    actions: {
        warns: { type: Number, default: 0 },
        reasons: { type: [String], default: [] },
        kicks: { type: Number, default: 0},
        kick_reasons: { type: [String], default: [] }
    },
})
module.exports = model("Moderation", Mods) 