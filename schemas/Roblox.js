const { Schema, model } = require('mongoose')

const Roblox = new Schema({
    UserID: { type: String,  unique: true},
    Roblox: {
        username: { type: String, unique: true },
        robloxuserid: { type: Number, unique: true }
      }
})

module.exports = model("roblox-link", Roblox)