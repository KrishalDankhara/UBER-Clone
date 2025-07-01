import React, { useState, useEffect } from 'react'
import Uber_Map1 from '../assets/Uber_Map1.gif'
import Uber_Driver from  '../assets/Uber_Driver.jpeg'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import PaymentModal from '../components/PaymentModal'

const Riding = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [ride, setRide] = useState(location.state?.ride || null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  useEffect(() => {
    // If no ride data, redirect to home
    if (!ride) {
      navigate('/home');
    }
  }, [ride, navigate]);

  const handlePaymentSuccess = (paymentData) => {
    setPaymentCompleted(true);
    console.log('Payment completed:', paymentData);
    // You can show a success message or redirect
    setTimeout(() => {
      navigate('/home');
    }, 3000);
  };

  if (!ride) {
    return <div>Loading...</div>;
  }

  return (
    <div className='h-screen'>
        <Link to='/home' className='fixed right-2 top-2 h-10 w-10 bg-white flex items-center justify-center rounded-full'>
            <i className='text-lg font-medium ri-home-5-line'></i>
        </Link>
        <div className='h-1/2'>
            <img className='h-full w-full' src={Uber_Map1} alt="Uber_Map" />
        </div>
        <div className='h-1/2 p-4'>
            <div className='flex itmes-center justify-between'>
                              <img className='h-16' src={Uber_Driver} alt="Uber_Driver" />
                              <div className='text-right'>
                                <h2 className='text-lg font-medium'>Milan</h2>
                                <h4 className='text-xl font-semibold -mt-1 -mb-1'>GJ 05 EX 5363</h4>
                                <p className='text-sm text-gray-600'>Maruti Suzuki Alto</p>
                              </div>
            </div>
            
            <div className='flex gap-2 justify-between flex-col items-center'>
                <div className='w-full mt-5 bg-white'>
                    <div className='flex items-center gap-5 p-3 border-b-3'>
                                                <i className='text-lg ri-map-pin-2-fill'></i>
                        <div>
                            <h3 className='text-lg font-medium'>{ride.destination}</h3>
                            <p className='text-sm -mt-1 text-gray-600'>Destination</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3'>
                        <i className='text-lg ri-currency-line'></i>
                        <div>
                            <h3 className='text-lg font-medium'>₹{ride.fare}</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{paymentCompleted ? 'Paid' : 'Pending Payment'}</p>
                        </div> 
                    </div> 
                </div>
            </div>
            
            {paymentCompleted ? (
                <div className='w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg text-center'>
                    ✅ Payment Completed Successfully!
                </div>
            ) : (
                <button 
                    onClick={() => setShowPaymentModal(true)}
                    className='w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg hover:bg-green-700 transition-colors'
                >
                    Make a Payment - ₹{ride.fare}
                </button>
            )}

            <PaymentModal 
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                ride={ride}
                onPaymentSuccess={handlePaymentSuccess}
            />
        </div>
    </div>
  )
}

export default Riding