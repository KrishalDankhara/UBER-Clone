import React, { useRef, useState, useContext, useEffect } from 'react'
import Uber_Logo from '../assets/Uber_Logo.png'
import Uber_Map1 from '../assets/Uber_Map1.gif'
import { Link, useNavigate } from 'react-router-dom'
import CaptainDetails from '../components/CaptainDetails'
import RidePopUp from '../components/RidePopUp'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp'
import { SocketContext } from '../context/SocketContext'
import { CaptainDataContext } from '../context/CaptainContext'
import axios from 'axios'
import CaptainLiveMap from '../components/CaptainLiveMap'

const CaptainHome = () => {

    const [ ridePopupPanel, setRidePopupPanel ] = useState(false)
    const [ confirmRidePopupPanel, setConfirmRidePopupPanel ] = useState(false)

    const ridePopupPanelRef = useRef(null)
    const confirmRidePopupPanelRef = useRef(null)
    const [ ride, setRide ] = useState(null)
    const { captain } = useContext(CaptainDataContext)
    const [stats, setStats] = useState({
        earningsToday: 0,
        totalRides: 0,
        onlineTime: 0
    })

    const { socket } = useContext(SocketContext)
    const navigate = useNavigate()

    useEffect(() => {
        if (!captain) return;
        socket.emit('join', { userId: captain._id, userType: 'captain' })
        // this will send the live location of captain to the server via socket.io
        const updateLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {

                    socket.emit('update-location-captain', {
                        userId: captain._id,
                        location: {
                            ltd: position.coords.latitude,
                            lng: position.coords.longitude
                        }
                    })
                })
            }
        }

        const locationInterval = setInterval(updateLocation, 10000)
        updateLocation()

        // return () => clearInterval(locationInterval)
    }, [captain, socket])

    useEffect(() => {
        socket.on('new-ride', (data) => {
            console.log("New ride received:", data);
            // Validate ride data before showing popup
            if (data && data.user && data.user.fullname) {
                setRide(data);
                setRidePopupPanel(true);
            } else {
                console.error("Invalid ride data received:", data);
                setRidePopupPanel(false);
            }
        });
        // Cleanup
        return () => socket.off('new-ride');
    }, [socket]);

    useEffect(() => {
        if (!captain) return;
        axios.get(`http://localhost:4000/captains/${captain._id}/stats`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        .then(res => setStats(res.data))
        .catch(() => setStats({ earningsToday: 0, totalRides: 0, onlineTime: 0 }));
    }, [captain]);

    if (!captain) return <div>Loading...</div>;

    async function confirmRide() {
        const token = localStorage.getItem('token')
        if (!token) {
            alert("You must be logged in as a captain to confirm a ride.")
            navigate('/captain-login')
            return
        }

        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/confirm`, {
            rideId: ride._id,
            captainId: captain._id,
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })

        setRidePopupPanel(false)
        setConfirmRidePopupPanel(true)
    }

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

    useGSAP(function () {
        if (confirmRidePopupPanel) {
            gsap.to(confirmRidePopupPanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(confirmRidePopupPanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ confirmRidePopupPanel ])

    function formatOnlineTime(seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return `${h}h ${m}m`;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 bg-black text-white shadow">
                <img src={Uber_Logo} alt="Uber Logo" className="w-14" />
                <Link to="/captain/logout" className="text-lg font-medium hover:underline">
                    Logout
                </Link>
            </header>

            {/* Profile & Stats */}
            <section className="px-6 py-4 bg-white shadow flex flex-col md:flex-row md:items-center md:justify-between">
                <CaptainDetails earningsToday={stats.earningsToday} />
                {/* Example Online Toggle */}
                <div className="mt-4 md:mt-0 flex items-center gap-2">
                    <span className="text-gray-700 font-medium">Status:</span>
                    <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-sm">
                        Online
                    </span>
                </div>
            </section>

            {/* Map Area */}
            {!ridePopupPanel && (
                <section className="flex-1 flex flex-col items-center justify-center bg-gray-100">
                    <CaptainLiveMap />
                    <div className="mt-6 text-center text-gray-600">
                        Waiting for ride requests...
                    </div>
                </section>
            )}

            {/* Ride Popup */}
            {ridePopupPanel && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative">
                        <RidePopUp
                            ride={ride}
                            setRidePopupPanel={setRidePopupPanel}
                            setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                            confirmRide={confirmRide}
                        />
                    </div>
                </div>
            )}

            {/* Confirm Ride Popup */}
            {confirmRidePopupPanel && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[999]">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md z-[1000]">
                        <ConfirmRidePopUp
                            ride={ride}
                            setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                            setRidePopupPanel={setRidePopupPanel}
                        />
                    </div>
                </div>
            )}

            <div className="flex gap-4 mt-6 justify-center">
                <div className="bg-white shadow rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">₹{stats.earningsToday}</div>
                    <div className="text-gray-500 text-sm">Today's Earnings</div>
                </div>
                <div className="bg-white shadow rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.totalRides}</div>
                    <div className="text-gray-500 text-sm">Total Rides</div>
                </div>
                <div className="bg-white shadow rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-600">{formatOnlineTime(stats.onlineTime)}</div>
                    <div className="text-gray-500 text-sm">Online Time</div>
                </div>
            </div>
        </div>
    )
}

export default CaptainHome