const socketIo = require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');

let io;

function initializeSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: 'https://uber-clone-frontend-kayc.onrender.com',
            methods: [ 'GET', 'POST' ],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);


        socket.on('join', async (data) => {
            const { userId, userType } = data;

            if (userType === 'user') {
                await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
            } else if (userType === 'captain') {
                await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
            }
        });


        // socket.on('update-location-captain', async (data) => {
        //     const { userId, location } = data;

        //     if (!location || !location.ltd || !location.lng) {
        //         return socket.emit('error', { message: 'Invalid location data' });
        //     }

        //     await captainModel.findByIdAndUpdate(userId, {
        //         location: {
        //             ltd: location.ltd,
        //             lng: location.lng
        //         }
        //     });
        // });

        socket.on('update-location-captain', async (data) => {
    const { userId, location } = data;

    // Accept both 'lat' or 'ltd' key for latitude (typo tolerance)
    const lat = location.lat || location.ltd;
    const lng = location.lng;

    if (
        typeof lat !== 'number' ||
        typeof lng !== 'number' ||
        isNaN(lat) ||
        isNaN(lng)
    ) {
        return socket.emit('error', { message: 'Invalid location data' });
    }

    await captainModel.findByIdAndUpdate(userId, {
        location: {
            type: 'Point',
            coordinates: [lng, lat]
        }
    });
});


        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
}

const sendMessageToSocketId = (socketId, messageObject) => {

console.log(messageObject);

    if (io) {
        io.to(socketId).emit(messageObject.event, messageObject.data);
    } else {
        console.log('Socket.io not initialized.');
    }
}

module.exports = { initializeSocket, sendMessageToSocketId };