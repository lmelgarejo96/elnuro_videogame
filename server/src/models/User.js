const { default: mongoose } = require("mongoose");


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    default: "",
    unique: true,
    required: [true, "El usuario es requerido"]
  },
  points: {
    type: Number,
    default: 0,
  },
  gameTime: {
    type: Number,
    default: 0,
  }
})

module.exports = mongoose.model("usuarios", userSchema)