const express = require("express");
const mongoose = require("mongoose");
const contactsRoute = require("./contacts/contact.router");

require("dotenv").config();

// const app = express();

module.exports = class ContactServer {
  constructor() {
    this.server = null;
  }

  async start() {
    this.initServer();
    this.initMiddlewares();
    this.initRoutes();
    await this.initDatabase();
    return this.startListening();
  }

  initServer() {
    this.server = express();
  }

  initMiddlewares() {
    this.server.use(express.json());
    this.server.use(express.urlencoded({ extended: true }));
    this.server.use(express.static("public"));
  }

  async initDatabase() {
    try {
      await mongoose.connect(process.env.CONTACTS_URL);
    } catch (error) {
      process.exit(1);
    }
  }
  initRoutes() {
    this.server.use("/contacts", contactsRoute);
  }

  startListening() {
    return this.server.listen(process.env.PORT, () => {
      console.log("Database connection successful...", process.env.PORT);
    });
  }
};
