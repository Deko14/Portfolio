const mongoose = require("mongoose");
const uuidv1 = require("uuidv1"); // Generate SALT
const crypto = require("crypto"); // Used for hashing the password, similar like Bcrypt
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
  },
  hashed_password: {
    type: String,
    required: true,
  },
  salt: String,
  created: {
    type: Date,
    default: Date.now,
  },
  updated: Date,
  photo: {
    data: Buffer,
    contentType: String,
  },
  description: {
    type: String,
    trim: true,
  },
  following: [{ type: ObjectId, ref: "User" }],
  followers: [{ type: ObjectId, ref: "User" }],
});

// Virtual fields are additional fields for a given model.
// Their values can be set manually or automatically with defined functionality.
// Keep in mind: virtual properties (password) don’t get persisted in the database.
// They only exist logically and are not written to the document’s collection.

// Virtual field
userSchema
  .virtual("password")
  .set(function (password) {
    //create temporary variable called _password
    this._password = password;
    // generate salt
    this.salt = uuidv1();
    // encryptPassword()
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

// Methods
userSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (error) {
      return "";
    }
  },
};

module.exports = mongoose.model("User", userSchema);
