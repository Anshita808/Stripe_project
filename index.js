const express = require("express");
const { connection } = require("./config/db");
const { stripeRouter } = require("./routes/stripe.routes");
require("dotenv").config();
const app = express();
app.use(express.json());

app.use("/stripe",stripeRouter)

app.listen(8080, async () => {
  try {
    await connection;
    console.log("DB is connected");
  } catch (error) {
    console.log(error);
  }
  console.log("Server is running ");
});
