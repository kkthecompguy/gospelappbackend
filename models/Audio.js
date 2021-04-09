const mongoose = require('mongoose');

const Genre = {
  Catholic: 'Catholic',
  SDA: 'SDA',
  Evagelical: 'Evagelical'
}

const AudiosSchema = new mongoose.Schema({
  audioUrl: { type: String },
  audioId: { type: String },
  thumbnail: { type: String },
  views: [{ 
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date,  default:  Date.now }
   }],
  trending: { type: Boolean, default: false },
  genre: { type: String },
  popular: { type: Boolean, default: false },
  description: { type: String }
}, {
  timestamps: true
});

const Audio = mongoose.model('Audio', AudiosSchema)

module.exports = { Audio, Genre };