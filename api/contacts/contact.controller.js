const Joi = require("joi");
const contactModel = require("./contact.model");

class ContactsController {
  async listContacts(req, res, next) {
    try {
      const allContacts = await contactModel.find();
      return res.status(200).send(allContacts);
    } catch (error) {
      next(error);
    }
  }

  async getContactById(req, res, next) {
    try {
      const id = req.params.id;
      const contact = await contactModel.findById(id);
      if (!contact) {
        return res.status(404).send(contact.message);
      }
      res.status(200).send(contact);
    } catch (error) {
      next(error);
    }
  }

  async removeContact(req, res, next) {
    try {
      const id = req.params.id;
      const result = await contactModel.findByIdAndDelete(id);
      if (!result) {
        return res.status(404).send("Not found");
      }
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async addContact(req, res, next) {
    try {
      const newContact = await contactModel.create(req.body);
      return res.status(201).json(newContact);
    } catch (error) {
      next(error);
    }
  }

  async updateContact(req, res, next) {
    const id = req.params.id;
    try {
      const updatedContact = await contactModel.findByIdAndUpdate(
        id,
        {
          $set: req.body,
        },
        { new: true }
      );

      if (!updatedContact) {
        return res.status(404).send("Not found");
      }
      return res.status(200).send(updatedContact);
    } catch (error) {
      next(error);
    }
  }

  validateUpdateContact(req, res, next) {
    const validationRules = Joi.object({
      name: Joi.string(),
      email: Joi.string(),
      phone: Joi.string(),
      subscription: Joi.string(),
      password: Joi.string(),
      token: Joi.string(),
    });

    const isValid = Joi.validate(req.body, validationRules);
    if (isValid.error) {
      return res.status(400).send(isValid.error);
    }
    next();
  }

  validateCreateContact(req, res, next) {
    const validationRules = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
      subscription: Joi.string().required(),
      password: Joi.string().required(),
      token: Joi.string(),
    });

    const isValid = Joi.validate(req.body, validationRules);
    if (!isValid) {
      return res.status(400).send(isValid.error);
    }
    next();
  }
}

module.exports = new ContactsController();
