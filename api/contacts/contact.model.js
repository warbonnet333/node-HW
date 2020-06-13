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
});

async function findContactByEmail(email) {
  return this.findOne({ email });
}

async function updateToken(id, newToken) {
  return this.findByIdAndUpdate(id, {
    token: newToken,
  });
}

contactSchema.statics.findContactByEmail = findContactByEmail;
contactSchema.statics.updateToken = updateToken;

contactSchema.plugin(mongoosePaginate);

const contactModel = mongoose.model("contacts", contactSchema);

module.exports = contactModel;
