import React from 'react'
import Uber_Car_Icon from '../assets/Uber_Car_Icon.webp'
import Uber_Moto_Icon from '../assets/Uber_Moto_Icon.jpeg'
import Uber_Auto_Icon from '../assets/Uber_Auto_Icon.jpeg'

const VehiclePanel = (props) => {
  return (
    <div>
        <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={()=>{
            props.setVehiclePanel(false)
        }}><i className='text-3xl text-gray-200 ri-arrow-down-wide-line'></i></h5>
        <h3 className='text-2xl font-semibold mb-5'>Choose a Vehicle</h3>
        <div onClick={()=>{
            props.setConfirmRidePanel(true)
            props.selectVehicle('car')
        }} className='flex border-2 border-gray-50 active:border-black mb-2 rounded-xl w-full p-3 items-center justify-between'>
          <img className='h-15' src={Uber_Car_Icon} alt="Car_Icon" />
          <div className='ml-2 w-1/2'>
            <h4 className='font-medium text-base'>UberGo <span><i className='ri-user-3-fill'></i>4</span></h4>
            <h5 className='font-medium text-sm'>2 mins away</h5>
            <p className='font-normal text-xs text-gray-600'>Affordable, compact rides</p>
          </div>
            <h2 className='text-lg font-semibold'>₹{props.fare.car}</h2>
        </div>
        <div onClick={()=>{
            props.setConfirmRidePanel(true)
            props.selectVehicle('moto')
        }} className='flex border-2 border-gray-50 active:border-black mb-2 rounded-xl w-full p-3 items-center justify-between'>
          <img className='h-15' src={Uber_Moto_Icon} alt="Bike_Icon" />
          <div className='ml-2 w-1/2'>
            <h4 className='font-medium text-base'>Moto <span><i className='ri-user-3-fill'></i>1</span></h4>
            <h5 className='font-medium text-sm'>3 mins away</h5>
            <p className='font-normal text-xs text-gray-600'>Affordable motorcycle rides</p>
          </div>
            <h2 className='text-lg font-semibold'>₹{props.fare.moto}</h2>
        </div>
        <div onClick={()=>{
            props.setConfirmRidePanel(true)
            props.selectVehicle('auto')
        }} className='flex border-2 border-gray-50 active:border-black mb-2 rounded-xl w-full p-3 items-center justify-between'>
          <img className='h-15' src={Uber_Auto_Icon} alt="Auto_Icon" />
          <div className='ml-5 w-1/2'>
            <h4 className='font-medium text-base'>UberAuto <span><i className='ri-user-3-fill'></i>3</span></h4>
            <h5 className='font-medium text-sm'>3 mins away</h5>
            <p className='font-normal text-xs text-gray-600'>Affordable Auto rides</p>
          </div>
            <h2 className='text-lg font-semibold'>₹{props.fare.auto}</h2>
        </div>
    </div>
  )
}

export default VehiclePanel