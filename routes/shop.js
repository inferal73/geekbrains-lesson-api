const { Router } = require('express')
const path = require('path')
const fs = require('fs-extra')
const generateId = require('../utils/generateId')
const db = path.join(__dirname, '../db/shop')

const router = Router()

router.get('/', async (req, res) => {
  const { user_id } = req.query

  if (user_id) {
    try {
      const data = await fs.readFile(`${db}/${user_id}.json`)

      res.status(200).send(data)

      console.log(`data for user ${user_id} sended`)
    } catch(e) {
      res.status(404).json({
        message: 'No data for this user_id'
      })

      console.log(`data for user ${user_id} not found`)
    }
  } else {
    const user_id = generateId()

    const data = {
      user_id,
      cart: []
    }

    const dataJSON = JSON.stringify(data)

    await fs.writeFile(`${db}/${user_id}.json`, dataJSON, 'utf8')

    res.status(200).send(dataJSON)

    console.log(`user ${user_id} created`)
  }
})

router.post('/', async (req, res) => {
  const { user_id, product, price } = req.query

  if (user_id && product && price) {
    try {
      const data = JSON.parse(await fs.readFile(`${db}/${user_id}.json`))

      const newProduct = { 
        product_id: generateId(),
        product,
        price
      }

      const newData = {
        user_id,
        cart: [ ...data.cart, newProduct ]
      }

      await fs.writeFile(`${db}/${user_id}.json`, JSON.stringify(newData), 'utf8')

      res.status(200).json(newProduct)

      console.log(`user ${user_id} added "${product}" to his cart`)
    } catch(e) {
      res.status(404).json({
        message: 'No data for this user_id'
      })

      console.log(`data for user ${user_id} not found`)
    }
  } else {
    res.status(404).json({
      message: 'no "user_id", "product" or "price" provided, please add it to the request params'
    })

    console.log(`user ${user_id} did not provide required data for adding product`)
  }
})

router.delete('/', async (req, res) => {
  const { user_id, product_id } = req.query

  if (user_id && product_id) {
    try {
      const data = JSON.parse(await fs.readFile(`${db}/${user_id}.json`))

      const cart = data.cart.filter((item) => {
        return item.product_id != product_id
      })

      const newData = {
        user_id,
        cart
      }

      const newDataJSON = JSON.stringify(newData)

      await fs.writeFile(`${db}/${user_id}.json`, newDataJSON, 'utf8')

      res.status(200).end(newDataJSON)

      console.log(`user ${user_id} deleted "${product}" from his cart`)
    } catch(e) {
      res.status(404).json({
        message: 'No data for this user_id'
      })

      console.log(`data for user ${user_id} not found`)
    }
  } else {
    res.status(404).json({
      message: 'no "user_id" or "product_id" provided, please add it to the request params'
    })

    console.log(`user ${user_id} did not provide required data for deleting product`)
  }
})

module.exports = router