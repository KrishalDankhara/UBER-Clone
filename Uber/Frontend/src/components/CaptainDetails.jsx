import React, { useContext } from 'react'
import { CaptainDataContext } from '../context/CaptainContext'
import Uber_Driver_Profile from '../assets/Uber_Driver_Profile.avif'

const CaptainDetails = ({ earningsToday }) => {

  const { captain } = useContext(CaptainDataContext)

  return (
    <div>
        <div className='flex items-center justify-between'>
              <div className='flex items-center justify-start gap-3'>
                <img className='h-10 w-10 rounded-full object-cover' src={Uber_Driver_Profile}alt="Driver_Photo" />
                <h4 className='text-lg font-medium capitalize'>{captain.fullname.firstname + " " + captain.fullname.lastname}</h4>
              </div>
              <div>
                <h4 className='text-xl font-semibold'>₹{earningsToday}</h4>
                <p className='text-sm text-gray-600'>Earned</p>
              </div>
            </div>
    </div>
  )
}

export default CaptainDetails