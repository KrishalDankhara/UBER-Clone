const captainModel = require('../models/captain.model');
const captainService = require('../services/captain.service');
const blackListTokenModel = require('../models/blackListToken.model');
const { validationResult } = require('express-validator');
const rideModel = require('../models/ride.model');

// module.exports.registerCaptain = async (req, res, next) => {

//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const { fullname, email, password, vehicle } = req.body;

//     const isCaptainAlreadyExist = await captainModel.findOne({ email });

//     if (isCaptainAlreadyExist) {
//         return res.status(400).json({ message: 'Captain already exist' });
//     }


//     const hashedPassword = await captainModel.hashPassword(password);

//     const captain = await captainService.createCaptain({
//         firstname: fullname.firstname,
//         lastname: fullname.lastname,
//         email,
//         password: hashedPassword,
//         color: vehicle.color,
//         plate: vehicle.plate,
//         capacity: vehicle.capacity,
//         vehicleType: vehicle.vehicleType
//     });

//     const token = captain.generateAuthToken();

//     res.status(201).json({ token, captain });

// }

module.exports.registerCaptain = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password, vehicle, lng, lat } = req.body; // <-- Add lng, lat

    const isCaptainAlreadyExist = await captainModel.findOne({ email });

    if (isCaptainAlreadyExist) {
        return res.status(400).json({ message: 'Captain already exist' });
    }

    const hashedPassword = await captainModel.hashPassword(password);

    const captain = await captainService.createCaptain({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashedPassword,
        color: vehicle.color,
        plate: vehicle.plate,
        capacity: vehicle.capacity,
        vehicleType: vehicle.vehicleType,
        lng,   // <-- Add this
        lat    // <-- And this
    });

    const token = captain.generateAuthToken();

    res.status(201).json({ token, captain });
}


module.exports.loginCaptain = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const captain = await captainModel.findOne({ email }).select('+password');

    if (!captain) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await captain.comparePassword(password);

    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = captain.generateAuthToken();

    res.cookie('token', token);

    res.status(200).json({ token, captain });
}

module.exports.getCaptainProfile = async (req, res, next) => {
    res.status(200).json({ captain: req.captain });
}

module.exports.logoutCaptain = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];

    await blackListTokenModel.create({ token });

    res.clearCookie('token');

    res.status(200).json({ message: 'Logout successfully' });
}

// below code using chatgpt

module.exports.updateLocation = async (req, res) => {
    const captainId = req.captain._id; // from auth middleware
    const { lng, lat } = req.body;

    if (lng == null || lat == null) {
        return res.status(400).json({ message: 'lng and lat are required.' });
    }

    try {
        const updatedCaptain = await captainService.updateLocation(captainId, lng, lat);
        if (!updatedCaptain) {
            return res.status(404).json({ message: 'Captain not found.' });
        }
        res.status(200).json({ message: 'Location updated successfully.', captain: updatedCaptain });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports.getCaptainStats = async (req, res) => {
    try {
        const captainId = req.params.id;

        // Get today's date range
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        // Find all rides for this captain today
        const ridesToday = await rideModel.find({
            captain: captainId,
            status: 'completed',
            updatedAt: { $gte: startOfDay, $lte: endOfDay }
        });

        // Calculate earnings and total rides
        const earningsToday = ridesToday.reduce((sum, ride) => sum + (ride.fare || 0), 0);
        const totalRides = await rideModel.countDocuments({ captain: captainId });

        // For demo: fake online time as 4 hours (14400 seconds)
        // You can implement real tracking if you want
        const onlineTime = 4 * 3600;

        res.json({
            earningsToday,
            totalRides,
            onlineTime
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
