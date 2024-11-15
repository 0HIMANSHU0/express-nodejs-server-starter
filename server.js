const app = require("./app");
const dotenv = require("dotenv");
const connectToMongoDB = require("./config/connectDB");
dotenv.config({ path: "config/config.env" });

// Handling UnCaught Exceptions
process.on("uncaughtException", (err) => {
  console.log(`UnCaughtException Error: ${err}`);
  console.log(`Shutting the Server due to UnCaught Exception Error`);
  process.exit(1);
});

const PORT = process.env.PORT || 8080;
app.get("/", (req, res) => {
  res.send("Hi, I am Live Here ✅👍✅");
});

connectToMongoDB();
const server = app.listen(PORT, () => {
  console.log(`Server is listen on PORT ${PORT}`);
});

// Unhandled Promises Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err}`);
  console.log(`Shutting Down the Server due to the Unhandled Rejection Error`);
  server.close(() => {
    process.exit(1);
  });
});
