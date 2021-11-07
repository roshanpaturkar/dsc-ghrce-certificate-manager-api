const mongoose = require("mongoose");
const validator = require("validator");

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate (value) {
      if (!validator.isEmail(value)) {
        throw new Error('Invalid email!')
      }
    }
  },
  mobile: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    validate (value) {
      if (!validator.isMobilePhone(value, ["en-IN"])) {
        throw new Error('Invalid mobile number!')
      }
    }
  },
  events: [{
    eventID: {
      type: String,
      required: true,
    },
    eventName: {
      type: String,
      required: true
    }
  }],
  leadTenure: {
    type: String,
    required: true,
    trim: true
  },
},
  {
    timestamps: true,
  }
);

const Lead = mongoose.model("Lead", leadSchema);

module.exports = Lead;