const express = require("express")
const stripeRouter = express.Router();

const stripeControlle =  require("../controller/stripe");


stripeRouter.post("/api/v1/create_intent",stripeControlle.createIntent);
stripeRouter.post("/api/v1/capture_intent/:id", stripeControlle.captureId);
stripeRouter.post("/api/v1/create_refund/:id", stripeControlle.refund);
stripeRouter.get("/api/v1/get_intents", stripeControlle.getIntent);



module.exports = {
    stripeRouter
}


