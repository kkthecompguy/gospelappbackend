const mongoose = require('mongoose');

const connectDB = async () => {
  await mongoose.connect(`mongodb+srv://gospelview:gospelviewpwd123@gvcluster.qh7wb.mongodb.net/gospelview?retryWrites=true&w=majority`,{
    useNewUrlParser: true,
    useFindAndModify: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  });
  console.log('DB connected');
} 
module.exports = connectDB;