const express = require("express");
const ContactsController = require("./contact.controller");
const multer = require("multer");
const path = require("path");

const contactsRouter = express.Router();

const storage = multer.diskStorage({
  destination: "public/images",
  filename: function (req, file, cb) {
    const ext = path.parse(file.originalname).ext;
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage: storage });

contactsRouter.get(
  "/",
  ContactsController.authorize,
  ContactsController.listContacts
);

contactsRouter.get("/verify/:token", ContactsController.checkVerification);

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

contactsRouter.patch(
  "/avatar",
  upload.any("avatar"),
  ContactsController.authorize,
  ContactsController.changeAvatar
);

contactsRouter.get("/:id", ContactsController.getContactById);

contactsRouter.delete("/:id", ContactsController.removeContact);

contactsRouter.patch(
  "/:id",
  ContactsController.validateUpdateContact,
  ContactsController.updateContact
);

module.exports = contactsRouter;
