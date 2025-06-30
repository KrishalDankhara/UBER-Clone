const axios = require('axios');
const captainModel = require('../models/captain.model');

// Get coordinates from address using OpenStreetMap Nominatim
module.exports.getAddressCoordinate = async (address) => {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
    try {
        const response = await axios.get(url, {
            headers: { 'User-Agent': 'UberCloneDemo/1.0 (your@email.com)' }
        });
        if (response.data && response.data.length > 0) {
            const loc = response.data[0];
            return {
                lat: parseFloat(loc.lat),
                lng: parseFloat(loc.lon)
            };
        } else {
            throw new Error('No results found for the provided address.');
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// Get distance and time between two addresses using OSM+OSRM
module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }

    // Nominatim does NOT provide routes (just geocode). We need OSRM or other!
    // For demo, fallback: use Nominatim for geocode, and just use straight-line "as crow flies" distance

    // 1. Geocode both points
    const [originRes, destRes] = await Promise.all([
        axios.get(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(origin)}&format=json&limit=1`, {
            headers: { 'User-Agent': 'UberCloneDemo/1.0 (test@email.com)' }
        }),
        axios.get(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(destination)}&format=json&limit=1`, {
            headers: { 'User-Agent': 'UberCloneDemo/1.0 (test@email.com)' }
        })
    ]);
    if (!originRes.data.length || !destRes.data.length) {
        throw new Error('Location not found');
    }
    const originLoc = originRes.data[0];
    const destLoc = destRes.data[0];

    // Calculate straight-line distance (Haversine)
    function toRad(deg) {
        return deg * (Math.PI / 180);
    }
    function haversine(lat1, lon1, lat2, lon2) {
        const R = 6371e3; // meters
        const φ1 = toRad(lat1), φ2 = toRad(lat2);
        const Δφ = toRad(lat2 - lat1);
        const Δλ = toRad(lon2 - lon1);

        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                  Math.cos(φ1) * Math.cos(φ2) *
                  Math.sin(Δλ/2) * Math.sin(Δλ/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        return R * c; // meters
    }

    const distance = haversine(
        parseFloat(originLoc.lat),
        parseFloat(originLoc.lon),
        parseFloat(destLoc.lat),
        parseFloat(destLoc.lon)
    );
    // Estimate: 40km/hr speed for duration
    const duration = distance / (40 * 1000 / 3600); // seconds

    console.log('[getDistanceTime] origin:', origin, '->', destination);
    console.log('[getDistanceTime] coords:', originLoc, destLoc);
    console.log('[getDistanceTime] distance:', distance, 'meters, duration:', duration, 'seconds');

    return {
        distance: { value: distance, text: `${(distance/1000).toFixed(1)} km` },
        duration: { value: duration, text: `${Math.round(duration/60)} mins` }
    };
};


// Free autocomplete with Nominatim (OpenStreetMap)
// Free autocomplete with Nominatim (OpenStreetMap)
module.exports.getAutoCompleteSuggestions = async (input) => {
    if (!input || input.length < 2) {
        throw new Error('Query is required and must be at least 2 characters.');
    }
    // Nominatim doesn't have official autocomplete, but we use &limit=5 for top results
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(input)}&format=json&limit=5&addressdetails=1`;
    try {
        const response = await axios.get(url, {
            headers: { 'User-Agent': 'UberCloneDemo/1.0 (your@email.com)' }
        });
        if (!response.data || response.data.length === 0) {
            throw new Error('No suggestions found');
        }
        // Return display names as suggestions
        return response.data.map(r => r.display_name);
    } catch (err) {
        console.error(err);
        throw new Error('Unable to fetch suggestions');
    }
}


// Unchanged: MongoDB geospatial query
module.exports.getCaptainsInTheRadius = async (lng, lat, radius) => {
    if (
        typeof lng !== 'number' || isNaN(lng) ||
        typeof lat !== 'number' || isNaN(lat) ||
        typeof radius !== 'number' || isNaN(radius)
    ) {
        throw new Error('Longitude, latitude, and radius must all be valid numbers');
    }
    // Note: Make sure your coordinates order in MongoDB is [lng, lat] and has a 2dsphere index
    console.log('Looking for captains near:', lng, lat, radius);
    const captains = await captainModel.find({
        location: {
            $geoWithin: {
                $centerSphere: [[lng, lat], radius / 6371]
            }
        }
    });
    console.log('Found captains:', captains);
    return captains;
}
