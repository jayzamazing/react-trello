'use strict';
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const options = {
  toObject: {getters: true},
  toJSON: {getters: true}
};
//schema representing a user
const userSchema = mongoose.Schema({
  email: {type: String, required: true, unique: true},
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now }
}, options);

userSchema.methods.apiRepr = function() {
  return {
    _id: this._id,
    email: this.email,
    fullName: this.fullName,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

userSchema.methods.validatePassword = function(password) {
  return bcrypt
    .compare(password, this.password)
    .then(isValid => isValid);
};

userSchema.statics.hashPassword = function(password) {
  return bcrypt
    .hash(password, 10);
};

const User = mongoose.model('user', userSchema);

module.exports = {User};
