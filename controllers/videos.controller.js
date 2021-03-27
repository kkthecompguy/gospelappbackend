const express = require('express');
const { body } = require('express-validator');
const { nanoid } = require('nanoid');
const router = express.Router();
const isAuthenticated = require('../middleware/auth');
const { Video, Genre} = require('../models/Videos');
const { uploadVideo, uploadThumbnail } = require('../utils/fileUpload')


// @route /api/v1/videos/create
// @desc Create Video
// @access Private
router.post('/create',
 isAuthenticated, 
 body('genre',' Genre is required').isString(),
 body('description', 'Description is required').isString(),
 body('base64VideoUrl', 'File data is required').isString(),
 body('base64ImageUrl', 'Thumbnail Url is required').isString(),
 async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array(), status: 400 });

    const videoId = nanoid(10);
    const videoUrl = await uploadVideo(req.body.base64VideoUrl);
    const thumbnailUrl = await uploadThumbnail(req.body.base64ImageUrl);

    const video = new Video({
      videoUrl: videoUrl,
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
router.get('/popular', isAuthenticated, async (req, res) => {
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
// @desc SDA Videos
// @access Private
router.get('/evagelical', isAuthenticated, async (req, res) => {
  try {
    const videos = await Video.find({ genre: Genre.Evagelical }).sort('-createdAt');
    return res.status(201).json(videos);
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
    const userInViews = video.views.find(user => user.userId === userId);
    if(userInViews) {
      return res.status(200).json(video);
    } else {
      const updatedVideo =  await Video.findByIdAndUpdate(video._id, {
        views: {$push: {user: userId}}
      });
      return res.status(200).json(updatedVideo);
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message, status: 500 });
  }
});