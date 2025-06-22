const axios = require('axios');
const captainModel = require('../models/captain.model');

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

module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }

    const apiKey = process.env.GO_MAPS_API;

    const url = `https://maps.gomaps.pro/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

    try {


        const response = await axios.get(url);
        if (response.data.status === 'OK') {

            if (response.data.rows[ 0 ].elements[ 0 ].status === 'ZERO_RESULTS') {
                throw new Error('No routes found');
            }

            return response.data.rows[ 0 ].elements[ 0 ];
        } else {
            throw new Error('Unable to fetch distance and time');
        }

    } catch (err) {
        console.error(err);
        throw err;
    }
}

module.exports.getAutoCompleteSuggestions = async (input) => {
    if (!input) {
        throw new Error('query is required');
    }

    const apiKey = process.env.GO_MAPS_API;

    // Build both API URLs
    const autocompleteUrl = `https://maps.gomaps.pro/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;
    const queryAutocompleteUrl = `https://maps.gomaps.pro/maps/api/place/queryautocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;

    try {
        // Run both APIs in parallel
        const [autocompleteRes, queryAutocompleteRes] = await Promise.all([
            axios.get(autocompleteUrl),
            axios.get(queryAutocompleteUrl)
        ]);

        let suggestions = [];

        // Collect from Place Autocomplete
        if (autocompleteRes.data.status === 'OK' && autocompleteRes.data.predictions) {
            suggestions = suggestions.concat(
                autocompleteRes.data.predictions.map(pred => pred.description)
            );
        }

        // Collect from Query Autocomplete
        if (queryAutocompleteRes.data.status === 'OK' && queryAutocompleteRes.data.predictions) {
            suggestions = suggestions.concat(
                queryAutocompleteRes.data.predictions.map(pred => pred.description)
            );
        }

        // Remove duplicates and filter out falsy values
        const uniqueSuggestions = [...new Set(suggestions)].filter(Boolean);

        if (uniqueSuggestions.length === 0) {
            throw new Error('No suggestions found');
        }

        return uniqueSuggestions;

    } catch (err) {
        console.error(err);
        throw new Error('Unable to fetch suggestions');
    }
}

module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {

    // radius in km

    // mongoDB makes this query for you
    const captains = await captainModel.find({
        location: {
            $geoWithin: {
                $centerSphere: [ [ ltd, lng ], radius / 6371 ]
            }
        }
    });

    return captains;


}
