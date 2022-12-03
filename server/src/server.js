require("dotenv").config()
const express         = require("express")
const app             = express()
const animalsData     = require("./data/animals.json")
const cors            = require("cors")
const PORT            = process.env.PORT || 3000;
const database        = require('./database');
const bodyParser      = require('body-parser')
const { getTopUsers, findOrCreateUser, updateUserPoints } = require("./controllers/UserController")

app.use(cors())
app.use(bodyParser.json({}))

app.use(express.static('public'));

app.get('/api/animals', (req, res) => {
  return res.status(200).json({
    data: animalsData,
    status: 200
  })
})

app.get("/api/topUsers", getTopUsers)
app.get("/api/users/:username", findOrCreateUser)
app.put("/api/users", updateUserPoints)

database.connect()

app.listen(PORT, () => {
  console.log("Server on PORT: ", PORT);
})