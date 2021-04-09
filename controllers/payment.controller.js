const router = require('express').Router();
const { isAuthenticated , access } = require('../middleware/auth');
const { Mpesa, Airtel } = require('../models/Payment');
const { nanoid } = require('nanoid');
const fetch = require("node-fetch");
const { body, validationResult } = require('express-validator');
const axios = require('axios');


// @route /api/v1/payment/Mpesa
// @desc Mpesa Payment
// @access Private
router.post('/Mpesa',
 body('amount', 'Amount is required').isNumeric(),
 body('packageType', 'Package Type is required').isString(), 
 [isAuthenticated, access], 
 async(req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array(), status: 400 }); 
    // @todo make mpesa payment;

    const paymentId = nanoid(10);
    console.log('User who is logged in is not found', req.user);

    const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
    const auth = `Bearer ${req.access_token}`;
    const date = new Date();
    const timestamp = date.getFullYear() + ("0" + (date.getMonth() + 1)).slice(-2) + ("0" + date.getDate()).slice(-2) + ("0" + date.getHours() + 1 ).slice(-2) + ("0" + date.getMinutes()).slice(-2) + ("0" + date.getSeconds()).slice(-2);
    const password = new Buffer.from("174379" + "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919" + timestamp).toString("base64");

    const config = {
      method: 'POST',
      headers: {
        'Authorization': auth
      },
      body: {
        "BusinessShortCode": "174379",
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": "1",
        "PartyA": "254798355814",
        "PartyB": "174379",
        "PhoneNumber": "254798355814",
        "CallBackURL": "https://d8f0087fab3f.ngrok.io/api/payment/callback",
        "AccountReference": "GOSPEL VIEW",
        "TransactionDesc": "Process payment"
      }
    }

    console.log('config data', config)

    const response = await fetch(url, config);
    const resp = await response.json();
    console.log(resp);

    if (resp.errorCode.includes('404') || resp.errorCode.includes('400')) {
      return res.status(404).json(resp)
    } else { 
      const mpesaPayment = new Mpesa({
        paymentId: paymentId,
        user: 'req.user.id',
        amount: req.body.amount,
        packageType: req.body.packageType
      });
  
      console.log(mpesaPayment)
  
      return res.status(200).json({ message: 'Payment made successfully' });
    } 
  } catch (error) {
    console.log(error);
    return res.status(error.status).json({
      error: error.message,
      status: error.status
    });
  }
});

// @route /api/v1/payment/Airtel
// @desc Mpesa Payment
// @access Private
router.post('/Airtel',
  body('amount', 'Amount is required').isNumeric(),
  body('packageType', 'Package Type is required').isString(),  
  [isAuthenticated, access], 
  async(req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array(), status: 400 });

      // @todo make airtel payment
      const paymentId = nanoid(10);

      // @make server request to pay

      const airtelPayment = new Airtel({
        paymentId: paymentId,
        user: 'req.user.id',
        amount: req.body.amount,
        packageType: req.body.packageType
      });

      console.log(airtelPayment);

      return res.status(200).json({ message: 'Payment made successfully' });

    } catch (error) {
      console.log(error.message)
      return res.status(error.status).json({
        error: error.message,
        status: error.status
      });
    }
});

router.get('/access', async (req, res) => {
  try {
    const url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
  const consumer_key = "phrPBGx0SoVw9QjAOgGxF6KFIAaUvAfm";
  const consumer_secret = "YMxngcz56yt7mYEq";
  const auth = "Basic " + new Buffer.from(consumer_key + ":" + consumer_secret).toString("base64");

  try {
    const config = {
      headers: {
        "Authorization": auth
      }
    }
    const response = await axios.get(url, config);
    console.log(response.data)
    
    // req.access_token = response.data.access_token;
    res.send(response.data);
  } catch (error) {
    console.log('error found in access at line 56', error);
    return res.status(500).json({ msg: error.message});
  }
  } catch (error) {
    console.log(error)
  }
})

module.exports = router;