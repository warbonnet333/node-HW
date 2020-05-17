const mongoose = require("mongoose");
const { Schema } = mongoose;

const contactSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  subscription: { type: String, required: true },
  password: { type: String, required: true },
  token: { type: String, required: false, default: "" },
});

const contactModel = mongoose.model("contacts", contactSchema);

// contactModel.find().then((res) => console.log(res));

module.exports = contactModel;
