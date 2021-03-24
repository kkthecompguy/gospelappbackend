const mongoose = require('mongoose');

const connectDB = async () => {
  await mongoose.connect(`mongodb://localhost/gospelappbackend`,{
    useNewUrlParser: true,
    useFindAndModify: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  });
  console.log('DB connected');
}

module.exports = connectDB;