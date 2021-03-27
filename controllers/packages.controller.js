const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const isAuthenticated = require('../middleware/auth');
const { nanoid } = require('nanoid');
const Package = require('../models/Package');
const User = require('../models/User');


// @route /api/v1/packages/create
// @desc create Package
// @access Private
router.post('/create',
 isAuthenticated,
 body('name', 'Name is required').isString(), 
 body('monthlyPrice', 'Monthly Price is required').isNumeric(), 
 body('descriprion', 'Description is required').isString(), 
 body('numberOfDevices', 'Number of devices is required'), 
 async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array(), status: 400 });

    const packageId = nanoid(10);
    yearlyPrice = Number(req.body.monthlyPrice) * 12

    const package = new Package({
      name: req.body.name,
      packageId: packageId,
      monthlyPrice: req.body.monthlyPrice,
      annualPrice: yearlyPrice,
      descriprion: req.body.descriprion,
      numberOfDevices: req.body.numberOfDevices
    });

    await package.save();

    return res.status(201).json({ message: 'Package Created Successfully', status: 201 });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message, status: 500 });
  }
});


// @route /api/v1/packages/update
// @desc Update Package
// @access Private
router.post('/update',
 isAuthenticated,
 body('name', 'Name is required').isString(), 
 body('monthlyPrice', 'Monthly Price is required').isNumeric(), 
 body('descriprion', 'Description is required').isString(), 
 body('packageId', 'packageId is required').isString(), 
 body('numberOfDevices', 'Number of devices is required'), 
 async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array(), status: 400 }); 

    yearlyPrice = Number(req.body.monthlyPrice) * 12;

    const update = {
      _id: req.body._id,
      name: req.body.name,
      packageId: req.body.packageId,
      monthlyPrice: req.body.monthlyPrice,
      annualPrice: yearlyPrice,
      descriprion: req.body.descriprion,
      numberOfDevices: req.body.numberOfDevices
    }

    const package = await Package.findByIdAndUpdate(req.body._id, update);

    if (!package) return res.status(404).json({ message: "Package Not Found", status: 404 })

    return res.status(201).json({ message: 'Package Updated Successfully', status: 201 });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message, status: 500 });
  }
});


// @route /api/v1/packages/list
// @desc List Packages
// @access Public
router.get('/list', async (req, res) => {
  try {
    const packages = await Package.find()
    return res.status(200).json(packages)
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message, status: 500 });
  }
});

// @route /api/v1/packages/:packageId
// @desc Detail Package
// @access Public
router.get('/:packageId', async (req, res) => {
  try {
    const packageId = req.params.packageId;
    const package = await Package.findOne({ _id: packageId });
    if (!package) return res.status(404).json({ message: 'Package Not Found', status: 404 });

    return res.status(200).json(package)
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message, status: 500 });
  }
});

// @route /api/v1/packages/:packageId
// @desc Delete Package
// @access Private
router.delete('/:packageId', isAuthenticated, async (req, res) => {
  try {
    const packageId = req.params.packageId;
    const package = await Package.findByIdAndDelete(packageId);
    if (!package) return res.status(404).json({ message: 'Package Not Found', status: 404 });

    return res.status(200).json({ message: 'Package Deleted' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message, status: 500 });
  }
});
module.exports = router;