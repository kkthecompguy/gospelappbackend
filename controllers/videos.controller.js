const express = require('express');
const { body, validationResult } = require('express-validator');
const { nanoid } = require('nanoid');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const { Video, Genre} = require('../models/Videos');
const User = require("../models/User")
const { uploadVideo, uploadThumbnail } = require('../utils/fileUpload')


// @route /api/v1/videos/create
// @desc Create Video
// @access Private
router.post('/create',
 isAuthenticated, 
 body('genre',' Genre is required').isString(),
 body('description', 'Description is required').isString(),
 body('videoUrl', 'Video url is required').isString(),
 body('base64ImageUrl', 'Thumbnail Url is required').isString(),
 async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array(), status: 400 });

    const videoId = nanoid(10); 
    const thumbnailUrl = await uploadThumbnail(req.body.base64ImageUrl);

    const video = new Video({
      videoUrl: req.body.videoUrl,
      videoId: videoId,
      thumbnail: thumbnailUrl,
      genre: req.body.genre,
      description: req.body.description
    });
    
    await video.save();
    return res.status(201).json({ message: 'Video Uploaded Successfully', status: 201 });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message, status: 500 });
  }
});


// @route /api/v1/videos/list
// @desc List Video
// @access Private
router.get('/list', isAuthenticated, async (req, res) => {
  try {
    const videos = await Video.find().sort('-createdAt');
    return res.status(201).json(videos);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message, status: 500 });
  }
});

// @route /api/v1/videos/trending
// @desc Trending Videos
// @access Private
router.get('/trending', isAuthenticated, async (req, res) => {
  try {
    const videos = await Video.find({ trending: true }).sort('-createdAt');
    return res.status(201).json(videos);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message, status: 500 });
  }
});


// @route /api/v1/videos/popular
// @desc Popular Videos
// @access Private
router.get('/popular', isAuthenticated, async (req, res) => {
  try {
    const videos = await Video.find({ popular: true }).sort('-createdAt');
    return res.status(201).json(videos);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message, status: 500 });
  }
});

// @route /api/v1/videos/catholic
// @desc Catholic Videos
// @access Private
router.get('/catholic', isAuthenticated, async (req, res) => {
  try {
    const videos = await Video.find({ genre: Genre.Catholic }).sort('-createdAt');
    return res.status(201).json(videos);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message, status: 500 });
  }
});

// @route /api/v1/videos/sda
// @desc SDA Videos
// @access Private
router.get('/sda', isAuthenticated, async (req, res) => {
  try {
    const videos = await Video.find({ genre: Genre.SDA }).sort('-createdAt');
    return res.status(201).json(videos);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message, status: 500 });
  }
});

// @route /api/v1/videos/evagelical
// @desc evagelical Videos
// @access Private
router.get('/evagelical', isAuthenticated, async (req, res) => {
  try {
    const videos = await Video.find({ genre: Genre.Evagelical }).sort('-createdAt');
    return res.status(200).json(videos);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message, status: 500 });
  }
});

// @route /api/v1/videos/:videoId
// @desc video Detail
// @access Private
router.get('/:videoId', isAuthenticated, async (req, res) =>  {
  try {
    const video = await Video.findById(req.params.videoId);
    if (!video) return res.status(404).json({ message: 'Video Not Found', status: 404 });

    const userId = req.user._id;
    const userInViews = video.views.find(user => user.user === userId);
    console.log(userInViews)
    if(userInViews) {
      return res.status(200).json(video);
    } else {
      video.views.push({user: userId})
      await video.save();
      return res.status(200).json(updatedVideo);
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message, status: 500 });
  }
});


// @route /api/v1/videos/download
// @desc download to profile
// @access Private
router.post('/download', body('mediaType', 'Media Type is required').isString(), body('mediaId', 'Media Id is required').isString(), body('mediaUrl', 'Media url is required').isString(), body('thumbnail', 'Thumbnail url is required').isString(),
body('description', 'Description is required').isString(), isAuthenticated, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array(), status: 400 });

    const user = await User.findById(req.user.id);

    const audioExists = user.downloads.find(video => video.mediaId === req.body.mediaId)
    if (audioExists) return res.status(400).json({ message: "Video already downloaded", status: 400 })

    user.downloads.push({mediaId: req.body.mediaId, mediaType: req.body.mediaType, mediaUrl: req.body.mediaUrl, thumbnail: req.body.thumbnail, description: req.body.description})
    await user.save();

    return res.status(200).json({ message: "Media added to your downloads" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message, status: 500 });
  }
});

module.exports = router;