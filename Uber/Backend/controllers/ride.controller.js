const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');
const mapService = require('../services/maps.service');
const { sendMessageToSocketId } = require('../socket');
const rideModel = require('../models/ride.model');


// module.exports.createRide = async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const { userId, pickup, destination, vehicleType } = req.body;

//     try {
//         const ride = await rideService.createRide({ user: req.user._id, pickup, destination, vehicleType });
//         res.status(201).json(ride);

//         const pickupCoordinates = await mapService.getAddressCoordinate(pickup);


//         const captainsInRadius = await mapService.getCaptainsInTheRadius(pickupCoordinates.ltd, pickupCoordinates.lng, 2); //search in 2km radius

//         ride.otp = ""

//         const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate('user');

//         captainsInRadius.map(captain => {

//             sendMessageToSocketId(captain.socketId, {
//                 event: 'new-ride',
//                 data: rideWithUser
//             })

//         })

//     } catch (err) {

//         console.log(err);
//         return res.status(500).json({ message: err.message });
//     }

// };

// module.exports.createRide = async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const { userId, pickup, destination, vehicleType } = req.body;

//     try {
//         // 1. Create the ride document
//         const ride = await rideService.createRide({ user: req.user._id, pickup, destination, vehicleType });

//         // 2. Get pickup coordinates
//         const pickupCoordinates = await mapService.getAddressCoordinate(pickup);

//         // ---- Correction: Use lat and lng, not ltd ----
//         const lat = Number(pickupCoordinates.lat);
//         const lng = Number(pickupCoordinates.lng);

//         if (isNaN(lat) || isNaN(lng)) {
//             return res.status(400).json({ message: "Unable to determine coordinates for pickup location." });
//         }

//         // 3. Find captains in the radius (2km)
//         const captainsInRadius = await mapService.getCaptainsInTheRadius(lat, lng, 2);

//         // 4. Optionally, set the ride OTP here if needed
//         ride.otp = ""; // Or generate OTP logic

//         // 5. Populate user details for the notification
//         const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate('user');

//         // 6. Notify all captains
//         captainsInRadius.forEach(captain => {
//             sendMessageToSocketId(captain.socketId, {
//                 event: 'new-ride',
//                 data: rideWithUser
//             });
//         });

//         // 7. Now respond to client!
//         return res.status(201).json(ride);

//     } catch (err) {
//         console.log(err);
//         if (!res.headersSent) {
//             return res.status(500).json({ message: err.message });
//         }
//     }
// };
// 
module.exports.createRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { userId, pickup, destination, vehicleType } = req.body;

    try {
        console.log('[Ride Creation] Creating ride for:', pickup, '->', destination);

        // 1. Create the ride document
        const ride = await rideService.createRide({ user: req.user._id, pickup, destination, vehicleType });
        console.log('[Ride Creation] Ride DB record created:', ride._id);

        // 2. Get pickup coordinates from GoMaps
        const pickupCoordinates = await mapService.getAddressCoordinate(pickup);
        console.log('[Ride Creation] Pickup coordinates:', pickupCoordinates);

        // 3. Validate coordinates and search for captains
        const lat = Number(pickupCoordinates.lat);
        const lng = Number(pickupCoordinates.lng);
        const radius = 5; // km

        if (isNaN(lat) || isNaN(lng) || isNaN(radius)) {
            console.log('[Ride Creation] Invalid coordinates:', lat, lng, radius);
            return res.status(400).json({ message: "Latitude, longitude, and radius must all be valid numbers." });
        }

        const captainsInRadius = await mapService.getCaptainsInTheRadius(lng, lat, radius);
        console.log('[Ride Creation] Captains found in radius:', captainsInRadius.length);

        // 4. (Optional) Set ride OTP if you need
        ride.otp = ""; // Or implement your OTP logic

        // 5. Populate user details for the notification
        const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate('user');

        // 6. Notify all captains
        captainsInRadius.forEach(captain => {
            sendMessageToSocketId(captain.socketId, {
                event: 'new-ride',
                data: rideWithUser
            });
        });

        // 7. Send response to client
        console.log('[Ride Creation] Ride created successfully and captains notified.');
        return res.status(201).json(ride);

    } catch (err) {
        // Handle address not found gracefully
        if (err.message && err.message.includes('No results found for the provided address')) {
            console.log('[Ride Creation] Address not found:', pickup);
            return res.status(400).json({ message: "Could not find location for the given pickup address. Please check your spelling or try a more specific address." });
        }

        // Other errors
        console.error('[Ride Creation] Error:', err);
        if (!res.headersSent) {
            return res.status(500).json({ message: err.message });
        }
    }
};


module.exports.getFare = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination } = req.query;

    try {
        const fare = await rideService.getFare(pickup, destination);
        return res.status(200).json(fare);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports.confirmRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.confirmRide({ rideId, captain: req.captain });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-confirmed',
            data: ride
        })

        return res.status(200).json(ride);
    } catch (err) {

        console.log(err);
        return res.status(500).json({ message: err.message });
    }
}

module.exports.startRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, otp } = req.query;

    try {
        const ride = await rideService.startRide({ rideId, otp, captain: req.captain });

        console.log(ride);

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-started',
            data: ride
        })

        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports.endRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.endRide({ rideId, captain: req.captain });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-ended',
            data: ride
        })



        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}