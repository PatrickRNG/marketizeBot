const functions = require('firebase-functions');
const {dialogflow,Permission} = require('actions-on-google');
const request = require('request');
const rp = require('request-promise');
 
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
                // const API_URL = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${long}&radius=500&types=supermarket&name=mercado&key=${API_KEY}`;
                const API_URL = "https://viacep.com.br/ws/01310200/json/";

                // request(API_URL, function(err, response, body) {
                //     // let market = response['results'][0]['name'];
                //     return conv.close(`O mercado mais barato é: ${response["bairro"]}`);
                // });

                var options = {
                    uri: 'https://viacep.com.br/ws/01310200/json/',
                    headers: {
                        'User-Agent': 'Request-Promise'
                    },
                    json: true // Automatically parses the JSON string in the response
                };
                 
                rp(options)
                    .then(function (repos) {
                        conv.close(`O mercado mais barato é: ${repos["bairro"]}`);
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
                
            } else {
                return conv.close('Sorry, I could not figure out where you are.');
            }
            
        }
    } else {
        return conv.close('Sorry, permission denied.');
    }
});
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);

/* apis

http://dev.virtualearth.net/REST/v1/Locations/av%20paulista%202300?include=queryParse&o=json&key=AtH19x_lk5injBwyhlvguL9IJDhLU7C1JAFGcBJ1FQNd7HpCFxxKDPY98W6s0vSg

http://dev.virtualearth.net/REST/v1/locationrecog/-46.64896,-23.54486?key=AtH19x_lk5injBwyhlvguL9IJDhLU7C1JAFGcBJ1FQNd7HpCFxxKDPY98W6s0vSg&output=json

https://api.mapbox.com/geocoding/v5/mapbox.places/super%20mercado.json?proximity=-46.64896393464835,-23.544864644676096&access_token=pk.eyJ1IjoibWFya2V0aXplYXBwIiwiYSI6ImNqbXY4OWpoMzAweDcza252OXpkNnh4bTYifQ.9-FyCPCayVSOkqjf5y4jPQ

firebase login
firebase init

*/
