const jwt = require('jsonwebtoken');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config()

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.headers['authorization']; 

    if (!token) {
      return res.status(401).json({ 
        msg : "Unauthorized",
        status: 401
      }); 
    }
    
    const onlyToken = token.slice(7, token.length);
    const decoded = jwt.verify(onlyToken, process.env.JWT_SECRECT_KEY);

    req.user = decoded;

    next();
    
  } catch (err) {
    console.log(err.message);
    return res.status(401).json({ 
      msg : "Unauthorized",
      status: 401
    });
  }
}

const access = async (req, res, next) => {

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
    
    req.access_token = response.data.access_token;
    next();

  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: error.message});
  }  
}


module.exports = { isAuthenticated, access }