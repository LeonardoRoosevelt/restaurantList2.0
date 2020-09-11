const express = require("express")
const router = express.Router()

const Restaurant = require("../../models/restaurant")

router.get("", (req, res) => {
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
module.exports = router
