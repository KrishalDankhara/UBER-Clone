import React from 'react'
import Uber_Looking_Driver_Icon from '../assets/Uber_Looking_Driver_Icon.gif'

const LookingForDriver = (props) => {
  return (
        <div>
            <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={()=>{
                props.setVehicleFound(false)
            }}><i className='text-3xl text-gray-200 ri-arrow-down-wide-line'></i></h5>
            <h3 className='text-2xl font-semibold mb-5'>Looking for a Driver</h3>
            
            <div className='flex bg-zinc-600 gap-2 justify-between flex-col items-center'>
                <img className='h-26 mt-8' src={Uber_Looking_Driver_Icon} alt="Car_Icon" />
                <div className='w-full mt-5 bg-white'>
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
            </div>
        </div>
  )
}

export default LookingForDriver