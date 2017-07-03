'use strict';
import mongoose from 'mongoose';

//schema representing a user
const userSchema = mongoose.Schema({
  email: {type: String, required: true, unique: true},
  password: { type: String, required: true },
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now }
});

userSchema.methods.apiRepr = function() {
  return {
    email: this.email,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
}

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;
