import React, { useEffect, useRef, useState } from 'react'
import Uber_Logo from '../assets/Uber_Logo.png'
import Uber_Map1 from '../assets/Uber_Map1.gif'
import {useGSAP} from '@gsap/react'
import gsap from 'gsap'
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel'

const Home = () => {
  const [pickup, setPickup] = useState('')
  const [destination, setDestination] = useState('')
  const [panelOpen, setPanelOpen] = useState(false)
  const panelRef = useRef(null)
  const panelCloseRef = useRef(null)

  const submitHandler = (e) =>{
    e.preventDefault() // if user by mistake click enter during form fillup then it prevents for submitting
  }

  useGSAP(function () {
        if (panelOpen) {
            gsap.to(panelRef.current, {
                height: '70%',
                padding: 24,
                opacity:1
            })
            gsap.to(panelCloseRef.current, {
                opacity: 1
            })
        } else {
            gsap.to(panelRef.current, {
                height: '0%',
                padding: 0,
                opacity:0
            })
            gsap.to(panelCloseRef.current, {
                opacity: 0
            })
        }
    }, [ panelOpen ])

  return (
    <div className='h-screen relative overflow-hidden'>
        <img className='w-16 absolute left-5 top-5' src={Uber_Logo} alt="Uber_Logo" />
        <div className='h-screen w-screen'>
            <img className='h-full w-full' src={Uber_Map1} alt="Uber_Map" />
        </div>
        <div className='flex flex-col justify-end h-screen absolute top-0 w-full'>
            <div className='h-[30%] p-6 bg-white relative'>
                <h5 ref={panelCloseRef} onClick={()=> {
                    setPanelOpen(false)
                }} className='absolute opacity-0 top-6 right-6 text-2xl'>
                    <i className="ri-arrow-down-wide-line"></i>
                </h5>
                <h4 className='text-2xl font-semibold'>Find a trip</h4>
            <form className='relative py-3' onSubmit={(e) => {
                submitHandler(e)
            }}>
                <div className='line absolute h-16 w-1 top-[49%] -translate-y-1/2 left-5 bg-gray-700 rounded-full'></div>
                <input 
                onClick={()=>{
                    setPanelOpen(true)
                }}
                value={pickup}
                onChange={(e)=>{
                    setPickup(e.target.value)
                }}
                className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full' 
                type="text" 
                placeholder='Add a pick-up location' 
                />
                <input 
                onClick={()=>{
                    setPanelOpen(true)
                }}
                value={destination}
                onChange={(e)=>{
                    setDestination(e.target.value)
                }}
                className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-3' 
                type="text" 
                placeholder='Enter your destination' 
                />
            </form>
            </div>
            <div ref={panelRef} className='bg-white h-0'>
                <LocationSearchPanel />
            </div>
        </div>
    </div>
  )
}

export default Home