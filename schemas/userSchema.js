const mongoose = require("mongoose")

const schema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  userName: {
    type: String,
  },
  xp: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
})

module.exports = mongoose.model('userSchema', schema)