const Joi = require("joi");
const contactModel = require("./contact.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class ContactsController {
  constructor() {
    this._costFactor = 4;
  }

  get addContact() {
    return this._addContact.bind(this);
  }

  get listContacts() {
    return this._listContacts.bind(this);
  }

  get getContactById() {
    return this._getContactById.bind(this);
  }

  get currentContact() {
    return this._currentContact.bind(this);
  }

  get changeAvatar() {
    return this._changeAvatar.bind(this);
  }

  async _listContacts(req, res, next) {
    try {
      const { page, limit, sub } = req.query;

      let options;

      Object.keys(req.query).length
        ? (options = {
            page,
            limit,
          })
        : (options = {
            pagination: false,
          });

      // Якщо потрібно відсортувати без урахуваня пагінації

      // Object.keys(req.query).length && !sub
      //   ? (options = {
      //       page,
      //       limit,
      //     })
      //   : (options = {
      //       pagination: false,
      //     });

      const paginRes = await contactModel.paginate({}, options);

      const filteredContacts = paginRes.docs.filter(
        (item) => item.subscription === sub
      );

      return res
        .status(200)
        .send(this.prepareContacts(sub ? filteredContacts : paginRes.docs));
    } catch (error) {
      next(error);
    }
  }

  async _getContactById(req, res, next) {
    try {
      const id = req.params.id;
      const contact = await contactModel.findById(id);
      if (!contact) {
        return res.status(404).send(contact.message);
      }

      const [preparedContact] = this.prepareContacts([contact]);

      res.status(200).send(preparedContact);
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

  async _addContact(req, res, next) {
    try {
      const { name, email, password, phone, subscription } = req.body;

      const isEmailExist = await contactModel.findContactByEmail(email);

      if (isEmailExist) {
        return res.status(409).json({ message: "Email in use" });
      }

      const passwordHash = await bcrypt.hash(password, this._costFactor);

      const newContact = await contactModel.create({
        name,
        email,
        phone,
        subscription,
        password: passwordHash,
      });
      return res.status(201).json({
        user: {
          id: newContact._id,
          name: newContact.name,
          email: newContact.email,
          phone: newContact.phone,
          subscription: newContact.subscription,
        },
      });
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

  async _currentContact(req, res, next) {
    try {
      const [preparedCurrentContact] = this.prepareContacts([req.user]);

      return res.status(200).send(preparedCurrentContact);
    } catch (error) {
      return res.status(401).json({ message: "Not authorized" });
    }
  }

  async logIn(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await contactModel.findContactByEmail(email);
      if (!user) {
        return res.status(404).send("Email or password is wrong");
      }

      const isPassValid = await bcrypt.compare(password, user.password);
      if (!isPassValid) {
        return res.status(404).send("Email or password is wrong");
      }

      const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: 2 * 24 * 60 * 60,
      });
      await contactModel.updateToken(user._id, token);

      return res.status(201).send({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          subscription: user.subscription,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async logOut(req, res, next) {
    try {
      const user = req.user;

      await contactModel.updateToken(user._id, null);

      return res.status(204).send();
    } catch (error) {
      console.log(error);
    }
  }

  async _changeAvatar(req, res, next) {
    try {
      const newAvatar = req.files[0];
      const id = req.user._id;
      const updatedContact = await contactModel.findByIdAndUpdate(
        id,
        {
          $set: {
            avatarURL: `http://localhost:${process.env.PORT}/images/${newAvatar.filename}`,
          },
        },
        { new: true }
      );

      if (!updatedContact) {
        return res.status(401).json({ message: "Not authorized" });
      }

      const [updatesAvatarContact] = this.prepareContacts([updatedContact]);

      return res.status(200).send(updatesAvatarContact);
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
      subscription: Joi.string(),
      password: Joi.string().required(),
      token: Joi.string(),
    });

    const isValid = Joi.validate(req.body, validationRules);
    if (!isValid) {
      return res
        .status(400)
        .send("Ошибка от Joi или другой валидационной библиотеки");
    }
    next();
  }

  validateLogInContact(req, res, next) {
    const validationRules = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });

    const isValid = Joi.validate(req.body, validationRules);
    if (!isValid) {
      return res.status(400).send(isValid.error);
    }
    next();
  }

  async authorize(req, res, next) {
    try {
      const authorizationHeader = req.get("Authorization");

      if (!authorizationHeader)
        res.status(401).json({ message: "Not authorized" });

      const token = authorizationHeader.replace("Bearer ", "");

      let userId;
      try {
        userId = await jwt.verify(token, process.env.JWT_SECRET).id;
      } catch (err) {
        return res.status(401).json({ message: "Not authorized" });
      }

      const user = await contactModel.findById(userId);
      if (!user || user.token !== token) {
        return res.status(401).json({ message: "Not authorized" });
      }

      req.user = user;
      req.token = token;

      next();
    } catch (err) {
      next(err);
    }
  }

  prepareContacts(arr) {
    return arr.map((item) => {
      const { id, name, email, phone, subscription, avatarURL } = item;

      return { id, name, email, phone, subscription, avatarURL };
    });
  }
}

module.exports = new ContactsController();
