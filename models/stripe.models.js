const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  amount: Number,
  description: String,
  status: String,
  refundable: Boolean,
  paymentId: String,
});


const PaymentIntent = mongoose.model("PaymentIntent",paymentSchema);


module.exports = { PaymentIntent };
