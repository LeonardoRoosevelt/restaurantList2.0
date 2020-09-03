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

app.engine("hbs", exphbs({ defaultLayout: "main", extname: "hbs" }))
app.set("view engine", "hbs")

// setting static files==>會先去看public資料夾
app.use(express.static("public"))

app.get("/", (req, res) => {
  res.render("index")
})

app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`)
})
