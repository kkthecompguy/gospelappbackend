const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config()

module.exports = function (req, res, next) {
  try {
    const token = req.headers['authorization']; 

    if (!token) {
      return res.status(401).json({ 
        errors: [{ 
          msg :"Unauthorized",
          status: 401
        }] 
      }); 
    }
    
    const onlyToken = token.slice(7, token.length);
    const decoded = jwt.verify(onlyToken, process.env.JWT_SECRECT_KEY);

    req.user = decoded.user;

    next();
    
  } catch (err) {
    console.log(err)
    return res.status(401).json({ 
      errors: [{ 
        msg :"Unauthorized",
        status: 401
      }] 
    });
  }
}