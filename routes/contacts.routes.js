const express = require("express")
const contactsRouter = express.Router()

const contactsControllers = require('../controllers/contactsControllers')

contactsRouter.get("/", contactsControllers.listContacts)

contactsRouter.get("/:id", contactsControllers.getContactById)

contactsRouter.delete("/:id", contactsControllers.removeContact)

contactsRouter.post("/", contactsControllers.addContact)

contactsRouter.patch("/:id", contactsControllers.updateContact)

module.exports = contactsRouter