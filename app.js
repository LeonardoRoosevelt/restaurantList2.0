const express = require("express")
const app = express()
const port = 3000
const exphbs = require("express-handlebars")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost/restaurant-list", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const db = mongoose.connection

db.on("error", () => {
  console.error("Could not connect")
})

db.once("open", () => {
  console.log("connect success")
})

app.get("/", (req, res) => {
  res.send("hello world")
})

app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`)
})
