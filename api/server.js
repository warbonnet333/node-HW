const express = require("express");
const mongoose = require("mongoose");
const contactsRoute = require("./contacts/contact.router");

require("dotenv").config();

const app = express();

module.exports = class ContactServer {
  constructor() {
    this.server = null;
  }

  async start() {
    this.initServer();
    this.initMiddlewares();
    this.initRoutes();
    await this.initDatabase();
    this.startListening();
  }

  initServer() {
    this.server = express();
  }

  initMiddlewares() {
    this.server.use(express.json());
    this.server.use(express.urlencoded({ extended: true }));
  }

  async initDatabase() {
    try {
      await mongoose.connect(process.env.CONTACTS_URL);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }
  initRoutes() {
    this.server.use("/contacts", contactsRoute);
  }

  startListening() {
    this.server.listen(process.env.PORT, () => {
      console.log("Database connection successful...", process.env.PORT);
    });
  }
};
