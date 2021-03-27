const express = require('express');
const { body } = require('express-validator');
const { nanoid } = require('nanoid');
const router = express.Router();
const isAuthenticated = require('../middleware/auth');
const { Audio, Genre} = require('../models/Audio');
const { uploadAudio, uploadThumbnail } = require('../utils/fileUpload')


// @route /api/v1/audios/create
// @desc Audio Audio
// @access Private
router.post('/create',
 isAuthenticated, 
 body('genre',' Genre is required').isString(),
 body('description', 'Description is required').isString(),
 body('base64AudioUrl', 'File data is required').isString(),
 body('base64ImageUrl', 'Thumbnail Url is required').isString(),
 async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array(), status: 400 });

    const audioId = nanoid(10);
    const audioUrl = await uploadAudio(req.body.base64VideoUrl);
    const thumbnailUrl = await uploadThumbnail(req.body.base64ImageUrl);

    const audio = new Audio({
      audioUrl: audioUrl,
      audioId: audioId,
      thumbnail: thumbnailUrl,
      genre: req.body.genre,
      description: req.body.description
    });
    
    await audio.save();
    return res.status(201).json({ message: 'Audio Uploaded Successfully', status: 201 });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message, status: 500 });
  }
});


// @route /api/v1/audios/list
// @desc List Audio
// @access Private
router.get('/list', isAuthenticated, async (req, res) => {
  try {
    const audios = await Audio.find().sort('-createdAt');
    return res.status(201).json(audios);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message, status: 500 });
  }
});

// @route /api/v1/audios/trending
// @desc Trending audios
// @access Private
router.get('/trending', isAuthenticated, async (req, res) => {
  try {
    const audios = await Audio.find({ trending: true }).sort('-createdAt');
    return res.status(201).json(audios);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message, status: 500 });
  }
});


// @route /api/v1/audios/popular
// @desc Popular audios
// @access Private
router.get('/popular', isAuthenticated, async (req, res) => {
  try {
    const audios = await Audio.find({ popular: true }).sort('-createdAt');
    return res.status(201).json(audios);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message, status: 500 });
  }
});

// @route /api/v1/audios/catholic
// @desc Catholic audios
// @access Private
router.get('/popular', isAuthenticated, async (req, res) => {
  try {
    const audios = await Audio.find({ genre: Genre.Catholic }).sort('-createdAt');
    return res.status(201).json(audios);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message, status: 500 });
  }
});

// @route /api/v1/audios/sda
// @desc SDA audios
// @access Private
router.get('/sda', isAuthenticated, async (req, res) => {
  try {
    const audios = await Audio.find({ genre: Genre.SDA }).sort('-createdAt');
    return res.status(201).json(audios);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message, status: 500 });
  }
});

// @route /api/v1/audios/evagelical
// @desc Evagelical audios
// @access Private
router.get('/evagelical', isAuthenticated, async (req, res) => {
  try {
    const audios = await Audio.find({ genre: Genre.Evagelical }).sort('-createdAt');
    return res.status(201).json(audios);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message, status: 500 });
  }
});

// @route /api/v1/audios/:audioId
// @desc Audio Detail
// @access Private
router.get('/:audioId', isAuthenticated, async (req, res) =>  {
  try {
    const audio = await Audio.findById(req.params.audioId);
    if (!audio) return res.status(404).json({ message: 'Audio Not Found', status: 404 });

    const userId = req.user._id;
    const userInViews = audio.views.find(user => user.userId === userId);
    if(userInViews) {
      return res.status(200).json(audio);
    } else {
      const updatedAudio =  await Audio.findByIdAndUpdate(audio._id, {
        views: {$push: {user: userId}}
      });
      return res.status(200).json(updatedAudio);
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message, status: 500 });
  }
});