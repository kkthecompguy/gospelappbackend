const express = require('express');
const connectDB = require('./connection/connect');
const cors = require('cors');
const users = require('./controllers/users.controller');
const packages = require('./controllers/packages.controller');

const  app = express();

// Connect To DB;
connectDB();

// Init Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());


// routes
app.use('/api/v1/users', users);
app.use('/api/v1/packages', packages)



app.get('/', (req, res) => {
  res.send('API running')
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
})