const express = require("express")
const app = express()
const port = 3000
const exphbs = require("express-handlebars")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const methodOverride = require("method-override")
const routes = require("./routes")
const Restaurant = require("./models/restaurant")

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
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride("_method"))
app.use(routes)

// setting static files==>會先去看public資料夾
app.use(express.static("public"))

app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`)
})
