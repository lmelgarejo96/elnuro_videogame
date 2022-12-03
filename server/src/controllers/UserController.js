const User = require("../models/User")

exports.getTopUsers = async (req, res) => {
  const topUsers = await User.find().sort({ points: -1 }).limit(10)
  res.json({
    data: topUsers,
    status: 200
  })
}

const getUserByUsername = async (username = "") => {
  try {
    const user = await User.findOne({ username })
    return user
  } catch (error) {
    return null
  }
}

const createUser = async (username = "") => {
  try {
    const user = new User({
      username
    })
    const userSaved = await user.save()
    return userSaved
  } catch (error) {
    return null
  }
}

exports.updateUserPoints = async (req, res) => {
  try {
    const { username = "", points = 0 } = req.body
    const user = await User.findOne({ username })
    if(!user) return res.json({
      status: 404,
      data: null,
      message: "No se encontró el usuario"
    })
    const newPoints = (user.points + points)
    const userUpdated = await User.findOneAndUpdate({ username }, {
      $set: {
        points: newPoints || 0
      }
    }, { new: true })
    res.json({
      data: userUpdated,
      status: 200
    })
  } catch (error) {
    console.log(error);
    res.json({
      data: null,
      message: "No se pudo actualizar los puntos del usuario",
      status: 404
    })
  }
}

exports.findOrCreateUser = async (req, res) => {
  try {
    const { username } = req.params;
    let user = await getUserByUsername(username)
    if(!user) {
      user = await createUser(username)
    }
    res.json({
      data: user,
      message: "Usuario cargado correctamente",
      status: 200
    })
  } catch (error) {
    console.log(error);
    res.json({
      data: null,
      message: "No se encontró o no se pudo crear el usuario",
      status: 404
    })
  }
}