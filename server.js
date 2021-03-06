const express = require('express');
const connectDB = require('./connection/connect');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const users = require('./controllers/users.controller');
const packages = require('./controllers/packages.controller');
const videos = require('./controllers/videos.controller');
const audios = require('./controllers/audios.controller');
const payment = require('./controllers/payment.controller');

const  app = express();

// Connect To DB;
connectDB();

// Init Middleware
app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));
app.use((req, res, next) => { 
  next();
})


// routes
app.use('/api/v1/users', users);
app.use('/api/v1/packages', packages)
app.use('/api/v1/videos', videos);
app.use('/api/v1/audios', audios);
app.use('/api/v1/payment', payment);



app.get('/', (req, res) => {
  res.send('API running')
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
})