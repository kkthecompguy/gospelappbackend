const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, unique: true },
  phoneNumber: { type: String, unique: true },
  avatar: { type: String },
  status: { type: Boolean, default: true },
  subscription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package'
  },
  subscribed: { type: Boolean, default: false },
  role: { type: String },
  isAdmin: { type: Boolean, default: false },
  password: { type: String },
  passwordResetToken: { type: String },
  passwordExpiresTime: { type: Date },
  passwordResetCode: { type: String }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);