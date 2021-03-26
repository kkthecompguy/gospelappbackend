const mongoose = require('mongoose');

const VideosSchema = new mongoose.Schema({
  videoUrl: { type: String },
  videoId: { type: String },
  thumbnail: { type: String },
  views: { type: Number, default: 0 },
  trending: { type: Boolean, default: false },
  genre: { type: String },
  popular: { type: Boolean, default: false },
  description: { type: String }
}, {
  timestamps: true
})