const razorpay = require("../razorpayClient")
const verifySignature = require("../verifySignature")
const verifyWebhook = require("../webhookVerify")

exports.createOrder = async (req, res) => {

  try {

    const { amount } = req.body

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now()
    })

    res.json(order)

  } catch (error) {
    console.log("Error creating order:", error)
    res.status(500).json(error)
  }
}


exports.verifyPayment = async (req, res) => {

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  } = req.body

  const valid = verifySignature(
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  )

  if (!valid) {
    return res.status(400).json({
      success: false
    })
  }

  res.json({
    success: true
  })
}


exports.webhook = (req, res) => {

  const valid = verifyWebhook(req)

  if (!valid) {
    return res.status(400).send("Invalid webhook")
  }

  const event = req.body.event

  if (event === "payment.captured") {
    console.log("Payment captured:", req.body.payload.payment.entity.id)
  }

  res.json({ status: "ok" })
}