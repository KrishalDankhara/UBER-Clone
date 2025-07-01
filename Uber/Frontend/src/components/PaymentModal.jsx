import React, { useState } from 'react';
import axios from 'axios';

const PaymentModal = ({ isOpen, onClose, ride, onPaymentSuccess }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');

    // Load Razorpay script dynamically
    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        try {
            setIsProcessing(true);
            setError('');

            // Load Razorpay script
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                throw new Error('Failed to load payment gateway. Please check your internet connection.');
            }

            // Create payment order
            const orderResponse = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/payments/create-order`,
                { rideId: ride._id },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            if (!orderResponse.data.success) {
                throw new Error(orderResponse.data.message || 'Failed to create payment order');
            }

            const { orderId, amount, currency } = orderResponse.data.data;

            // Razorpay options
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: amount, // Amount in paise
                currency: currency,
                name: 'Uber Clone',
                description: `Payment for ride from ${ride.pickup} to ${ride.destination}`,
                order_id: orderId,
                handler: async function (response) {
                    try {
                        // Verify payment on backend
                        const verifyResponse = await axios.post(
                            `${import.meta.env.VITE_BASE_URL}/payments/verify`,
                            {
                                orderId: response.razorpay_order_id,
                                paymentId: response.razorpay_payment_id,
                                signature: response.razorpay_signature,
                                rideId: ride._id
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${localStorage.getItem('token')}`
                                }
                            }
                        );

                        if (verifyResponse.data.success) {
                            onPaymentSuccess(verifyResponse.data.data);
                            onClose();
                        } else {
                            throw new Error('Payment verification failed');
                        }
                    } catch (error) {
                        console.error('Payment verification error:', error);
                        setError('Payment verification failed. Please contact support.');
                    }
                },
                modal: {
                    ondismiss: function() {
                        setIsProcessing(false);
                        setError('Payment was cancelled');
                    }
                },
                prefill: {
                    name: ride.user?.fullname?.firstname + ' ' + (ride.user?.fullname?.lastname || ''),
                    email: ride.user?.email || '',
                    contact: ride.user?.phone || ''
                },
                theme: {
                    color: '#000000'
                },
                retry: {
                    enabled: true,
                    max_count: 3
                }
            };

            const razorpay = new window.Razorpay(options);
            
            razorpay.on('payment.failed', function (response) {
                console.error('Payment failed:', response.error);
                setError(`Payment failed: ${response.error.description}`);
                
                // Log payment failure
                axios.post(
                    `${import.meta.env.VITE_BASE_URL}/payments/failed`,
                    {
                        orderId: orderId,
                        paymentId: response.error.metadata?.payment_id || '',
                        rideId: ride._id,
                        error: response.error.description
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                ).catch(err => console.error('Failed to log payment failure:', err));
            });

            razorpay.open();

        } catch (error) {
            console.error('Payment error:', error);
            setError(error.message || 'Payment failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-11/12 max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Complete Payment</h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                        disabled={isProcessing}
                    >
                        <i className="ri-close-line text-2xl"></i>
                    </button>
                </div>

                <div className="mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <h3 className="font-semibold mb-2">Ride Details</h3>
                        <div className="text-sm space-y-1">
                            <p><span className="font-medium">From:</span> {ride.pickup}</p>
                            <p><span className="font-medium">To:</span> {ride.destination}</p>
                            <p><span className="font-medium">Distance:</span> {(ride.distance / 1000).toFixed(2)} km</p>
                            <p><span className="font-medium">Duration:</span> {Math.round(ride.duration / 60)} mins</p>
                        </div>
                    </div>

                    <div className="flex justify-between items-center text-lg font-bold">
                        <span>Total Amount:</span>
                        <span className="text-green-600">₹{ride.fare}</span>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                <div className="space-y-3">
                    <button
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
                            isProcessing 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-green-600 hover:bg-green-700'
                        }`}
                    >
                        {isProcessing ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Processing...
                            </div>
                        ) : (
                            `Pay ₹${ride.fare}`
                        )}
                    </button>

                    <button
                        onClick={onClose}
                        disabled={isProcessing}
                        className="w-full py-3 px-4 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                </div>

                <div className="mt-4 text-xs text-gray-500 text-center">
                    <p>🔒 Secure payment powered by Razorpay</p>
                    <p>Test Mode: Use test card numbers for payment</p>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;