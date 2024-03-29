const { Schema, model } = require("mongoose");

const User = new Schema({
  UserID: { type: String, unique: true },
  afk: {
    isAfk: { type: Boolean, default: false },
    reason: { type: String },
  },
  Notifs: {
    isSubbed: { type: Boolean, default: true}
  },
  
});

module.exports = model("Users", User);
