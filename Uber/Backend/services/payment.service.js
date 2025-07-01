const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay with test credentials
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Create a payment order
 * @param {number} amount - Amount in rupees (will be converted to paise)
 * @param {string} currency - Currency code (default: INR)
 * @param {string} rideId - Ride ID for reference
 * @returns {Object} Razorpay order object
 */
module.exports.createOrder = async ({ amount, currency = 'INR', rideId }) => {
    try {
        // Validate input
        if (!amount || amount <= 0) {
            throw new Error('Amount must be greater than 0');
        }
        if (!rideId) {
            throw new Error('Ride ID is required');
        }

        // Convert amount to paise (Razorpay works with smallest currency unit)
        const amountInPaise = Math.round(amount * 100);

        const options = {
            amount: amountInPaise,
            currency: currency,
            receipt: `ride_${rideId}_${Date.now()}`, // Unique receipt ID
            notes: {
                rideId: rideId,
                description: 'Uber ride payment'
            }
        };

        console.log('Creating Razorpay order with options:', options);
        const order = await razorpay.orders.create(options);
        console.log('Razorpay order created:', order.id);

        return order;
    } catch (error) {
        console.error('Error creating payment order:', error);
        throw new Error(`Payment order creation failed: ${error.message}`);
    }
};

/**
 * Verify payment signature
 * @param {string} orderId - Razorpay order ID
 * @param {string} paymentId - Razorpay payment ID
 * @param {string} signature - Razorpay signature
 * @returns {boolean} True if signature is valid
 */
module.exports.verifyPayment = ({ orderId, paymentId, signature }) => {
    try {
        // Create the expected signature
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(orderId + '|' + paymentId)
            .digest('hex');

        console.log('Expected signature:', expectedSignature);
        console.log('Received signature:', signature);

        return expectedSignature === signature;
    } catch (error) {
        console.error('Error verifying payment:', error);
        return false;
    }
};

/**
 * Get payment details from Razorpay
 * @param {string} paymentId - Razorpay payment ID
 * @returns {Object} Payment details
 */
module.exports.getPaymentDetails = async (paymentId) => {
    try {
        const payment = await razorpay.payments.fetch(paymentId);
        return payment;
    } catch (error) {
        console.error('Error fetching payment details:', error);
        throw new Error(`Failed to fetch payment details: ${error.message}`);
    }
};

/**
 * Create refund for a payment
 * @param {string} paymentId - Razorpay payment ID
 * @param {number} amount - Refund amount in paise (optional - full refund if not provided)
 * @returns {Object} Refund details
 */
module.exports.createRefund = async (paymentId, amount = null) => {
    try {
        const refundData = { payment_id: paymentId };
        if (amount) {
            refundData.amount = amount;
        }

        const refund = await razorpay.payments.refund(paymentId, refundData);
        return refund;
    } catch (error) {
        console.error('Error creating refund:', error);
        throw new Error(`Refund creation failed: ${error.message}`);
    }
};