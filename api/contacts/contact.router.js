const express = require("express");
const ContactsController = require("./contact.controller");

const contactsRouter = express.Router();

contactsRouter.get(
  "/",
  ContactsController.authorize,
  ContactsController.listContacts
);

contactsRouter.post(
  "/auth/register",
  ContactsController.validateCreateContact,
  ContactsController.addContact
);

contactsRouter.post(
  "/auth/login",
  ContactsController.validateLogInContact,
  ContactsController.logIn
);

contactsRouter.post(
  "/auth/logout",
  ContactsController.authorize,
  ContactsController.logOut
);

contactsRouter.get(
  "/current",
  ContactsController.authorize,
  ContactsController.currentContact
);

contactsRouter.get("/:id", ContactsController.getContactById);

contactsRouter.delete("/:id", ContactsController.removeContact);

contactsRouter.patch(
  "/:id",
  ContactsController.validateUpdateContact,
  ContactsController.updateContact
);

module.exports = contactsRouter;
