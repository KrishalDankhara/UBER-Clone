import React from 'react'
import Uber_Driver_Profile from '../assets/Uber_Driver_Profile.avif'

const RidePopUp = (props) => {
  if (!props.ride || !props.ride.user || !props.ride.user.fullname) {
    return null; // Don't render if ride data is incomplete
  }

  return (
    <div>
        <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={()=>{
            props.setRidePopupPanel(false)
        }}><i className='text-3xl text-gray-200 ri-arrow-down-wide-line'></i></h5>
        <h3 className='text-2xl font-semibold mb-5'>New Ride Available!</h3>
        <div className='flex items-center justify-between p-3 bg-yellow-300 rounded-lg mt-4'>
            <div className='flex items-center gap-3'>
                <img className='h-12 w-10 rounded-full object-cover' src={Uber_Driver_Profile} alt="Driver_photo" />
                <h2 className='text-lg font-medium'>{props.ride?.user.fullname.firstname + " " + props.ride?.user.fullname.lastname}</h2>
            </div>
            <h5 className='text-lg font-semibold'>
              {props.ride?.distance ? `${(props.ride.distance / 1000).toFixed(1)} KM` : '...'}
            </h5>
        </div>
        <div className='flex gap-2 justify-between flex-col items-center'>
            <div className='w-full mt-5'>
                <div className='flex items-center gap-5 p-3 border-b-3'>
                    <i className='text-lg ri-map-pin-user-fill'></i>
                    <div>
                        <h3 className='text-lg font-medium'>562/11-A</h3>
                        <p className='text-sm -mt-1 text-gray-600'>{props.ride?.pickup}</p>
                    </div>
                </div>
                <div className='flex items-center gap-5 p-3 border-b-3'>
                    <i className='text-lg ri-map-pin-2-fill'></i>
                    <div>
                        <h3 className='text-lg font-medium'>562/11-A</h3>
                        <p className='text-sm -mt-1 text-gray-600'>{props.ride?.destination}</p>
                    </div>
                </div>
                <div className='flex items-center gap-5 p-3'>
                    <i className='text-lg ri-currency-line'></i>
                    <div>
                        <h3 className='text-lg font-medium'>₹{props.ride?.fare}</h3>
                        <p className='text-sm -mt-1 text-gray-600'>Cash Cash</p>
                    </div>
                </div>
            </div>
            <div className='mt-5 w-full'> 
                <button onClick={()=>{
                    props.setConfirmRidePopupPanel(true)
                    props.confirmRide()
                }} className='bg-green-600 w-full text-white font-semibold p-2 px-10 rounded-lg'>Accept</button>

                <button onClick={()=>{
                    props.setRidePopupPanel(false)
                }} className='mt-2 w-full bg-gray-300 text-gray-700 font-semibold p-2 px-10 rounded-lg'>Ignore</button>
            </div>
        </div>
    </div>
  )
}

export default RidePopUp