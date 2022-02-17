const mongoose = require("mongoose")

const schema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  userName: {
    type: String,
  },
  multiplier: {
    type: Number,
  },
  expires: {
    type: Date,
  },
})

module.exports = mongoose.model('multiSchema', schema)
