const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const PORT = process.env.PORT || 4000

const app = express()


//MIDDLEWARE
app.use(cors())
app.use(morgan('dev'))
const db = require("./models")
const Category = db.Category
const Product = db.Product

//ROUTER FILES

//ROUTES

app.get('/api/test', (req, res, next) => {
  res.json({
    message: "route working"
  })
})

app.get('/api/categories', (req, res, next) => {
  Category.findAll({
    include: [{ model: Product }]
  })
  .then((categories) => {
    res.json({
      categories: categories
    })
  })
  .catch(error => {
    next(error)
  })
})

app.get('/api/products', (req, res, next) => {
  Product.findAll({
    include: [{ model: Category }],
  })
  .then(products => {
    res.json({
    products
    })
  })
  .catch(error => {
    next(error)
  })
})
// ERROR HANDLING

// The following 2 `app.use`'s MUST follow ALL your routes/middleware
app.use(notFound)
app.use(errorHandler)

function notFound(req, res, next) {
  res.status(404).send({error: 'Not found!', status: 404, url: req.originalUrl})
}

function errorHandler(err, req, res, next) {
  console.error('ERROR', err)
  const stack =  process.env.NODE_ENV !== 'production' ? err.stack : undefined
  res.status(500).send({error: err.message, stack, url: req.originalUrl})
}

app.listen(PORT, ()=>{
  console.log(`server running on PORT ${PORT}`)
})
