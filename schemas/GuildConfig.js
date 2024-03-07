const { Schema, model } = require("mongoose");


const GuildConfig = new Schema({
    GuildID: { type: String, unique: true },
    Config: {
        VerifyRequired: { type: Boolean, default: false },
        SetNickToRobloxUser: { type: Boolean, default: false },
        VerifyChannelID: { type: String, unique: true }
    }
})

module.exports = model("GuildConfig", GuildConfig)