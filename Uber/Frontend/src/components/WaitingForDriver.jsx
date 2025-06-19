import React from 'react'
import Uber_Driver from  '../assets/Uber_Driver.jpeg'

const WaitingForDriver = (props) => {
  return (
    <div>
                <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={()=>{
                    props.WaitingForDriver(false)
                }}><i className='text-3xl text-gray-200 ri-arrow-down-wide-line'></i></h5>
                
                <div className='flex itmes-center justify-between'>
                  <img className='h-12' src={Uber_Driver} alt="Uber_Driver" />
                  <div className='text-right'>
                    <h2 className='text-lg font-medium'>Milan</h2>
                    <h4 className='text-xl font-semibold -mt-1 -mb-1'>GJ 05 EX 5363</h4>
                    <p className='text-sm text-gray-600'>Maruti Suzuki Alto</p>
                  </div>
                </div>

                <div className='flex bg-zinc-600 gap-2 justify-between flex-col items-center'>
                    <div className='w-full mt-5 bg-white'>
                        <div className='flex items-center gap-5 p-3 border-b-3'>
                            <i className='text-lg ri-map-pin-user-fill'></i>
                            <div>
                                <h3 className='text-lg font-medium'>562/11-A</h3>
                                <p className='text-sm -mt-1 text-gray-600'>Kankariya Lake, Ahmedabad</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-5 p-3 border-b-3'>
                            <i className='text-lg ri-map-pin-2-fill'></i>
                            <div>
                                <h3 className='text-lg font-medium'>562/11-A</h3>
                                <p className='text-sm -mt-1 text-gray-600'>Kankariya Lake, Ahmedabad</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-5 p-3'>
                            <i className='text-lg ri-currency-line'></i>
                            <div>
                                <h3 className='text-lg font-medium'>₹193.20</h3>
                                <p className='text-sm -mt-1 text-gray-600'>Cash Cash</p>
                            </div>
                        </div> 
                    </div>
                </div>
            </div>
  )
}

export default WaitingForDriver