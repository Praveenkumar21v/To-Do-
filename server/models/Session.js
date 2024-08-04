const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sessionToken: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  email: { type: String },
  signInAt: { type: Date, default: Date.now },
  signOutAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
