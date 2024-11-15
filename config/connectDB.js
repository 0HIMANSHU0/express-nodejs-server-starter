const mongoose = require("mongoose");

const connectToMongoDB = async () => {
  console.log("The MonogDB URI value is:", process.env.MONGO_URI);
  const { connection } = await mongoose.connect(process.env.MONGO_URI, {
    dbName: "nextjs_fullstack",
  });

  console.log(`The MongoDb is Connected On :- ${connection.host}`);
};

module.exports = connectToMongoDB;
