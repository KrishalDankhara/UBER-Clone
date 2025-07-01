const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/auth.middleware');
const paymentController = require('../controllers/payment.controller');

// All payment routes require authentication
router.use(authMiddleware.authUser);

// Create payment order
router.post('/create-order', [
    body('rideId')
        .notEmpty()
        .withMessage('Ride ID is required')
        .isMongoId()
        .withMessage('Invalid ride ID format')
], paymentController.createPaymentOrder);

// Verify payment
router.post('/verify', [
    body('orderId')
        .notEmpty()
        .withMessage('Order ID is required'),
    body('paymentId')
        .notEmpty()
        .withMessage('Payment ID is required'),
    body('signature')
        .notEmpty()
        .withMessage('Payment signature is required'),
    body('rideId')
        .notEmpty()
        .withMessage('Ride ID is required')
        .isMongoId()
        .withMessage('Invalid ride ID format')
], paymentController.verifyPayment);

// Handle payment failure
router.post('/failed', [
    body('rideId')
        .notEmpty()
        .withMessage('Ride ID is required')
        .isMongoId()
        .withMessage('Invalid ride ID format')
], paymentController.paymentFailed);

// Get payment status
router.get('/status/:rideId', paymentController.getPaymentStatus);

module.exports = router;