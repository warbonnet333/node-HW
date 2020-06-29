const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { Schema } = mongoose;

require("dotenv").config();

const contactSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  avatarURL: {
    type: String,
    required: false,
    default: `http://localhost:${process.env.PORT}/images/batman-icon.png`,
  },
  subscription: {
    type: String,
    enum: ["free", "pro", "premium"],
    default: "free",
  },
  token: { type: String, required: false },
  status: {
    type: String,
    required: true,
    enum: ["Verified", "NotVerified"],
    default: "NotVerified",
  },
  verificationToken: {
    type: String,
    required: false,
  },
});

async function findContactByEmail(email) {
  return this.findOne({ email });
}

async function updateToken(id, newToken) {
  return this.findByIdAndUpdate(id, {
    token: newToken,
  });
}

async function createVerToken(id, verificationToken) {
  return this.findByIdAndUpdate(
    id,
    {
      verificationToken,
    },
    {
      new: true,
    }
  );
}

async function findByVerToken(verificationToken) {
  return this.findOne({ verificationToken });
}

async function verifyUser(id) {
  return this.findByIdAndUpdate(
    id,
    {
      status: "Verified",
      verificationToken: null,
    },
    {
      new: true,
    }
  );
}

contactSchema.statics.findContactByEmail = findContactByEmail;
contactSchema.statics.updateToken = updateToken;
contactSchema.statics.createVerToken = createVerToken;
contactSchema.statics.findByVerToken = findByVerToken;
contactSchema.statics.verifyUser = verifyUser;

contactSchema.plugin(mongoosePaginate);

const contactModel = mongoose.model("contacts", contactSchema);

module.exports = contactModel;
