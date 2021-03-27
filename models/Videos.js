const mongoose = require('mongoose');

const Genre = {
  Catholic: 'Catholic',
  SDA: 'SDA',
  Evagelical: 'Evagelical'
}

const VideosSchema = new mongoose.Schema({
  videoUrl: { type: String },
  videoId: { type: String },
  thumbnail: { type: String },
  views: [{ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
   }],
  trending: { type: Boolean, default: false },
  genre: { type: String },
  popular: { type: Boolean, default: false },
  description: { type: String }
}, {
  timestamps: true
});


// @todo
// node job scheduler to update popular to true when views reach 1k
// node job scheduler to update trending to true when views reach 1k

const Video = mongoose.model('Video', VideosSchema)

module.exports = { Video, Genre };