 const captainModel = require('../models/captain.model');


// module.exports.createCaptain = async ({
//     firstname, lastname, email, password, color, plate, capacity, vehicleType
// }) => {
//     if (!firstname || !email || !password || !color || !plate || !capacity || !vehicleType) {
//         throw new Error('All fields are required');
//     }
//     const captain = captainModel.create({
//         fullname: {
//             firstname,
//             lastname
//         },
//         email,
//         password,
//         vehicle: {
//             color,
//             plate,
//             capacity,
//             vehicleType
//         }
//     })

//     return captain;
// }

module.exports.createCaptain = async ({
    firstname, lastname, email, password, color, plate, capacity, vehicleType, lng, lat
}) => {
    if (!firstname || !email || !password || !color || !plate || !capacity || !vehicleType || lng == null || lat == null) {
        throw new Error('All fields are required');
    }
    const captain = await captainModel.create({
        fullname: {
            firstname,
            lastname
        },
        email,
        password,
        vehicle: {
            color,
            plate,
            capacity,
            vehicleType
        },
        location: {
            type: "Point",
            coordinates: [lng, lat]
        }
    });

    return captain;
}

// below code using chatgpt

// module.exports.updateLocation = async (captainId, lng, lat) => {
//     const captain = await captainModel.findById(captainId);
//     if (!captain) {
//         return null;
//     }
//     captain.location = {
//         type: 'Point',
//         coordinates: [lng, lat]
//     };
//     await captain.save();
//     return captain;
// };

module.exports.updateLocation = async (captainId, lng, lat) => {
    const captain = await captainModel.findById(captainId);
    if (!captain) {
        return null;
    }
    if (lng != null && lat != null) {
        captain.location = {
            type: 'Point',
            coordinates: [lng, lat]
        };
    }
    await captain.save();
    return captain;
};
