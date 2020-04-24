const express = require("express")
const cors = require("cors")
const morgan = require('morgan')

const contactsRoute = require('./routes/contacts.routes')

require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('combined'))

app.use("/contacts", contactsRoute)

app.listen(process.env.PORT, () => {
    console.log("Starting server on port ", process.env.PORT)
})