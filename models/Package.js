const mongoose = require('mongoose');

const PackageSchema = new  mongoose.Schema({
  name: { type: String },
  packageId: { type: String },
  monthlyPrice: { type: Number, default: 0 },
  annualPrice: { type: Number, default: 0 },
  descriprion: { type: String }, 
  numberOfDevices: { type: Number, default: 0 }
},{
  timestamps: true
})

module.exports = mongoose.model('Package', PackageSchema);