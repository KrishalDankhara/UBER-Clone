import React from 'react'
import Uber_Logo from '../assets/Uber_Logo.png'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div>
        <div className='bg-[url(./assets/Uber_Splash.jpg)] bg-cover bg-center h-screen pt-8 flex justify-between flex-col w-full'>
            <img className='w-16 ml-8' src={Uber_Logo} alt="Uber_Logo" />
            <div className='bg-white pb-7 py-4 px-4'>
                <h2 className='text-3xl font-bold'>Get Started With Uber</h2>
                <Link to='/login' className='flex items-center justify-center w-full bg-black text-white py-3 rounded mt-5'>Continue</Link>
            </div>
        </div>
    </div>
  )
}

export default Home