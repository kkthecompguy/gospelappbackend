const cloudinary = require('cloudinary').v2
const dotenv = require('dotenv');
dotenv.config();

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET 
});

const uploadVideo = async (base64FileUrl) => {
  try {
    const res = await cloudinary.uploader.upload(base64FileUrl, {
      resource_type: 'video',
      overwrite: true,
      public_id: '', 
    });
    return res.secure_url;
  } catch (error) {
    console.log(error);
  }
}

const uploadAudio = async (base64FileUrl) => {
  try {
    const res = await cloudinary.uploader.upload(base64FileUrl, {
      resource_type: 'audio',
      overwrite: true,
      public_id: '', 
    }); 
    return res.secure_url;
  } catch (error) {
    console.log(error);
  }
}

const uploadThumbnail = async (base64FileUrl) => {
  try {
    const res = await cloudinary.uploader.upload(base64FileUrl, {
      resource_type: 'image',
      overwrite: true,
      public_id: '', 
    }); 
    return res.secure_url;
  } catch (error) {
    console.log(error);
  }
}

module.exports = { uploadVideo, uploadAudio, uploadThumbnail }