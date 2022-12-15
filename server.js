const mongoose = require("mongoose");

const app = require("./app");

mongoose.set("strictQuery", false);

const { MONGO_URI, PORT } = process.env;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log("Server is running"));
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
