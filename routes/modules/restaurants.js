const express = require("express")
const router = express.Router()

const Restaurant = require("../../models/restaurant")

router.get("/search", (req, res) => {
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
})

router.get("/new", (req, res) => {
  return res.render("new")
})

router.post("", (req, res) => {
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
router.get("/:id", (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render("show", { restaurant }))
    .catch(error => console.error(error))
})

router.get("/:id/edit", (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render("edit", { restaurant }))
    .catch(error => console.error(error))
})

router.put("/:id", (req, res) => {
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

router.delete("/:id", (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(restaurant => res.redirect("/"))
    .catch(error => console.error(error))
})

module.exports = router
