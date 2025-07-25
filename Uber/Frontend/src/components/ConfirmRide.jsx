import React from 'react'
import Uber_Car_Icon from '../assets/Uber_Car_Icon.webp'

const ConfirmRide = (props) => {
  return (
    <div>
        <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={()=>{
            props.setConfirmRidePanel(false)
        }}><i className='text-3xl text-gray-200 ri-arrow-down-wide-line'></i></h5>
        <h3 className='text-2xl font-semibold mb-5'>Confirm your Ride</h3>
        
        <div className='flex gap-2 justify-between flex-col items-center'>
            <img className='h-26' src={Uber_Car_Icon} alt="Car_Icon" />
            <div className='w-full mt-5'>
                <div className='flex items-center gap-5 p-3 border-b-3'>
                    <i className='text-lg ri-map-pin-user-fill'></i>
                    <div>
                        <h3 className='text-lg font-medium'>562/11-A</h3>
                        <p className='text-sm -mt-1 text-gray-600'>{props.pickup}</p>
                    </div>
                </div>
                <div className='flex items-center gap-5 p-3 border-b-3'>
                    <i className='text-lg ri-map-pin-2-fill'></i>
                    <div>
                        <h3 className='text-lg font-medium'>562/11-A</h3>
                        <p className='text-sm -mt-1 text-gray-600'>{props.destination}</p>
                    </div>
                </div>
                <div className='flex items-center gap-5 p-3'>
                    <i className='text-lg ri-currency-line'></i>
                    <div>
                        <h3 className='text-lg font-medium'>₹{props.fare[ props.vehicleType ]}</h3>
                        <p className='text-sm -mt-1 text-gray-600'>Cash Cash</p>
                    </div>
                </div>
            </div>
            <button onClick={()=>{
                props.setVehicleFound(true)
                props.setConfirmRidePanel(false)
                props.createRide()
            }} className='w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg'>Confirm</button>
        </div>
    </div>
  )
}// #D5D5E5 #D4D4E2 #DCD9E8 #CFCFDE , bg-[#CFD1DE]

export default ConfirmRide