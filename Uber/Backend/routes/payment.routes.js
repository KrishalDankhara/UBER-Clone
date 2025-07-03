const express = require('express');
const router = express.Router();
const razorpay = require('../services/payment.service');
const crypto = require('crypto');
const Ride = require('../models/ride.model'); // adjust path if needed

// Create Razorpay order
router.post('/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;
    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt: receipt || `rcpt_${Date.now()}`
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create order', details: err.message });
  }
});

// Verify Razorpay payment
router.post('/verify', async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, rideId } = req.body;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  const hmac = crypto.createHmac('sha256', key_secret);
  hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
  const generated_signature = hmac.digest('hex');

  if (generated_signature === razorpay_signature) {
    // Payment is verified, update ride/payment status
    if (rideId) {
      await Ride.findByIdAndUpdate(rideId, { status: "completed" });
    }
    return res.json({ success: true, message: "Payment verified and ride updated" });
  } else {
    return res.status(400).json({ success: false, message: "Payment verification failed" });
  }
});

module.exports = router;
