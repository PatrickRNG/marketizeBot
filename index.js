'use strict';
 
const functions = require('firebase-functions');
const {dialogflow,Permission} = require('actions-on-google');
const request = require('request');
 
const app = dialogflow();

const API_KEY = 'AIzaSyC_k3f5E7yhya_wjnAXswo9sQly-WEJfa8';

app.intent('CriarLista - produtos - yes', (conv) => {
    conv.data.requestedPermission = 'DEVICE_PRECISE_LOCATION';
    return conv.ask(new Permission({
        context: 'Para te localizar',
        permissions: conv.data.requestedPermission,
    }));
});
app.intent('CriarLista - location_permission', (conv, params, permissionGranted) => {
    if (permissionGranted) {
    const {requestedPermission} = conv.data;
    if (requestedPermission === 'DEVICE_PRECISE_LOCATION') {
     
        const {coordinates} = conv.device.location;
         
        if (coordinates) {
            let lat = coordinates.latitude;
            let long = coordinates.longitude;
            const API_URL = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${long}&radius=500&types=supermarket&name=mercado&key=${API_KEY}`;
            request(API_URL, function(err, response, body) {
                return conv.close(`You are at ${response}`);
            });
        } else {
        // Note: Currently, precise locaton only returns lat/lng coordinates on phones and lat/lng coordinates
        // and a geocoded address on voice-activated speakers
        // Coarse location only works on voice-activated speakers..
        return conv.close('Sorry, I could not figure out where you are.');
        }
         
        }
    } else {
        return conv.close('Sorry, permission denied.');
    }
});
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
