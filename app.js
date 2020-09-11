const express = require("express")
const app = express()
const port = 3000
const exphbs = require("express-handlebars")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const methodOverride = require("method-override")
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
// setting static files==>會先去看public資料夾
app.use(express.static("public"))

app.get("/", (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurants => res.render("index", { restaurants }))
    .catch(error => console.error(error))
})

//querystring取得問號內容
app.get("/search", (req, res) => {
  const keyword = req.query.keyword
  Restaurant.find()
    .lean()
    .then(restaurant => {
      const searchedRestaurantList = []
      restaurant.forEach(item => {
        if (
          item.name.includes(keyword) ||
          item.category.includes(keyword) ||
          item.name_en.toLowerCase().includes(keyword.toLowerCase())
        ) {
          searchedRestaurantList.push(item)
        }
      })
      return res.render("index", {
        restaurants: searchedRestaurantList,
        keywords: keyword
      })
    })
    .catch(error => console.error(error))
  // restaurants.filter(restaurant => {
  //   return (
  //     restaurant.name_en
  //       .toLowerCase()
  //       .includes(req.query.keyword.toLowerCase()) ||
  //     restaurant.name.includes(req.query.keyword) ||
  //     restaurant.category.includes(req.query.keyword)
  //   )
  // })
  // res.render("index", { restaurants: restaurants, keyword: req.query.keyword })
})

app.get("/restaurants/new", (req, res) => {
  return res.render("new")
})

app.post("/restaurants", (req, res) => {
  const name = req.body.name
  const name_en = req.body.name_en
  const category = req.body.category
  const image = req.body.image
  const location = req.body.location
  const phone = req.body.phone
  const google_map = req.body.google_map
  const rating = req.body.rating
  const description = req.body.description

  return Restaurant.create({
    name,
    name_en,
    category,
    image,
    location,
    phone,
    google_map,
    rating,
    description
  })
    .then(() => res.redirect("/"))
    .catch(error => console.error(error))
})

// params
app.get("/restaurants/:id", (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render("show", { restaurant }))
    .catch(error => console.error(error))
})

app.get("/restaurants/:id/edit", (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render("edit", { restaurant }))
    .catch(error => console.error(error))
})

app.put("/restaurants/:id", (req, res) => {
  const id = req.params.id
  const name = req.body.name
  const name_en = req.body.name_en
  const category = req.body.category
  const image = req.body.image
  const location = req.body.location
  const phone = req.body.phone
  const google_map = req.body.google_map
  const rating = req.body.rating
  const description = req.body.description

  return Restaurant.findById(id)
    .then(restaurant => {
      restaurant.name = name
      restaurant.name_en = name_en
      restaurant.category = category
      restaurant.image = image
      restaurant.location = location
      restaurant.phone = phone
      restaurant.google_map = google_map
      restaurant.rating = rating
      restaurant.description = description

      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => console.error(error))
})

app.delete("/restaurants/:id", (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(restaurant => res.redirect("/"))
    .catch(error => console.error(error))
})

app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`)
})
