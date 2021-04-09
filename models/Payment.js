const mongoose = require('mongoose');

const MpesaSchema = new mongoose.Schema({
  paymentId: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: { type: Number, default: 0 },
  packageType: { type: String },
  MerchantRequestID: { type: String },
  CheckoutRequestID: { type: String },
  ResultCode: { type: String },
  ResultDesc: { type: String },
  CallbackMetadata: { type: Array }
}, {
  timestamps: true
});

const AirtelSchema = new mongoose.Schema({
  paymentId: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: { type: Number, default: 0 },
  packageType: { type: String },
}, {
  timestamps: true
});

const CardSchema = new mongoose.Schema({
  paymentId: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: { type: Number, default: 0 },
  packageType: { type: String },
});

const Mpesa = mongoose.model('Mpesa', MpesaSchema);
const Airtel = mongoose.model('Airtel', AirtelSchema);
const CardPayment = mongoose.model('Card', CardSchema);

module.exports = { Mpesa, Airtel, CardPayment};

