require("dotenv").config();
const stripe = require("stripe")(process.env.SECRET_KEY);
const { PaymentIntent } = require("../models/stripe.models");

const createIntent = async (req, res) => {
  try {
    const { amount, description } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "inr",
      description,
    });

    // Save payment intent details in MongoDB
    const newPaymentIntent = new PaymentIntent({
      amount,
      description,
      status: paymentIntent.status,
      refundable: true,
      paymentId : paymentIntent.id
    });

    await newPaymentIntent.save();

    res.json(paymentIntent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create payment intent" });
  }
};

// getting payments through id
const captureId = async (req, res) => {
 try {
   const { id } = req.params; // Get the payment intent ID from the request parameters

   // Retrieve the payment intent from Stripe
   const paymentIntent = await stripe.paymentIntents.capture(id);

   // Update the payment intent status in MongoDB (optional)
   // You can store the captured payment intent details in your database if needed
   const updatedPaymentIntent = await PaymentIntent.findOneAndUpdate(
     { paymentId: id },
     { status: paymentIntent.status },
     { new: true }
   );

   res.json(updatedPaymentIntent); // Respond with the updated payment intent
 } catch (error) {
   console.error(error);
   res.status(500).json({ error: "Failed to capture payment intent" });
 }
};

const refund = async (req,res) => {
   try {
     const { id } = req.params;

     const refund = await stripe.refunds.create({
       payment_intent: id,
     });

     const newRefund = new Refund({
       paymentIntentId: id,
       refundId: refund.id,
       // Add other refund details as needed
     });

     await newRefund.save();

     res.json({ refund });
   } catch (error) {
     console.error(error);
     res.status(500).json({ error: "Failed to create refund" });
   }
}

const getIntent = async (req,res) => {
   try {
     const paymentIntents = await PaymentIntent.find();

     res.json({ paymentIntents });
   } catch (error) {
     console.error(error);
     res.status(500).json({ error: "Failed to fetch payment intents" });
   }
}

module.exports = {
  createIntent,
  captureId,
  refund,
  getIntent
};
