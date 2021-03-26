const mongoose = require('mongoose');

const MpesaSchema = new mongoose.Schema({
  paymentId: { type: String },
  amount: { type: Number, default: 0 },
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
  amount: { type: Number, default: 0 }
}, {
  timestamps: true
});

const CardSchema = new mongoose.Schema({
  paymentId: { type: String },
  amount: { type: Number, default: 0 }
});

const Mpesa = mongoose.model('Mpesa', MpesaSchema);
const Airtel = mongoose.model('Airtel', AirtelSchema);
const CardPayment = mongoose.model('Card', CardSchema);

module.exports = {Mpesa, Airtel};

