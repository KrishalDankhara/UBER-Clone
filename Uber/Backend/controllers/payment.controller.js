const paymentService = require('../services/payment.service');
const rideModel = require('../models/ride.model');
const { validationResult } = require('express-validator');

/**
 * Create payment order for a ride
 * POST /api/payments/create-order
 * Body: { rideId }
 */
module.exports.createPaymentOrder = async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false,
                message: 'Validation failed',
                errors: errors.array() 
            });
        }

        const { rideId } = req.body;

        // Find the ride
        const ride = await rideModel.findById(rideId).populate('user');
        if (!ride) {
            return res.status(404).json({
                success: false,
                message: 'Ride not found'
            });
        }

        // Check if user owns this ride
        if (ride.user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized: You can only pay for your own rides'
            });
        }

        // Check if ride is completed
        if (ride.status !== 'completed') {
            return res.status(400).json({
                success: false,
                message: 'Payment can only be made for completed rides'
            });
        }

        // Check if payment already exists
        if (ride.paymentID) {
            return res.status(400).json({
                success: false,
                message: 'Payment already completed for this ride'
            });
        }

        // Create payment order
        const order = await paymentService.createOrder({
            amount: ride.fare,
            rideId: ride._id
        });

        // Update ride with order ID
        ride.orderId = order.id;
        await ride.save();

        res.status(200).json({
            success: true,
            message: 'Payment order created successfully',
            data: {
                orderId: order.id,
                amount: order.amount,
                currency: order.currency,
                rideId: ride._id,
                fare: ride.fare
            }
        });

    } catch (error) {
        console.error('Error creating payment order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create payment order',
            error: error.message
        });
    }
};

/**
 * Verify payment after successful payment
 * POST /api/payments/verify
 * Body: { orderId, paymentId, signature, rideId }
 */
module.exports.verifyPayment = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false,
                message: 'Validation failed',
                errors: errors.array() 
            });
        }

        const { orderId, paymentId, signature, rideId } = req.body;

        // Verify payment signature
        const isValid = paymentService.verifyPayment({
            orderId,
            paymentId,
            signature
        });

        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: 'Invalid payment signature'
            });
        }

        // Find and update the ride
        const ride = await rideModel.findById(rideId);
        if (!ride) {
            return res.status(404).json({
                success: false,
                message: 'Ride not found'
            });
        }

        // Update ride with payment details
        ride.paymentID = paymentId;
        ride.orderId = orderId;
        ride.signature = signature;
        ride.status = 'completed'; // Ensure status is completed
        await ride.save();

        // Get payment details for confirmation
        const paymentDetails = await paymentService.getPaymentDetails(paymentId);

        res.status(200).json({
            success: true,
            message: 'Payment verified and completed successfully',
            data: {
                rideId: ride._id,
                paymentId: paymentId,
                amount: paymentDetails.amount / 100, // Convert from paise to rupees
                status: paymentDetails.status,
                method: paymentDetails.method
            }
        });

    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({
            success: false,
            message: 'Payment verification failed',
            error: error.message
        });
    }
};

/**
 * Handle payment failure
 * POST /api/payments/failed
 * Body: { orderId, paymentId, rideId, error }
 */
module.exports.paymentFailed = async (req, res) => {
    try {
        const { orderId, paymentId, rideId, error } = req.body;

        console.log('Payment failed for ride:', rideId, 'Error:', error);

        // You can add logic here to handle failed payments
        // For example, allowing retry, sending notifications, etc.

        res.status(200).json({
            success: true,
            message: 'Payment failure recorded',
            data: {
                rideId,
                message: 'You can retry the payment or contact support'
            }
        });

    } catch (error) {
        console.error('Error handling payment failure:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to handle payment failure',
            error: error.message
        });
    }
};

/**
 * Get payment status for a ride
 * GET /api/payments/status/:rideId
 */
module.exports.getPaymentStatus = async (req, res) => {
    try {
        const { rideId } = req.params;

        const ride = await rideModel.findById(rideId);
        if (!ride) {
            return res.status(404).json({
                success: false,
                message: 'Ride not found'
            });
        }

        // Check if user owns this ride
        if (ride.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        const paymentStatus = {
            rideId: ride._id,
            fare: ride.fare,
            paymentCompleted: !!ride.paymentID,
            paymentId: ride.paymentID || null,
            orderId: ride.orderId || null
        };

        res.status(200).json({
            success: true,
            data: paymentStatus
        });

    } catch (error) {
        console.error('Error getting payment status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get payment status',
            error: error.message
        });
    }
};