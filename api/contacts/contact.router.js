const express = require("express");
const ContactsController = require("./contact.controller");

const contactsRouter = express.Router();

contactsRouter.post(
  "/",
  ContactsController.validateCreateContact,
  ContactsController.addContact
);

contactsRouter.get("/", ContactsController.listContacts);

contactsRouter.get("/:id", ContactsController.getContactById);

contactsRouter.delete("/:id", ContactsController.removeContact);

contactsRouter.patch(
  "/:id",
  ContactsController.validateUpdateContact,
  ContactsController.updateContact
);

module.exports = contactsRouter;
