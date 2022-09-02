import generateToken from "./here-authentication.js";
import { here_apiKey } from '../config.js'


const request = (url, params = {}, method = 'GET', token = '') => {
    let options = {
        method
    };
    if ('GET' === method) {
        url += '?' + (new URLSearchParams(params)).toString();
    } else {
        options.body = JSON.stringify(params);
    }

    if (token != '') {
        options.headers = {
            'Authorization': 'Bearer ' + token
        }
    }

    return fetch(url, options).then(response => response.json()).catch(function (err) {
        // Log any errors
        console.log('something went wrong', err);

    });
};
const get = (url, params, token) => request(url, params, 'GET', token);
const post = (url, params) => request(url, params, 'POST');

var Mymap = (() => {

    var map = null;
    // Define a variable holding SVG mark-up that defines an icon image:
    var svgMarkup = '<svg width="24" height="24" ' +
        'xmlns="http://www.w3.org/2000/svg">' +
        '<rect stroke="white" fill="#1b468d" x="1" y="1" width="22" ' +
        'height="22" /><text x="12" y="18" font-size="12pt" ' +
        'font-family="Arial" font-weight="bold" text-anchor="middle" ' +
        'fill="white">H</text></svg>';
    // Create an icon, an object holding the latitude and longitude, and a marker:
    var icon = new H.map.Icon(svgMarkup);

    var init = (coordinates) => {
        const platform = new H.service.Platform({
            'apikey': here_apiKey
        });




        // Obtain the default map types from the platform object:
        const defaultLayers = platform.createDefaultLayers();

        // Instantiate (and display) a map:
        map = new H.Map(
            document.getElementById("map"),
            defaultLayers.raster.normal.transit, {
            zoom: 15,
            center: coordinates
        });

        // MapEvents enables the event system
        // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
        const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

    }

    var addMarker = (coords) => {
        var marker = new H.map.Marker(coords, { icon: icon });

        // Add the marker to the map and center the map at the location of the marker:
        map.addObject(marker);
    }

    return {
        Init: init,
        addMarker: addMarker
    }

})()

var here = (() => {

    let token = "";

    var init = async () => {
        token = document.cookie != "" ? JSON.parse(document.cookie) : {};

        if (token.access_token == undefined) {
            await generateToken();
            token = JSON.parse(document.cookie)
        }
    }

    var getStations = async (coords) => {

        await init();
        get('https://transit.hereapi.com/v8/stations', { in: coords, maxPlaces: 50, return: 'transport' }, token.access_token)
            .then(response => {

                let { stations } = response;

                stations.forEach((station) => {

                    // get only subway transport
                    if (station.transports != undefined) {
                        
                        if (station.transports.find((x) => x.mode == 'subway') != undefined) {
                          
                            Mymap.addMarker(station.place.location);

                            station.transports.forEach((val,index)=>{
                                getGeoCoding(val.headsign+' Los Angeles').then(res=>console.log(res));
                            })
                        }

                    }

                })
            })
    }

    // here map get 500 meter radius stations so need new centre to search from 
    var getNewCentre = (lat, long) => {

        var meters = 0.2;
        // number of km per degree = ~111km (111.32 in google maps, but range varies
        //    between 110.567km at the equator and 111.699km at the poles)
        var coef = meters / 111.32;

        var new_lat = lat + coef;

        // pi / 180 ~= 0.01745
        var new_long = long + coef / Math.cos(lat * 0.01745);

        return {
            lat: new_lat,
            lng: new_long
        }


    }

    var getGeoCoding = (address) => {
        return get('https://geocode.search.hereapi.com/v1/geocode', { q: address, in: 'countryCode:USA', apiKey: here_apiKey })
            .then(response => response);


    }

    return {
        getStations: getStations,
        getNewCentre: getNewCentre,
        getGeoCoding: getGeoCoding
    }



})()

Mymap.Init({ lat: 34.052235, lng: -118.243683 });


here.getStations('34.056197,-118.234249')


