import React, { useEffect, useRef, useState } from 'react'
import Uber_Logo from '../assets/Uber_Logo.png'
import Uber_Map1 from '../assets/Uber_Map1.gif'
import { Link } from 'react-router-dom'
import {useGSAP} from '@gsap/react'
import gsap from 'gsap'
import CaptainDetails from '../components/CaptainDetails'
import RidePopUp from '../components/RidePopUp'

const CaptainHome = () => {

  const [ridePopupPanel, setRidePopupPanel] = useState(true)
  const ridePopupPanelRef = useRef(null)

  useGSAP(function () {
        if (ridePopupPanel) {
            gsap.to(ridePopupPanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(ridePopupPanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ ridePopupPanel ])

  return (
    <div className='h-screen'>
        <div className='fixed p-6 top-0 flex items-center justify-between w-screen'>
          <img className='w-16' src={Uber_Logo} alt="Uber_Logo" />
          <Link to='/home' className='h-10 w-10 bg-white flex items-center justify-center rounded-full'>
            <i className='text-lg font-medium ri-logout-box-r-line'></i>
          </Link>
        </div>
        <div className='h-3/5'>
            <img className='h-full w-full' src={Uber_Map1} alt="Uber_Map" />
        </div>
        <div className='h-2/5 p-6'>
            <CaptainDetails />
        </div>
        <div ref={ridePopupPanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-9 py-10 pt-12'>
            <RidePopUp setRidePopupPanel={setRidePopupPanel} />
        </div>
    </div>
  )
}

export default CaptainHome